import type { H3Event } from "h3"

import { serverSupabaseUser } from '#supabase/server'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'

export async function createPortalSession(this: H3Event) {
	try {
		const user = await serverSupabaseUser(this)

		if (!user) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: getReasonPhrase(StatusCodes.UNAUTHORIZED),
			})
		}

		const paddle = usePaddle(this)

		// 获取客户ID
		const customersPages = paddle.customers.list({
			email: [user.email!],
			search: 'email'
		})
		const customers = await customersPages.next()
		console.info('customers', customers)
		const customerId = customers[0].id

		// 获取订阅ID
		const subsPages = paddle.subscriptions.list({ customerId: [customerId] })
		const subs = await subsPages.next()
		console.info('subs', subs)
		const subId = subs[0].id

		const portalSession = await paddle.customerPortalSessions.create(customerId, [subId])

		return { portalSession }
	} catch (error) {
		return { error }
	}
}
