import type { H3Event } from 'h3'
import OpenAI from 'openai'

export async function createImageEmbedding(this: H3Event, signedUrl: string) {
	const config = useRuntimeConfig(this)

	const openai = new OpenAI({
		apiKey: config.openai.apiKey,
		baseURL: config.openai.baseURL
	})

	const document = await createDocument(openai, signedUrl)

	let embedding
	if (document) {
		embedding = await createEmbedding(openai, document)
	}

	return {
		document,
		embedding
	}
}
