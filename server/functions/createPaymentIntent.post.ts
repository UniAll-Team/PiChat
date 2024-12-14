import type { H3Event } from "h3"

import { useServerStripe } from "#stripe/server"
import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'


export async function createPaymentIntent(this: H3Event, lookup_key: string, origin?: string) {
	try {
		const stripe = await useServerStripe(this)
		const supabase = serverSupabaseServiceRole(this)
		const user = await serverSupabaseUser(this)

		if (!user) {
			throw createError({
				statusCode: 401,
				message: "Unauthorized",
			})
		}

		let customer_id = user.app_metadata?.stripe?.customer_id
		if (!customer_id) {
			const customer = await stripe.customers.create({
				email: user.email,
				name: user.user_metadata?.full_name,
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

		if (user.user_metadata.plan != "free") {
			throw createError({
				statusCode: 400,
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
			success_url: origin ? `${origin}/success` : undefined,
		})

		if (session.url) {
			return { url: session.url }
		}
	} catch (error) {
		return { error }
	}
}
