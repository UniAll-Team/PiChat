import { serverSupabaseServiceRole } from '#supabase/server'
import { H3Error } from 'h3'
import { StatusCodes } from 'http-status-codes'

export default eventHandler(async event => {
	try {
		const config = useRuntimeConfig(event)
		const supabase = serverSupabaseServiceRole(event)

		// Verify webhook signature
		const isValidWebhook = await isValidGitHubWebhook(event)

		if (!isValidWebhook) {
			throw createError({
				statusCode: StatusCodes.UNAUTHORIZED,
				message: 'Unauthorized: webhook is not valid',
			})
		}

		const body = await readBody(event)
		const eventType = body.alert_name
		const userId = body.passthrough?.user_id

		if (!userId) {
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				statusMessage: "Missing user ID in payload",
			})
		}

		async function getUserAppMetadata(userID: string) {
			const { data: { user }, error } = await supabase.auth.admin.getUserById(userID)

			if (error) throw error
			if (!user)
				throw createError({
					statusCode: StatusCodes.NOT_FOUND,
					message: "User not found",
				})

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

			const { data: { user }, error } = await supabase.auth.admin.updateUserById(userID, {
				app_metadata: {
					...app_metadata,
					plan: {
						...app_metadata?.plan,
						name,
						cycle,
					},
				},
			})

			if (error) throw error
			return user
		}

		async function getPlanFromPaddleId(planId: string) {
			// Implement mapping from Paddle plan ID to your internal plan structure
			// This should match your pricing page implementation
			const plans: Record<string, { name: string; cycle: string }> = {
				'12345': { name: 'basic', cycle: 'month' },
				'67890': { name: 'pro', cycle: 'month' },
				// Add more mappings as needed
			}

			return plans[planId] || { name: 'free', cycle: 'month' }
		}

		// 根据事件类型获取用户ID
		// switch (eventType) {
		// 	case 'customer.subscription.created':
		// 	case 'customer.subscription.deleted':
		// 	case 'customer.subscription.updated':
		// 	case 'invoice.payment_succeeded':
		// 		const customerID = stripeEvent.data.object.customer as string
		// 		const customer = await stripe.customers.retrieve(customerID) as Stripe.Customer
		// 		var userID = customer.metadata.user_id
		// 		break
		// 	case 'customer.deleted':
		// 		var userID = stripeEvent.data.object.metadata.user_id
		// 		break
		// 	default:
		// 		console.warn(`Unhandled event type ${stripeEvent.type}.`)
		// 		return { received: true }
		// }

		// 根据事件类型更新用户信息
		switch (eventType) {
			case 'subscription_created':
			case 'subscription_updated':
				const planId = body.subscription_plan_id
				const plan = await getPlanFromPaddleId(planId)
				await updateUserPlan(userId, plan)
				break
			case 'subscription_cancelled':
				await updateUserPlan(userId, { name: 'free', cycle: 'month' })
				break
			case 'payment_succeeded':
				if (body.alert_name === 'subscription_payment_succeeded') {
					const appMetadata = await getUserAppMetadata(userId)
					await supabase.auth.admin.updateUserById(userId, {
						app_metadata: {
							...appMetadata,
							plan: {
								...appMetadata?.plan,
								cycle_indexed_count: 0,
							}
						},
					})
				}
				break
			default:
				console.warn(`Unhandled Paddle event type: ${eventType}`)
				return { received: true }
		}
		return { success: true }
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
