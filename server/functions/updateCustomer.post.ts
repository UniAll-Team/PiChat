import type { H3Event } from "h3"

import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { StatusCodes, getReasonPhrase } from 'http-status-codes'
import _ from 'lodash'

export async function updateCustomer(this: H3Event, customerId: string) {
	try {
		const user = await serverSupabaseUser(this)
		// 要使用service role，因为要更新用户的app_metadata，普通的 client role 没有权限
		const supabase = serverSupabaseServiceRole(this)

		if (!user)
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: getReasonPhrase(StatusCodes.UNAUTHORIZED),
			})

		const paddle = usePaddle(this)

		// 将customer的id存到user的app_metadata中
		let app_metadata = user.app_metadata || {}
		_.set(app_metadata, 'paddle.customerId', customerId)

		// 最重要的一步，将用户id存到customer的customData中
		const customer = await paddle.customers.update(customerId, {
			name: user.user_metadata.full_name,
			customData: {
				userId: user.id
			}
		})

		// 更新用户的app_metadata
		const { data, error } = await supabase.auth.admin.updateUserById(user.id, {
			app_metadata
		})

		if (error)
			throw error

		return { data: { user: data.user, customer } }
	} catch (error) {
		return { error }
	}
}
