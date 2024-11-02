<template>
	<DashboardModal :uppy="uppy" :open="isOpen" :onRequestCloseModal="handleClose" :width="800" :height="550"
		:props="{ onRequestCloseModal: handleClose }" note="只能上传图片，免费用户最大上传 5MB，pro 用户最大上传 10MB"
		:locale="{ strings: locale_strings }" />
</template>

<script lang="ts" setup>
import Uppy from '@uppy/core'
import Tus from '@uppy/tus'
import { DashboardModal } from '@uppy/vue'
import Webcam from '@uppy/webcam'
import * as math from 'mathjs'

// Don't forget the CSS: core and UI components + plugins you are using
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

const { toastError } = useAppToast()

const user = useSupabaseUser()
const session = useSupabaseSession()

const config = useRuntimeConfig()
const supabaseConfig = config.public.supabase

const userQuota = await useUserRemainingQuota()

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
	file.meta = {
		...file.meta,
		bucketName: 'images',
		objectName: `${user.value.id}/${btoa(file.name)}`,
		contentType: file.type,
	}

	console.log('file-added', file.meta)
})

uppy.on('upload-error', (file, error) => {
	if (error.message === 'Request Entity Too Large') {
		toastError({ title: '文件过大，请重新选择' })
	} else {
		toastError({ title: '上传失败，请重试', description: error.message })
	}
})

uppy.on('upload-success', (file, response) => {
	console.log(file, response)
})

function handleClose() {
	isOpen.value = false
}
</script>

<style lang="scss" scoped></style>
