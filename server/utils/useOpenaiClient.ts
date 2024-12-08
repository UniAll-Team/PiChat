import type { H3Event } from 'h3'

import HttpsProxyAgent from 'https-proxy-agent'
import OpenAI from 'openai'

export function useOpenAI(event: H3Event) {
	const config = useRuntimeConfig(event)

	return new OpenAI({
		apiKey: config.openai.apiKey,
		httpAgent: config.useProxy ? new HttpsProxyAgent(config.proxy.http) : undefined,
	})
}
