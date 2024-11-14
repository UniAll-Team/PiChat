<template>
	<UDashboardPage>
		<UDashboardPanel grow>
			<UDashboardNavbar>
				<template #left>
					<!-- 在移动端搜索框聚焦时隐藏 -->
					<HomeDateRangePicker v-model="dateRange"
						class="-ml-2.5"
						:class="{ 'hidden-on-mobile': isSearchFocused }" />
				</template>

				<template #right>

					<!-- 当图片被选中时显示图片操作 -->
					<template v-if="hasSelectedImages">
						<UButton icon="i-heroicons-x-mark" color="gray"
							variant="outline"
							@click="resetSelectedImages">
							<span class="hidden-on-mobile">
								{{ t('actions.cancel') }}
							</span>
						</UButton>
						<UButton icon="i-heroicons-arrow-down-tray"
							color="gray" variant="outline"
							@click="downloadSelectedImages">
							<span class="hidden-on-mobile">
								{{ t('actions.download') }}
							</span>
						</UButton>
						<UButton icon="i-heroicons-trash" color="red"
							variant="outline"
							@click="deleteSelectedImages">
							<span class="hidden-on-mobile">
								{{ t('actions.delete') }}
							</span>
						</UButton>
					</template>

					<!-- 没有被选中的图片时正常布局 -->
					<template v-else="!hasSelectedImages">
						<!-- 在移动端搜索框聚焦时隐藏 -->
						<UButton icon="i-heroicons-arrow-up-tray"
							color="gray" variant="outline"
							@click="openUploadModal"
							:class="{ 'hidden-on-mobile': isSearchFocused }">
							<span class="hidden-on-mobile">
								{{ t('actions.upload') }}
							</span>
						</UButton>

						<UInput :placeholder="t('placeholders.search')"
							v-model="imageDescription"
							icon="i-heroicons-magnifying-glass"
							color="gray" autocomplete="off"
							variant="outline"
							:ui="{ icon: { trailing: { pointer: '' } } }"
							:class="{ 'mobile-search-focused': isSearchFocused, 'mobile-search-input': !isSearchFocused }"
							@focus="handleSearchFocus"
							@blur="handleSearchBlur"
							@change="handleSearch"
							@input="handleClearSearch">
							<template #trailing>
								<UButton v-show="imageDescription !== ''"
									class='hidden-on-mobile' color="gray"
									variant="link" icon="i-heroicons-x-mark"
									:padded="false" @click="clearSearch" />
							</template>
						</UInput>
					</template>

				</template>
			</UDashboardNavbar>

			<UDashboardPanelContent>
				<ImageGallery :key="galleryID" :dateRange
					:description.trim="imageDescription" />
			</UDashboardPanelContent>
		</UDashboardPanel>
	</UDashboardPage>

	<UploadModal v-model="isUploadModalOpen"
		@complete="onComplete" />
</template>

<i18n lang="yaml">
en:
  actions:
    cancel: Cancel
    download: Download
    delete: Delete
    upload: Upload
    search: Search

  messages:
    deleteSuccess:
      title: Delete Successful
      description: Selected images have been deleted
    deleteError:
      title: Delete Failed
    downloadSuccess:
      title: Download Successful
      description: Selected images have been downloaded

  placeholders:
    search: Search

zh-Hans:
  actions:
    cancel: 取消
    download: 下载
    delete: 删除
    upload: 上传
    search: 搜索

  messages:
    deleteSuccess:
      title: 删除成功
      description: 选中的图片已被删除
    deleteError:
      title: 删除失败
    downloadSuccess:
      title: 下载成功
      description: 选中的图片已被下载

  placeholders:
    search: 搜索

ar:
  actions:
    cancel: إلغاء
    download: تحميل
    delete: حذف
    upload: تحميل
    search: بحث

  messages:
    deleteSuccess:
      title: تم الحذف بنجاح
      description: تم حذف الصور المحددة
    deleteError:
      title: فشل الحذف
    downloadSuccess:
      title: تم التحميل بنجاح
      description: تم تحميل الصور المحددة

  placeholders:
    search: بحث
</i18n>

<script lang="ts" setup>
import type { Meta, UploadResult } from '@uppy/core'
import type { Range } from '~/types/dashboard'
import type { Database } from '~/types/database'

import { downloadZip } from 'client-zip'
import { sub } from 'date-fns'

const { t } = useI18n()

definePageMeta({
	layout: 'dashboard',
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { toastError, toastSuccess } = useAppToast()

const nanoid = newSafeNanoid()
const galleryID = ref(nanoid())

const dateRange = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })

