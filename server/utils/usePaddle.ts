import type { H3Event } from 'h3'

import { Environment, LogLevel, Paddle } from '@paddle/paddle-node-sdk'

export function usePaddle(event: H3Event) {
	const config = useRuntimeConfig(event)

	return new Paddle(config.paddle.apiKey, {
		environment: config.public.paddle.environment as Environment,
		logLevel: LogLevel.verbose
	})
}
