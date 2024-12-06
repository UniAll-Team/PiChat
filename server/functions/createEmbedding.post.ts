import type { H3Event } from 'h3'

export async function createImageEmbedding(this: H3Event, signedUrl: string) {
	const openai = useOpenAI(this)

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
