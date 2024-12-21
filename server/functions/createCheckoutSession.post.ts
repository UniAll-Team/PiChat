import type { H3Event } from "h3"

import { useServerStripe } from "#stripe/server"
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export async function createCheckoutSession(this: H3Event, lookup_key: string, origin?: string) {
	try {
		const stripe = await useServerStripe(this)
		const supabase = serverSupabaseServiceRole(this)
		const user = await serverSupabaseUser(this)

		if (!user) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: getReasonPhrase(StatusCodes.UNAUTHORIZED),
			})
		}

		let customer_id: string = user.app_metadata.stripe?.customer_id
		if (!customer_id) {
			const customer = await stripe.customers.create({
				email: user.email,
				name: user.user_metadata?.full_name,
				metadata: {
					user_id: user.id,
				}
			})

			customer_id = customer.id

			const { error } = await supabase.auth.admin.updateUserById(user.id, {
				app_metadata: {
					...user.app_metadata,
					stripe: {
						customer_id,
					},
				},
			})

			if (error) {
				throw error
			}
		}

		const plan = user.app_metadata?.plan
		if (plan && plan.name && plan.name != "free") {
			// 存在付费计划，且不是免费计划，不允许再次购买
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				message: "User already has a paid plan",
			})
		}

		const prices = await stripe.prices.list({
			lookup_keys: [lookup_key],
			expand: ['data.product'],
		})

		const session = await stripe.checkout.sessions.create({
			customer: customer_id,
			billing_address_collection: 'auto',
			line_items: [
				{
					price: prices.data[0].id,
					quantity: 1,
				},
			],
			mode: 'subscription',
			metadata: {
				user_id: user.id,
			},
			success_url: origin ? `${origin}/checkout-success` : undefined,
		})

		if (session.url) {
			return { url: session.url }
		}
	} catch (error) {
		return { error }
	}
}
