import type { H3Event } from "h3"

import { useServerStripe } from "#stripe/server"
import { serverSupabaseUser } from '#supabase/server'

export async function createPortalSession(this: H3Event, origin?: string) {
	try {
		const stripe = await useServerStripe(this)
		const user = await serverSupabaseUser(this)

		if (!user) {
			throw createError({
				statusCode: 401,
				message: "Unauthorized",
			})
		}

		const customerID: string = user.app_metadata.stripe?.customer_id

		if (!customerID) {
			throw createError({
				statusCode: 400,
				message: "User has no customer_id",
			})
		}

		const portalSession = await stripe.billingPortal.sessions.create({
			customer: customerID,
			return_url: `${origin}/update-success`,
		})

		return { url: portalSession.url }
	} catch (error) {
		return { error }
	}
}
