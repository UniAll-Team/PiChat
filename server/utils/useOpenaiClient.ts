import type { H3Event } from 'h3'
import type { ClientOptions } from 'openai'

import HttpsProxyAgent from 'https-proxy-agent'
import OpenAI from 'openai'

export function useOpenAI(event: H3Event) {
	const config = useRuntimeConfig(event)

	const options: ClientOptions = {
		apiKey: config.openai.apiKey
	}
	if (config.openai.useProxy) {
		options.httpAgent = new HttpsProxyAgent(config.proxy.http)
	}
	return new OpenAI(options)
}
