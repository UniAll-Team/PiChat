<template>
	<DashboardModal :uppy="uppy" :open="isOpen" :onRequestCloseModal="handleClose" :width="800" :height="550"
		:props="{ onRequestCloseModal: handleClose }" note="只能上传图片，免费用户最大上传 5MB，pro 用户最大上传 10MB"
		:locale="{ strings: locale_strings }" />
</template>

<script lang="ts" setup>
import type { Meta, UploadResult } from '@uppy/core'
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { DashboardModal } from '@uppy/vue'
import Webcam from '@uppy/webcam'
import * as math from 'mathjs'
import { customAlphabet } from 'nanoid'
import { alphanumeric } from 'nanoid-dictionary'

// Don't forget the CSS: core and UI components + plugins you are using
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

const { toastError } = useAppToast()

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const session = useSupabaseSession()

const config = useRuntimeConfig()
const supabaseConfig = config.public.supabase

const userQuota = await useUserRemainingQuota()

const galleryStore = useGalleryStore()

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

const nanoid = customAlphabet(alphanumeric)

const uppy = new Uppy({
	restrictions: {
		maxNumberOfFiles: userQuota.value.uploadQuota,
		maxTotalFileSize: userQuota.value.storageQuota,
		maxFileSize: userQuota.value.fileSizeLimit,
		allowedFileTypes: ['image/*'],
	},
}).use(Tus, {
	endpoint: `${supabaseConfig.url}/storage/v1/upload/resumable`,
	headers: {
		authorization: `Bearer ${session.value?.access_token}`,
		apikey: supabaseConfig.key,
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
			lastModified: (file.data as File).lastModified,
		})
	}

	console.debug('file-added', file)
})

uppy.on('upload-error', (file, error) => {
	if (error.message === 'Request Entity Too Large') {
		toastError({ title: '文件过大，请重新选择' })
	} else {
		toastError({ title: '上传失败，请重试', description: error.message })
	}
})

uppy.on('upload-success', async (file, response) => {
	const { data, error } = await supabase
		.storage
		.from('images')
		.list(user.value.id, {
			limit: 1,
			sortBy: { column: 'updated_at', order: 'desc' },
		})

	if (error) {
		toastError({ title: '上传失败，请重试', description: error.message })
		return
	}

	console.debug('upload-success', data)

	galleryStore.lastObjectId = data?.[0]?.id
})

uppy.on('complete', (result) => {
	console.info('complete', result)
	emit('complete', result)
})

function handleClose() {
	isOpen.value = false
}
</script>

<style lang="scss" scoped></style>
