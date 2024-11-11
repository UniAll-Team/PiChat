<template>
	<UDashboardPage>
		<UDashboardPanel grow>
			<UDashboardNavbar>
				<template #left>
					<!-- 在移动端搜索框聚焦时隐藏 -->
					<HomeDateRangePicker v-model="range"
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
								取消
							</span>
						</UButton>
						<UButton icon="i-heroicons-arrow-down-tray"
							color="gray" variant="outline"
							@click="downloadSelectedImages">
							<span class="hidden-on-mobile">
								下载
							</span>
						</UButton>
						<UButton icon="i-heroicons-trash" color="red"
							variant="outline"
							@click="deleteSelectedImages">
							<span class="hidden-on-mobile">
								删除
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
								上传
							</span>
						</UButton>

						<UInput placeholder="Search"
							v-model="imageDescription"
							icon="i-heroicons-magnifying-glass"
							color="gray" autocomplete="off"
							variant="outline"
							:ui="{ icon: { trailing: { pointer: '' } } }"
							:class="{ 'mobile-search-focused': isSearchFocused, 'mobile-search-input': !isSearchFocused }"
							@focus="handleSearchFocus"
							@blur="handleSearchBlur"
							@keyup.enter="handleSearch">
							<template #trailing>
								<UButton v-show="imageDescription !== ''"
									class='hidden-on-mobile' color="gray"
									variant="link" icon="i-heroicons-x-mark"
									:padded="false"
									@click="imageDescription = ''" />
							</template>
						</UInput>
					</template>

				</template>
			</UDashboardNavbar>

			<UDashboardPanelContent>
				<ImageGallery :key="uploadID" />
			</UDashboardPanelContent>
		</UDashboardPanel>
	</UDashboardPage>

	<UploadModal v-model="isUploadModalOpen"
		@complete="onComplete" />
</template>

<script lang="ts" setup>
import type { Meta, UploadResult } from '@uppy/core'
import type { Range } from '~/types/dashboard'
import type { Database } from '~/types/database'

import { downloadZip } from 'client-zip'
import { sub } from 'date-fns'

definePageMeta({
	layout: 'dashboard',
})

const supabase = useSupabaseClient<Database>()
const user = useSupabaseUser()

const { toastError, toastSuccess } = useAppToast()

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })

// 搜索框聚焦状态
const {
	isSearchFocused,
	handleSearchFocus,
	handleSearchBlur
} = useSearchStyles()
// 搜索处理函数
const { imageDescription, handleSearch } = useSearchAction()

// 上传模态框状态
const { openUploadModal, isUploadModalOpen } = useUploadModal()
// 上传处理函数
const { uploadID, onComplete } = useUploadAction()

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
	async function handleSearch() {
		if (!imageDescription.value.trim()) return

		try {
			// 这里添加您的搜索逻辑
			// 例如：
			// await searchImages(imageDescription.value)
			console.debug('Searching for:', imageDescription.value)
		} catch (error) {
			console.error('Search failed:', error)
		}
	}

	return {
		imageDescription,
		handleSearch,
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
	// 上传 ID
	const uploadID = ref('0')
	// 上传完成后的处理函数
	function onComplete(result: UploadResult<Meta, Record<string, never>>) {
		console.debug('Upload complete:', result)
		uploadID.value = result.uploadID
	}

	return {
		uploadID,
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
				title: '删除失败',
				description: error.message,
			})
			return
		}

		uploadID.value = data[0].id

		toastSuccess({
			title: '删除成功',
			description: '选中的图片已被删除',
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
			title: '下载成功',
			description: '选中的图片已被下载',
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
