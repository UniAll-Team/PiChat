<template>
	<div class="images-groups-container">
		<div v-for="imageGroup in imageGroups"
			:key="imageGroup.lastModifiedDate"
			class="images-group-container">
			<h3>{{ imageGroup.lastModifiedDate }}</h3>
			<div class="images-container">
				<div v-for="image in imageGroup.images"
					:key="image.id" :ref="observerLastImage"
					:data-id="String(image.id)" class="image-wrapper">
					<button class="select-btn"
						:class="{ 'selected': isSelectedImage(image) }"
						@click.stop="toggleSelect(image)">
						<UIcon v-if="isSelectedImage(image)"
							name="i-heroicons-check" class="text-white" />
						<UIcon v-else name="i-heroicons-plus"
							class="text-gray-700" />
					</button>

					<img :src="image.url" :alt="image.alt ?? ''"
						@click="handleImageClick(image)"
						class="gallery-image"
						:class="{ 'selectable': hasSelectedImages }"
						loading="lazy" /> <!-- 添加懒加载 -->
				</div>
			</div>
		</div>
	</div>

	<!-- 加载中 -->
	<div class="h-full grid place-content-center">
		<UIcon v-show="loading" name="i-line-md-loading-loop"
			class="sm:w-14 sm:h-14 md:w-32 md:h-32 text-primary" />
	</div>

	<UModal v-model="showPreview" :ui="{
		container: 'items-center justify-center',
		width: 'max-w-[90vw]',
		height: 'max-h-[90vh]',
		background: 'bg-black bg-opacity-90',
		padding: 'p-0',
		overlay: {
			background: 'bg-black/80'
		}
	}">
		<div class="fixed top-12 right-12 z-10">
			<UButton icon="i-heroicons-x-mark" color="white"
				@click="closePreview" />
		</div>
		<div
			class="flex items-center justify-center w-full h-full">
			<img :src="previewImage?.url"
				:alt="previewImage?.alt || ''"
				class="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain" />
		</div>
	</UModal>
</template>

<i18n lang="yaml">
en:
  loading: Loading...
  complete: No more data
  error:
    title: Failed to load
    message: Failed to load. You can click {link} to contact us.
    link: here
  modalCloseButtonAlt: Close the preview

zh-Hans:
  loading: 加载中……
  complete: 没有更多数据
  error:
    title: 加载失败
    message: 加载失败，你可以点击{link}联系我们。
    link: 这里
  modalCloseButtonAlt: 关闭预览

de:
  loading: Wird geladen...
  complete: Keine weiteren Daten
  error:
    title: Laden fehlgeschlagen
    message: Laden fehlgeschlagen. Sie können {link} klicken,
      um uns zu kontaktieren.
    link: hier
  modalCloseButtonAlt: Vorschau schließen

ar:
  loading: جار التحميل...
  complete: لا توجد بيانات إضافية
  error:
    title: فشل التحميل
    message: فشل التحميل. يمكنك النقر فوق {link} للاتصال بنا.
    link: هنا
  modalCloseButtonAlt: إغلاق المعاينة
</i18n>

<script lang="ts" setup>
import type { Database } from '~/types/database'
import type { Image, Images } from '~/types/image'

import { endOfDay, startOfDay } from 'date-fns'
import _ from 'lodash'

const { t } = useI18n()

// 定义组件的 props
const { description, refreshID } = defineProps<{
	description: string,
	refreshID: string,
}>()

const supabase = useSupabaseClient<Database>()
const { toastError } = useAppToast()

const isSearching = computed(() => Boolean(description))

const { createVoyageEmbedding } = useServerFunctions()

// 获取图片列表
const { dateRange } = storeToRefs(useDateRangeStore())

const { imageGroups, observerLastImage, loading, error, hasMore } = useImageGroups()

// 图片选择相关
const { selectedImages, hasSelectedImages } = storeToRefs(useImagesStore())

const {
	showPreview,
	previewImage,
	isSelectedImage,
	toggleSelect,
	handleImageClick,
	closePreview
} = useImagePicker()

