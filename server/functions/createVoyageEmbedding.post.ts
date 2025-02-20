import type { H3Event } from 'h3'
import type { MultimodalEmbedRequestInputType } from 'voyageai/api'

import { VoyageAIClient } from "voyageai"

export async function createVoyageEmbedding(this: H3Event, { imageUrl, text }: { imageUrl?: string, text?: string }) {
	try {
		const voyage = new VoyageAIClient({
			apiKey: process.env.VOYAGE_API_KEY,
		})

		if (!(imageUrl || text)) {
			return {
				document: null,
				embedding: null
			}
		}

		let content, inputType: MultimodalEmbedRequestInputType
		if (imageUrl) {
			content = [{
				type: "image_url",
				imageUrl
			}]
			inputType = "document"
		} else {
			content = [{
				type: "text",
				text
			}]
			inputType = "query"
		}

		const response = await voyage.multimodalEmbed({
			inputs: [{ content }],
			inputType,
			model: "voyage-multimodal-3"
		})

		return { embedding: response.data?.[0].embedding }
	} catch (error) {
		console.error(error)
		return { error }
	}
}
