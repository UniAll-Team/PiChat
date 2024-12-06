import type { H3Event } from 'h3'

export async function text2embedding(this: H3Event, text: string) {
	const openai = useOpenAI(this)

	const embedding = await createEmbedding(openai, text)

	return embedding
}
