import type { H3Event } from 'h3'

import { serverSupabaseServiceRole, serverSupabaseUser } from '#supabase/server'
import { StatusCodes } from 'http-status-codes'

export async function deleteUser(this: H3Event) {
	try {
		const supabase = serverSupabaseServiceRole(this)
		const user = await serverSupabaseUser(this)

		if (!user) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				statusMessage: '无法获取用户信息',
			})
		}

		return supabase.auth.admin.deleteUser(user.id, true)
	} catch (error) {
		return { error }
	}
}
