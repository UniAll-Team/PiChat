import OpenAI from 'openai'

export async function createEmbedding(openai: OpenAI, document: string) {
	const embedding = await openai.embeddings.create({
		model: 'text-embedding-3-large',
		input: document,
		encoding_format: 'float'
	})

	return embedding.data[0].embedding
}