function useImageGroups() {
	type ImageGroup = {
		lastModifiedDate: string
		images: Images
	}
	type ImageGroups = ImageGroup[]

	let page = 1
	const pageSize = 30

	const imageGroups = ref<ImageGroups>([])
	const loading = ref(false)
	const error = ref(false)
	const hasMore = ref(true)

	const dateRangeISO = computed(() => ({
		start: startOfDay(dateRange.value.start).toISOString(),
		end: endOfDay(dateRange.value.end).toISOString(),
	}))

	let lastImageID: number

	const format = useLocaleDate()

	let observer = new IntersectionObserver(async ([entry]) => {
		console.debug('Intersection entry:', entry)
		console.debug('hasMore:', hasMore.value)
		console.debug('loading:', loading.value)

		if (entry.isIntersecting) {
			await loadMore()
			// 已经不是最后一张图片，取消观察
			observer.unobserve(entry.target)
		}
	})

	onUnmounted(() => {
		observer.disconnect()
	})

	async function reload() {
		try {
			// 重置状态
			reset()
			// 加载数据
			await loadMore()
		} catch (err) {
			error.value = true
			toastError(t('error.title'), err.message)
		}
	}

	// 监听刷新ID变化
	watchThrottled(() => refreshID, reload, { immediate: true, throttle: 3000 })

	// 监听搜索条件变化
	watchDebounced(
		[
			() => description,
			() =>
				`${dateRangeISO.value.start}_${dateRangeISO.value.end}`
		],
		reload,
		{ debounce: 1000 },
	)

	function observerLastImage(el: HTMLDivElement) {
		// 如果元素不存在或不是最后一张图片，不观察
		if (!el || Number(el.dataset.id) != lastImageID) return

		if (!hasMore.value) {
			// 如果没有更多数据，observer 不再观察
			console.debug('observer disconnect')
			observer.disconnect()
			return
		}

		// 观察最后一张图片
		observer.observe(el)
	}

	async function getImages() {
		const { data, error } = await supabase
			.from('image_details')
			.select(imageColumns)
			.gte('last_modified_date', dateRangeISO.value.start)
			.lte('last_modified_date', dateRangeISO.value.end)
			.order('last_modified_date', { ascending: false })
			.range((page - 1) * pageSize, page * pageSize - 1)

		if (error) {
			throw error
		}

		return data
	}

	async function searchImages() {
		let query_embedding: number[]
		{
			const { embedding, error } = await createVoyageEmbedding({ text: description })
			if (error)
				throw error

			console.debug('searchImages, embedding:', embedding)
			query_embedding = embedding
		}

		const { data, error } = await supabase
			.rpc('search_images', {
				query_embedding: `[${query_embedding}]`
			})
			.gte('similarity', 0.2)
			.gte('last_modified_date', dateRangeISO.value.start)
			.lte('last_modified_date', dateRangeISO.value.end)
			.order('similarity', { ascending: false })
			.limit(pageSize)
		if (error)
			throw error

		return data
	}

	// 重置加载状态
	function reset() {
		imageGroups.value = []
		hasMore.value = true
		loading.value = false
		error.value = false
		page = 1
	}

	async function loadMore() {
		try {
			if (loading.value || !hasMore.value) return

			console.debug('loadMore, description:', description)

			loading.value = true
			error.value = false

			const data = <Images>await (isSearching.value ? searchImages() : getImages())

			console.debug('data', data)

			if (data.length < pageSize || isSearching.value) {
				// 如果数据不足一页，或者是搜索，没有更多数据
				hasMore.value = false

				if (_isEmpty(data)) {
					// 如果没有数据，直接返回
					return
				}
			}

			// 记录最后一张图片
			lastImageID = data[data.length - 1].id

			// 处理数据
			const newImageGroups = _(data)
				.map(image => {
					// console.debug('image', image)

					const lastModified = image.user_metadata?.lastModified
					const lastModifiedDate = format(lastModified)

					// console.debug('lastModifiedDate', lastModifiedDate)

					const url = supabase
						.storage
						.from('images')
						.getPublicUrl(image.name)
						.data
						.publicUrl

					return {
						...image,
						lastModified,
						lastModifiedDate,
						url,
					}
				})
				.groupBy('lastModifiedDate')
				.entries()
				.map(([lastModifiedDate, images]) => ({ lastModifiedDate, images }))
				.orderBy('images.lastModified', 'desc')
				.value()

			console.debug('newImageGroups', newImageGroups)

			// 添加到列表
			imageGroups.value.push(...newImageGroups)
			// 页面加一
			page++
		} catch (error) {
			error.value = true
			toastError(t('error.title'), error.message)
		} finally {
			loading.value = false
		}
	}

	return {
		imageGroups,
		observerLastImage,
		loading,
		hasMore,
		error,
	}
}

function useImagePicker() {
	const showPreview = ref(false)
	const previewImage = ref(null)

	// 方法
	function toggleSelect(image: Image) {
		if (_(selectedImages.value).some(['id', image.id])) {
			_remove(selectedImages.value, ['id', image.id])
		} else {
			selectedImages.value.push(image)
		}
	}

	// 点击图片
	function handleImageClick(image: Image) {
		if (hasSelectedImages.value) {
			toggleSelect(image)
		} else {
			previewImage.value = image
			showPreview.value = true
		}
	}

	// 关闭预览
	function closePreview() {
		showPreview.value = false
		previewImage.value = null
	}

	function isSelectedImage(image: Image) {
		return _some(selectedImages.value, ['id', image.id])
	}

	return {
		showPreview,
		previewImage,
		isSelectedImage,
		toggleSelect,
		handleImageClick,
		closePreview,
	}
}
</script>

<style lang="scss" scoped>
// 图片列表样式
.images-groups-container {
	display: grid;
	grid-template-rows: repeat(auto-fill, auto);
	gap: 1.5rem;
	/* 添加 contain 优化 */
	contain: layout;
}

.images-group-container {
	display: grid;
	grid-template-rows: auto 1fr;
	/* 添加 contain 优化 */
	content-visibility: auto;
	contain-intrinsic-size: auto 200px;

	@media (width<=640px) {
		contain-intrinsic-size: auto 150px;
	}
}

.images-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
	gap: 10px;

	@media (width<=640px) {
		grid-template-columns: repeat(auto-fill, minmax(min(150px, 100%), 1fr));
	}
}

.image-wrapper {
	position: relative;
	aspect-ratio: 1;
	overflow: hidden;
	border-radius: 0.5rem;
}

.gallery-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	cursor: pointer;
	transition: transform 0.3s ease;
	/* 优化变换性能 */
	will-change: transform;

	&:hover {
		transform: scale(1.05);
	}

	&.selectable {
		cursor: default;
	}
}

.select-btn {
	position: absolute;
	top: 0.5rem;
	left: 0.5rem;
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	background-color: rgb(255 255 255 / 0.8);
	border: 2px solid #fff;
	cursor: pointer;
	display: grid;
	place-items: center;
	z-index: 1;
	transition: all 0.3s ease;

	&:hover {
		background-color: rgb(255 255 255);
	}

	&.selected {
		@apply bg-primary border-primary;
	}
}
</style>
