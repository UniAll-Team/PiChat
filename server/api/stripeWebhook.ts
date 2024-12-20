import type Stripe from 'stripe'

import { useServerStripe } from "#stripe/server"
import { serverSupabaseServiceRole } from '#supabase/server'

export default eventHandler(async event => {
	try {
		const config = useRuntimeConfig(event)
		const stripe = await useServerStripe(event)

		const supabase = serverSupabaseServiceRole(event)

		const body = await readRawBody(event, false)
		const signature = getHeader(event, 'stripe-signature')

		if (!body) {
			throw createError({
				statusCode: 400,
				message: "Invalid request body",
			})
		}

		if (!signature) {
			throw createError({
				statusCode: 400,
				message: "Invalid stripe-signature",
			})
		}

		async function getUserAppMetadata(userID: string) {
			const { data: { user }, error } = await supabase.auth.admin.getUserById(userID)

			if (error) {
				throw createError({
					statusCode: 400,
					message: error.message,
				})
			}
			if (!user) {
				throw createError({
					statusCode: 400,
					message: "User not found",
				})
			}

			return user.app_metadata
		}

		async function updateUserPlan(userID: string, { name, cycle }: { name?: string, cycle?: string }) {
			if (!(name || cycle)) {
				throw createError({
					statusCode: 400,
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

			var { error } = await supabase.auth.admin.updateUserById(userID, {
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
				throw createError({
					statusCode: 400,
					message: error.message,
				})
			}
		}

		const stripeEvent = stripe.webhooks.constructEvent(
			body,
			signature,
			config.stripe.webhookSecret
		)

		// 根据事件类型获取用户ID
		switch (stripeEvent.type) {
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
				await updateUserPlan(userID, { name: 'free' })
				break
			case 'customer.subscription.updated':
				const lookup_key = stripeEvent.data.object.items.data[0].price.lookup_key
				await updateUserPlan(userID, lookupKey2Plan(lookup_key))
				break
			case 'customer.deleted':
				const appMetadata = await getUserAppMetadata(userID)
				const { error } = await supabase.auth.admin.updateUserById(userID, {
					app_metadata: {
						...appMetadata,
						stripe: {
							...appMetadata?.stripe,
							customer_id: null,
						}
					},
				})
				if (error) {
					throw createError({
						statusCode: 400,
						message: error.message,
					})
				}
				break
		}
		return { received: true }
	} catch (error) {
		console.error(error)
		return sendError(event, error as Error)
	}
})
