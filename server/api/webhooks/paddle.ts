import type { UserAppMetadata } from '@supabase/supabase-js'

import { serverSupabaseServiceRole } from '#supabase/server'
import { ApiError, Customer, EventName } from '@paddle/paddle-node-sdk'
import { H3Error } from 'h3'
import { StatusCodes } from 'http-status-codes'
import _ from 'lodash'

export default eventHandler(async event => {
	try {
		const config = useRuntimeConfig(event)

		const signature = getHeader(event, 'paddle-signature')
		if (!signature)
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				statusMessage: "Invalid stripe-signature",
			})
		const body = await readRawBody(event)
		if (!body)
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				statusMessage: "Invalid request body",
			})

		const paddle = usePaddle(event)
		const eventData = await paddle.webhooks.unmarshal(
			body,
			config.webhook.paddle.webhookId,
			signature,
		)


		// 自定义属性全部用camelCase，内置属性全部用snake_case
		let userId: string
		let customer: Customer
		let customerId: string
		// 根据事件类型获取用户id和customer id，如果有必要则更新customer的customData
		switch (eventData.eventType) {
		case EventName.SubscriptionCreated:
			customerId = eventData.data.customerId
			// 如果是SubscriptionCreated事件，从customData中获取userId
			const customData: any = eventData.data.customData
			userId = customData.userId
			// 将userId存入customer的customData中,并更新customer的name
			customer = await paddle.customers.update(customerId, {
				name: customData.fullName,
				customData: {
					userId
				}
			})
			break

		case EventName.SubscriptionCanceled:
		case EventName.SubscriptionUpdated:
		case EventName.SubscriptionPaused:
		case EventName.SubscriptionResumed:
			customerId = eventData.data.customerId
			customer = await paddle.customers.get(customerId)
			// 如果是已经存在的订阅事件，从customer的customData中获取userId
			userId = (customer.customData as any)?.userId
			break

		default:
			console.warn(`Unhandled event type ${eventData.eventType}.`)
			return
		}


		// supabase设置
		const supabase = serverSupabaseServiceRole(event)
		async function getUser(userID: string) {
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
			return user
		}
		async function updateUser(userID: string, app_metadata: UserAppMetadata) {
			const { data: { user }, error } = await supabase.auth.admin.updateUserById(userID, {
				app_metadata,
			})

			if (error) {
				throw error
			}

			if (!user) {
				throw createError({
					statusCode: StatusCodes.NOT_FOUND,
					message: "User not found",
				})
			}

			return user
		}

		// 获取用户信息
		let user = await getUser(userId)
		let app_metadata = user.app_metadata
		// 将customer id存入app_metadata
		_.set(app_metadata, 'paddle.customerId', customerId)

		// 校验occurredAt是否已经处理过
		// 从用户信息中获取上次的webhook事件对象
		const lastWebhookEvent = app_metadata?.paddle?.lastWebhookEvent
		// 根据lastWebhookEvent获取lastOccurredAt
		const lastOccurredAt = lastWebhookEvent?.occurredAt
		// 如果lastOccurredAt存在，将其两个日期从iso格式转为Date对象进行比较
		if (lastOccurredAt) {
			const lastOccurredAtDate = new Date(lastOccurredAt)
			const currentOccurredAtDate = new Date(eventData.occurredAt)
			// 如果当前事件的日期小于上次事件的日期，返回
			if (currentOccurredAtDate < lastOccurredAtDate) {
				return user
			}
		}
		// 如果lastOccurredAt不存在或者当前事件的日期大于上次事件的日期，更新用户信息
		_.set(app_metadata, 'paddle.lastWebhookEvent', eventData)

		// 根据事件类型设置app_metadata.plan
		switch (eventData.eventType) {
		case EventName.SubscriptionCanceled:
		case EventName.SubscriptionPaused:
			_.set(app_metadata, 'plan.name', 'free')
			break
		case EventName.SubscriptionUpdated:
		case EventName.SubscriptionCreated:
		case EventName.SubscriptionResumed:
			// 获取订阅的name和cycle，name要转换为小写
			_.set(app_metadata, 'plan.name', eventData.data.items[0].product?.name.toLowerCase())
			_.set(app_metadata, 'plan.cycle', eventData.data.billingCycle.interval)
			break
		}

		// 如果是SubscriptionUpdated事件，且current_billing_period.starts_at变大，则重置cycle_indexed_count
		const currentStartsAt = new Date(eventData.data.currentBillingPeriod?.startsAt ?? 0)
		const lastStartsAt = new Date(lastWebhookEvent?.data?.currentBillingPeriod?.startsAt ?? 0)
		if (eventData.eventType === EventName.SubscriptionUpdated && currentStartsAt > lastStartsAt) {
			_.set(app_metadata, 'plan.cycle_indexed_count', 0)
		}

		// 更新用户信息
		user = await updateUser(userId, app_metadata)
		return user
	} catch (error) {
		// 打印出错误
		console.error(error)

		if (error instanceof ApiError) {
			error = createError({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				name: error.code,
				message: error.documentationUrl,
				statusMessage: error.detail,
				data: error,
			})
		} else if (error instanceof H3Error) {
			// 如果是 H3Error 类型的错误则不用处理
		} else if (error instanceof Error) {
			error = createError({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				statusMessage: error.message,
				data: error,
			})
		} else {
			error = createError({
				statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
				data: error,
			})
		}

		// 抛出 H3Error 类型的错误
		throw error
	}
})
