import type { H3Event } from 'h3'

import OpenAI from 'openai'
import { createEmbedding } from '../utils/createEmbedding'

export async function text2embedding(this: H3Event, text: string) {
	const config = useRuntimeConfig(this)

	const openai = new OpenAI({
		apiKey: config.openai.apiKey,
		baseURL: config.openai.baseURL
	})

	const embedding = await createEmbedding(openai, text)

	return embedding
}