// 搜索框聚焦状态
const {
	isSearchFocused,
	handleSearchFocus,
	handleSearchBlur
} = useSearchStyles()
// 搜索处理函数
const { imageDescription, handleSearch, clearSearch, handleClearSearch } = useSearchAction()

// 上传模态框状态
const { openUploadModal, isUploadModalOpen } = useUploadModal()
// 上传处理函数
const { onComplete } = useUploadAction()

// 图片选择状态
const imagesStore = useImagesStore()
const { resetSelectedImages } = imagesStore
const {
	selectedImages,
	hasSelectedImages,
} = storeToRefs(imagesStore)
// 图片操作函数
const { deleteSelectedImages, downloadSelectedImages } = useImagesAction()

function useSearchStyles() {
	const isSearchFocused = ref(false)

	const handleSearchFocus = () => {
		isSearchFocused.value = true
	}

	const handleSearchBlur = () => {
		isSearchFocused.value = false
	}

	return {
		isSearchFocused,
		handleSearchFocus,
		handleSearchBlur,
	}
}

function useSearchAction() {
	const imageDescription = ref('')

	// 搜索处理函数
	function handleSearch() {
		console.debug('Searching:', imageDescription.value)

		galleryID.value = nanoid()
	}

	// 清空搜索框
	function handleClearSearch() {
		if (Boolean(imageDescription.value)) {
			return
		}

		clearSearch()
	}

	function clearSearch() {
		imageDescription.value = ''
		console.debug('Clear search')

		galleryID.value = nanoid()
	}

	return {
		imageDescription,
		handleSearch,
		clearSearch,
		handleClearSearch,
	}
}

function useUploadModal() {
	const isUploadModalOpen = ref(false)
	const openUploadModal = () => {
		isUploadModalOpen.value = true
	}

	return {
		isUploadModalOpen,
		openUploadModal,
	}
}

function useUploadAction() {
	// 上传完成后的处理函数
	function onComplete(result: UploadResult<Meta, Record<string, never>>) {
		console.debug('Upload complete:', result)
		// 刷新图片列表
		galleryID.value = nanoid()
	}

	return {
		onComplete,
	}
}

function useImagesAction() {
	// 删除选中的图片
	async function deleteSelectedImages() {
		if (!hasSelectedImages.value) return

		console.warn('Deleting selected images:', selectedImages.value)

		const { data, error } = await supabase
			.storage
			.from('images')
			.remove(_map(selectedImages.value, 'name'))

		if (error) {
			toastError({
				title: t('messages.deleteError.title'),
				description: error.message,
			})
			return
		}

		galleryID.value = data[0].id

		toastSuccess({
			title: t('messages.deleteSuccess.title'),
			description: t('messages.deleteSuccess.description'),
		})

		resetSelectedImages()
	}

	async function downloadSelectedImages() {
		const link = document.createElement('a')

		if (selectedImages.value.length == 1) {
			// 只有一张图片时直接下载
			const { data } = supabase
				.storage
				.from('images')
				.getPublicUrl(selectedImages.value[0].name, {
					download: true,
				})

			link.href = data.publicUrl
			link.download = selectedImages.value[0].user_metadata.customName
		} else {
			const promises = _map(selectedImages.value,
				async image => {
					return {
						name: addSuffix(image.user_metadata.customName),
						lastModified: image.user_metadata.lastModified,
						input: await fetch(image.url)
					}
				})

			const results = await Promise.allSettled(promises)

			const downloads = results
				.filter(result => result.status === 'fulfilled' && result.value.input.ok)
				.map((result: PromiseFulfilledResult<any>) => result.value)

			const blob = await downloadZip(downloads).blob()

			link.href = URL.createObjectURL(blob)
			link.download = 'images.zip'

		}

		link.click()

		if (selectedImages.value.length > 1) {
			URL.revokeObjectURL(link.href)
		}
		link.remove()

		toastSuccess({
			title: t('messages.downloadSuccess.title'),
			description: t('messages.downloadSuccess.description'),
		})

		resetSelectedImages()
	}

	return {
		deleteSelectedImages,
		downloadSelectedImages,
	}
}
</script>

<style lang="scss" scoped>
@media (width<=768px) {
	.mobile-search-focused {
		position: absolute;
		left: 1rem;
		right: 1rem;
		top: 1rem;
		z-index: 10;
	}

	.mobile-search-input {
		width: 4.2rem;
	}
}
</style>
