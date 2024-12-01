<template>
	<DashboardModal :uppy="uppy" :open="isOpen"
		:onRequestCloseModal="handleClose" :width="800"
		:height="550"
		:props="{ onRequestCloseModal: handleClose }" />
</template>

<i18n lang="yaml">
en:
  fileAdded: 'File added: {file}'
  uploadErrorLarge: 'File is too large, please select another one.'
  uploadErrorRetry: 'Upload failed, please try again: {error}'
  creatingIndex: 'Creating image index...'
  indexCreated: 'Image index creation completed.'
  getUserQuotaFailed: 'Failed to get user quota, please click on the left to contact support: {error}'
  fileExists: 'File already exists, no need to upload again.'
  createSignedURLError: 'Failed to create signed URL, please contact support: {error}'
  imageIndexFailed: 'Failed to create image index, please contact support.'
  updateIndexFailed: 'Failed to update image index, please contact support: {error}'
zh-Hans:
  fileAdded: '文件添加：{file}'
  uploadErrorLarge: '文件过大，请重新选择。'
  uploadErrorRetry: '上传失败，请重试：{error}'
  creatingIndex: '正在建立图片索引...'
  indexCreated: '图片索引建立完成。'
  getUserQuotaFailed: '获取用户配额失败，请点击左侧联系客服：{error}'
  fileExists: '文件已存在，无需重复上传。'
  createSignedURLError: '创建签名URL失败，请联系客服：{error}'
  imageIndexFailed: '创建图片索引失败，请联系客服。'
  updateIndexFailed: '更新图片索引失败，请联系客服：{error}'
ar:
  fileAdded: 'تمت إضافة الملف: {file}'
  uploadErrorLarge: 'الملف كبير جدًا، يرجى اختيار ملف آخر.'
  uploadErrorRetry: 'فشل التحميل، يرجى المحاولة مرة أخرى: {error}'
  creatingIndex: 'جارٍ إنشاء فهرس الصورة...'
  indexCreated: 'تم إنشاء فهرس الصورة بنجاح.'
  getUserQuotaFailed: 'فشل في الحصول على حصة المستخدم، يرجى النقر على اليسار للاتصال بالدعم: {error}'
  fileExists: 'الملف موجود بالفعل، لا حاجة لتحميله مرة أخرى.'
  createSignedURLError: 'فشل في إنشاء رابط موقع موقّع، يرجى الاتصال بالدعم: {error}'
  imageIndexFailed: 'فشل إنشاء فهرس الصورة، يرجى الاتصال بالدعم.'
  updateIndexFailed: 'فشل تحديث فهرس الصورة، يرجى الاتصال بالدعم: {error}'
</i18n>

<script lang="ts" setup>
import type { StorageApiError } from '@supabase/storage-js'
import type { Meta, UploadResult } from '@uppy/core'
import type { Database } from '~/types/database'

import Uppy from '@uppy/core'
import ar from '@uppy/locales/lib/ar_SA'
import en from '@uppy/locales/lib/en_US'
import zh_Hans from '@uppy/locales/lib/zh_CN'
import Tus from '@uppy/tus'
import { DashboardModal } from '@uppy/vue'
import Webcam from '@uppy/webcam'
import * as math from 'mathjs'

import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

const { t, locale } = useI18n()
const localeMap = {
	'en': en,
	'zh-Hans': zh_Hans,
	'ar': ar,
}

const { toastError, toastSuccess } = useAppToast()

const { createImageEmbedding } = useServerFunctions()

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()
const session = useSupabaseSession()

const config = useRuntimeConfig()
const supabaseConfig = config.public.supabase

const { error, userQuota } = await useUserQuota()

if (error) {
	toastError(t('getUserQuotaFailed', { error }))
}

const isOpen = defineModel<boolean>()
const emit = defineEmits<{
	complete: [result: UploadResult<Meta, Record<string, never>>]
}>()

const safeNanoid = newSafeNanoid()

const uppy = new Uppy({
	restrictions: {
		maxNumberOfFiles: userQuota.value.uploadRemaining,
		maxTotalFileSize: userQuota.value.storageRemaining,
		// maxFileSize: userQuota.value.fileSizeLimit,
		allowedFileTypes: ['image/*'],
	},
	locale: localeMap[locale.value],
	onBeforeFileAdded(file) {
		return {
			...file,
			id: `${file.id}-${safeNanoid()}`, // <--- the important part
		}
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
		const lastModified = (file.data as File).lastModified
		file.meta = {
			...file.meta,
			bucketName: 'images',
			objectName: `${user.value.id}/${safeNanoid()}.${fileExtension}`,
			contentType,
			metadata: JSON.stringify({
				// 上传文件的原始名称
				originalName: file.name,
				// 用户自定义的文件名
				customName: file.name,
				// 文件的最后修改时间
				lastModified,
				// @deprecated 文件的最后修改时间
				// lastModifiedDate: new Date(lastModified).toISOString(),
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
	toastError(t('uploadErrorRetry', { error: error.message }))
})

uppy.addPostProcessor(async (fileIDs: string[]) => {
	for (const [idx, fileID] of fileIDs.entries()) {
		const file = uppy.getFile(fileID)
		if (!file) {
			continue
		}

		const name = String(file.meta.objectName)

		uppy.emit('postprocess-progress', file, {
			mode: 'determinate',
			message: t('creatingIndex'),
			value: idx / fileIDs.length
		})

		await createEmbedding(name)

		uppy.emit('postprocess-complete', file, {
			mode: 'determinate',
			message: t('indexCreated'),
			value: (idx + 1) / fileIDs.length
		})
	}
})

uppy.on('complete', (result) => {
	console.info('complete', result)
	emit('complete', result)
})

function handleClose() {
	isOpen.value = false
}

async function getSignedUrl(name: string, width?: number, height?: number) {
	if (width && height) {
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
	}

	const { data, error } = await supabase
		.storage
		.from('images')
		.createSignedUrl(name, 7 * 60, options)

	return { signedUrl: data?.signedUrl, error }
}

async function updateEmbedding(name: string, embedding: any, document?: any) {
	const { error } = await supabase
		.from('images')
		.update({
			embedding,
			document,
		})
		.eq('name', name)

	return error
}

async function createEmbedding(name: string) {
	// 获取图片的签名URL
	const { signedUrl, error } = await getSignedUrl(name)
	if (error) {
		console.dir(error)

		if (error.name == 'StorageApiError' && (error as StorageApiError).status == 400) {
			toastError(t('fileExists'))
		} else {
			toastError(t('createSignedURLError', { error }))
		}

		return
	}
	console.debug('signedUrl', signedUrl)

	// 创建图片的embedding
	const { embedding, document } = await createImageEmbedding(signedUrl)
	console.debug('file', name, 'document', document, 'embedding', embedding)
	if (!(document && embedding)) {
		toastError(t('imageIndexFailed'))
		return
	}

	// 更新文件的embedding
	const updateError = await updateEmbedding(name, embedding, document)
	if (updateError) {
		console.error('updateError', updateError)
		toastError(t('updateIndexFailed', { error: updateError.message }))
		return
	}
}
</script>

<style lang="scss" scoped></style>
