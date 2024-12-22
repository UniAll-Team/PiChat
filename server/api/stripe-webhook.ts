import type Stripe from 'stripe'

import { useServerStripe } from "#stripe/server"
import { serverSupabaseServiceRole } from '#supabase/server'
import { H3Error } from 'h3'
import { StatusCodes } from 'http-status-codes'

export default eventHandler(async event => {
	try {
		const config = useRuntimeConfig(event)
		const stripe = await useServerStripe(event)

		const supabase = serverSupabaseServiceRole(event)

		const body = await readRawBody(event, false)
		const signature = getHeader(event, 'stripe-signature')

		if (!body) {
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				statusMessage: "Invalid request body",
			})
		}

		if (!signature) {
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				statusMessage: "Invalid stripe-signature",
			})
		}

		async function getUserAppMetadata(userID: string) {
			const { data: { user }, error } = await supabase.auth.admin.getUserById(userID)

			if (error) {
				throw error
			}
			if (!user) {
				throw createError({
					statusCode: StatusCodes.NOT_FOUND,
					message: "User not found",
				})
			}

			return user.app_metadata
		}

		async function updateUserPlan(userID: string, { name, cycle }: { name?: string, cycle?: string }) {
			if (!(name || cycle)) {
				throw createError({
					statusCode: StatusCodes.BAD_REQUEST,
					message: "Invalid plan",
				})
			}

			const app_metadata = await getUserAppMetadata(userID)

			if (!name) {
				name = app_metadata?.plan?.name || 'free'
			}
			if (!cycle) {
				cycle = app_metadata?.plan?.cycle || 'month'
			}

			var { data: { user }, error } = await supabase.auth.admin.updateUserById(userID, {
				app_metadata: {
					...app_metadata,
					plan: {
						...app_metadata?.plan,
						name,
						cycle,
					},
				},
			})

			if (error) {
				throw error
			}

			return user
		}

		const stripeEvent = stripe.webhooks.constructEvent(
			body,
			signature,
			config.stripe.webhookSecret
		)

		// 根据事件类型获取用户ID
		switch (stripeEvent.type) {
			case 'customer.subscription.created':
			case 'customer.subscription.deleted':
			case 'customer.subscription.updated':
				const customerID = stripeEvent.data.object.customer as string
				const customer = await stripe.customers.retrieve(customerID) as Stripe.Customer
				var userID = customer.metadata.user_id
				break
			case 'customer.deleted':
				var userID = stripeEvent.data.object.id
				break
			default:
				console.warn(`Unhandled event type ${stripeEvent.type}.`)
				return { received: true }
		}

		// 根据事件类型更新用户信息
		switch (stripeEvent.type) {
			case 'customer.subscription.deleted':
				var user = await updateUserPlan(userID, { name: 'free', cycle: 'month' })
				break
			case 'customer.subscription.created':
			case 'customer.subscription.updated':
				const lookup_key = stripeEvent.data.object.items.data[0].price.lookup_key
				var user = await updateUserPlan(userID, lookupKey2Plan(lookup_key))
				break
			case 'customer.deleted':
				const appMetadata = await getUserAppMetadata(userID)
				var { data: { user }, error } = await supabase.auth.admin.updateUserById(userID, {
					app_metadata: {
						...appMetadata,
						stripe: {
							...appMetadata?.stripe,
							customer_id: null,
						}
					},
				})
				if (error) {
					throw error
				}
				break
		}
		return user
	} catch (error) {
		// 打印出错误
		console.error(error)

		// 如果不是 H3Error 类型的错误，转换为 H3Error
		if (!(error instanceof H3Error)) {
			error = createError({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				data: error,
			})
		}

		// 抛出 H3Error 类型的错误
		throw error
	}
})
