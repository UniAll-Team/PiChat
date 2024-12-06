import type { OpenAI } from 'openai'

import { imageDocumentPrompt } from '../constants/prompts'

export async function createDocument(openai: OpenAI, imageURL: string) {
	const messages = [
		{
			role: "system",
			content: imageDocumentPrompt
		},
		{
			role: "user",
			content: [
				{
					type: "image_url",
					image_url: {
						url: imageURL
					}
				}
			]
		}
	]

	const completion = await openai.chat.completions.create({
		// @ts-ignore
		messages: messages,
		model: 'gpt-4o-mini',
	})

	console.debug(completion)

	const content = completion?.choices?.[0].message.content

	if (content) {
		return content
	} else {
		console.error('createDocument failed', completion)
		return null
	}
}
