import type { H3Event } from 'h3'
import type { MultimodalEmbedRequestInputType } from 'voyageai/api'
import type { UploadedImage } from '~/types'

import { serverSupabaseClient } from '#supabase/server'
import { StatusCodes } from 'http-status-codes'
import sharp from 'sharp'
import { VoyageAIClient } from "voyageai"
import { voyageLimit } from '~/constants/image'

export async function createVoyageEmbedding(this: H3Event, { image, text }: { image?: UploadedImage, text?: string }) {
	try {
		const config = useRuntimeConfig(this)
		const voyage = new VoyageAIClient({ apiKey: config.voyageAI.apiKey })

		if (!(image || text))
			throw createError({
				statusCode: StatusCodes.BAD_REQUEST,
				statusMessage: "Either image or text must be provided"
			})

		let content, inputType: MultimodalEmbedRequestInputType
		if (image?.signedUrl) {
			content = [{
				type: "image_url",
				imageUrl: image.signedUrl
			}]
			inputType = "document"
		} else if (image?.objectName) {
			const supabase = await serverSupabaseClient(this)
			const { data, error } = await supabase
				.storage
				.from('images')
				.download(image.objectName)

			if (error)
				throw error

			const imageBase64 = await blob2base64(data, {
				width: image.width,
				height: image.height
			})

			content = [{
				type: "image_base64",
				imageBase64
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

async function blob2base64(data: Blob, { width, height }: { width: number, height: number }) {
	const imageBuffer = await data.arrayBuffer()
	const image = sharp(imageBuffer)
	const { maxPixels, maxBytes } = voyageLimit

	// 调整图片尺寸以适应Voyage的限制
	const factor = Math.sqrt(width * height / maxPixels)
	if (factor > 1) {
		width = Math.floor(width / factor)
	}

	// 调整图片质量以适应Voyage的限制
	let quality = 95
	while (true) {
		quality -= 5
		var { data: resizedImageBuffer, info } = await image
			.resize({ width })
			.webp({ quality })
			.toBuffer({ resolveWithObject: true })

		// If image is within Voyage's limits
		if (info.size <= maxBytes)
			break
	}

	return `data:image/webp;base64,${resizedImageBuffer.toString('base64')}`
}
