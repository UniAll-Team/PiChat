<template>
	<DashboardModal :uppy="uppy" :open="isOpen"
		:onRequestCloseModal="handleClose" :width="800"
		:height="550"
		:props="{ onRequestCloseModal: handleClose }"
		note="只能上传图片，免费用户最大上传 5MB，pro 用户最大上传 10MB"
		:locale="{ strings: locale_strings }" />
</template>

<script lang="ts" setup>
import type { StorageApiError } from '@supabase/storage-js'
import type { Meta, UploadResult } from '@uppy/core'
import type { Database } from '~/types/database'

import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { DashboardModal } from '@uppy/vue'
import Webcam from '@uppy/webcam'
import * as math from 'mathjs'
const { createImageEmbedding } = useServerFunctions()

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

const { toastError, toastSuccess } = useAppToast()

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const session = useSupabaseSession()

const config = useRuntimeConfig()
const supabaseConfig = config.public.supabase

const { error, userQuota } = await useUserQuota()

if (error) {
	toastError({ title: '获取用户配额失败，请点击左侧联系客服', description: error.message })
}

const locale_strings = {
	chooseFiles: '选择文件',
	youHaveChosen: '你选择了',
	files: '文件',
	uploading: '上传中...',
	complete: '完成',
	uploadFailed: '上传失败',
	pleasePressRetry: '请重试',
	uploadPaused: '上传暂停',
	upload: '上传',
	retry: '重试',
	cancel: '取消',
	pause: '暂停',
	resume: '继续',
	cancelUpload: '取消上传',
	pauseUpload: '暂停上传',
	resumeUpload: '继续上传',
}

const isOpen = defineModel<boolean>()
const emit = defineEmits<{
	complete: [result: UploadResult<Meta, Record<string, never>>]
}>()

const nanoid = newSafeNanoid()


const uppy = new Uppy({
	restrictions: {
		maxNumberOfFiles: userQuota.value.uploadRemaining,
		maxTotalFileSize: userQuota.value.storageRemaining,
		maxFileSize: userQuota.value.fileSizeLimit,
		allowedFileTypes: ['image/*'],
	},
}).use(Tus, {
	endpoint: `${supabaseConfig.url}/storage/v1/upload/resumable`,
	headers: () => {
		return {
			authorization: `Bearer ${session.value?.access_token}`,
			apikey: supabaseConfig.key,
		}
	},
	// allowedMetaFields: [
	// 	'bucketName',
	// 	'objectName',
	// 	'contentType',
	// 	'cacheControl',
	// ],
	chunkSize: math.unit('6MB').toNumber('B'),
})
	.use(Webcam)

uppy.on('file-added', (file) => {
	const contentType = file.type
	const fileExtension = contentType.split('/')[1]

	// 创建一个临时的 URL，用于获取图片的宽高
	const url = URL.createObjectURL(file.data)
	const image = new Image()
	image.src = url

	image.onload = () => {
		// 设置文件的元数据，而且只能用赋值不能用 uppy.setFileMeta
		file.meta = {
			...file.meta,
			bucketName: 'images',
			objectName: `${user.value.id}/${nanoid()}.${fileExtension}`,
			contentType,
			metadata: JSON.stringify({
				// 上传文件的原始名称
				originalName: file.name,
				// 用户自定义的文件名
				customName: file.name,
				// 文件的最后修改时间
				lastModified: (file.data as File).lastModified,
				// 文件的大小
				width: image.naturalWidth,
				height: image.naturalHeight,
			})
		}

		// 释放 URL
		URL.revokeObjectURL(url)
		console.debug('file-added', file)
	}

	image.onerror = () => {
		// 释放 URL
		URL.revokeObjectURL(url)
	}
})

uppy.on('upload-error', (file, error) => {
	console.error('upload-error', file, error)
	if (error.message === 'Request Entity Too Large') {
		toastError({ title: '文件过大，请重新选择' })
	} else {
		toastError({ title: '上传失败，请重试', description: error.message })
	}
})

uppy.on('upload-success', async (file, response) => {
	console.debug('file', file, 'response', response)

	// 获取上传文件的信息
	const name = String(file.meta.objectName)
	const userMetadata = JSON.parse(String(file.meta.metadata))
	const { width, height }: { width: number, height: number } = userMetadata

	// 获取图片的签名URL
	const { signedUrl, error } = await useSignedUrl(name, width, height)
	if (error) {
		console.dir(error)

		if (error.name == 'StorageApiError' && (error as StorageApiError).status == 400) {
			toastSuccess({ title: '文件已存在，无需重复上传' })
		} else {
			toastError({ title: '创建签名URL失败，请点击左侧联系客服', description: error.message })
		}

		return
	}
	console.debug('signedUrl', signedUrl)

	// 创建图片的embedding
	const { embedding, document } = await createImageEmbedding(signedUrl)
	console.debug('file', name, 'document', document, 'embedding', embedding)
	if (!(document && embedding)) {
		toastError({ title: '创建图片索引失败，请点击左侧联系客服' })
		return
	}


	// 更新文件的embedding
	const updateError = await useUpdateEmbedding(name, embedding, document)
	if (updateError) {
		console.error('updateError', updateError)
		toastError({ title: '更新图片索引失败，请点击左侧联系客服', description: updateError.message })
		return
	}
})

uppy.on('complete', (result) => {
	console.info('complete', result)
	emit('complete', result)
})

function handleClose() {
	isOpen.value = false
}

async function useSignedUrl(name: string, width: number, height: number) {
	const { width: newWidth, height: newHeight } = resizeAspectRatio({ width, height })

	// 对比resize后的宽高和原始宽高，如果一样则不需要再次resize
	if (width == newWidth) {
		var options = {
			transform: {
				width: newWidth,
				height: newHeight,
				resize: 'contain' as const
			}
		}
	}

	const { data, error } = await supabase
		.storage
		.from('images')
		.createSignedUrl(name, 7 * 60, options)

	return { signedUrl: data?.signedUrl, error }
}

async function useUpdateEmbedding(name: string, embedding: any, document?: any) {
	const { error } = await supabase
		.from('images')
		.update({
			embedding,
			document,
		})
		.eq('name', name)

	return error
}
</script>

<style lang="scss" scoped></style>
