<template>
	<div>
		<div class="images-groups-container" ref="containerRef">
			<div v-for="imageGroupEntry in imageGroups"
				:key="imageGroupEntry[0]"
				class="images-group-container">
				<h3>{{ imageGroupEntry[0] }}</h3>
				<div class="images-container">
					<div v-for="image in imageGroupEntry[1]"
						:key="image.id" class="image-wrapper">
						<button class="select-btn"
							:class="{ 'selected': isSelectedImage(image) }"
							@click.stop="toggleSelect(image)">
							<UIcon v-if="isSelectedImage(image)"
								name="i-heroicons-check"
								class="text-white" />
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

			<!-- 加载状态指示器 -->
			<div ref="sentinel" class="loading-sentinel">
				<p v-show="loading">{{ t('loading') }}</p>
				<p v-show="error">{{ t('error.title') }}</p>
				<p v-show="!hasMore">{{ t('complete') }}</p>
			</div>
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
					variant="ghost" @click="closePreview" />
			</div>
			<div
				class="flex items-center justify-center w-full h-full">
				<img :src="previewImage?.url"
					:alt="previewImage?.alt || ''"
					class="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain" />
			</div>
		</UModal>
	</div>
</template>

<i18n lang="yaml">
en:
  loading: 'Loading...'
  complete: 'No more data'
  error:
    title: 'Failed to load'
    message: 'Failed to load. You can click {link} to contact us.'
    link: 'here'
  modalCloseButtonAlt: 'Close the preview'

zh-Hans:
  loading: '加载中……'
  complete: '没有更多数据'
  error:
    title: '加载失败'
    message: '加载失败，你可以点击{link}联系我们。'
    link: '这里'
  modalCloseButtonAlt: '关闭预览'

ar:
  loading: 'جار التحميل...'
  complete: 'لا توجد بيانات إضافية'
  error:
    title: 'فشل التحميل'
    message: 'فشل التحميل. يمكنك النقر فوق {link} للاتصال بنا.'
    link: 'هنا'
  modalCloseButtonAlt: 'إغلاق المعاينة'
</i18n>

<script lang="ts" setup>
import type { DateRange } from '~/types/dashboard'
import type { Database } from '~/types/database'
import type { Image, Images } from '~/types/image'

import _ from 'lodash'

const { t, locale } = useI18n()
const localeMap = {
	en: 'enUS',
	'zh-Hans': 'zhCN',
	ar: 'arSA',
}

// 定义组件的 props
const { description, dateRange, refreshID } = defineProps<{
	dateRange: DateRange,
	description: string,
	refreshID: string,
}>()

const supabase = useSupabaseClient<Database>()
const { toastError } = useAppToast()

const isSearching = computed(() => Boolean(description))

const dateRangeKey = computed(() =>
	`${dateRange.start.toISOString()}_${dateRange.end.toISOString()}`
)

const { text2embedding } = useServerFunctions()

// 获取图片列表
const { containerRef, imageGroups, loading, error, hasMore, sentinel } = useImageGroups()

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
	type ImageGroup = [string, Image[]]
	type ImageGroups = ImageGroup[]

	let page = 1
	const pageSize = 10

	const imageGroups = ref<ImageGroups>([])
	const containerRef = ref<HTMLElement | null>(null)
	const sentinel = ref<HTMLElement | null>(null)
	const loading = ref(false)
	const error = ref(false)
	const hasMore = ref(true)

	const format = useDateFormat()

	// 使用 Intersection Observer 替代 InfiniteLoading
	onMounted(async () => {
		const observer = new IntersectionObserver(async ([entry]) => {
			console.debug('Intersection entry:', entry)
			console.debug('hasMore:', hasMore.value)
			console.debug('loading:', loading.value)

			if (entry.isIntersecting && hasMore.value && !loading.value) {
				await loadMore()
			}
		})

		// 使用 nextTick 确保 DOM 已完全渲染
		await nextTick()

		const sentinelElement = sentinel.value
		if (sentinelElement) {
			observer.observe(sentinelElement)
			console.debug('Observer started')
		} else {
			console.error('Sentinel not found')
			// 可以添加降级处理逻辑
			loadMore() // 直接调用加载更多
		}

		return () => observer.disconnect()
	})

	// 监听搜索条件变化
	watch(
		[() => description, () => refreshID, dateRangeKey],
		_debounce(async () => {
			try {
				// 重置状态
				reset()
				await loadMore()
			} catch (err) {
				error.value = true
				toastError(t('error.title'), err.message)
			}
		}, 1000)
	)

	async function getImages() {
		const { data, error } = await supabase
			.from('image_details')
			.select(imageColumns)
			.gte('last_modified_date', dateRange.start.toISOString())
			.lte('last_modified_date', dateRange.end.toISOString())
			.order('last_modified_date', { ascending: false })
			.range((page - 1) * pageSize, page * pageSize - 1)

		if (error) {
			throw error
		}

		return data
	}

	async function searchImages() {
		const embedding = await text2embedding(description)

		const { data, error } = await supabase
			.rpc('search_images', {
				query_embedding: embedding
			})
			.gte('similarity', 0.3)
			.gte('last_modified_date', dateRange.start.toISOString())
			.lte('last_modified_date', dateRange.end.toISOString())
			.order('similarity', { ascending: false })
			.limit(pageSize)

		if (error) {
			throw error
		}

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

			// 如果没有数据或数据不足一页，设置没有更多数据
			if (_isEmpty(data) || data.length < pageSize) {
				hasMore.value = false
			}

			const publicUrls = data.map((item) => {
				const { data } = supabase
					.storage
					.from('images')
					.getPublicUrl(item.name, {
						// 缩略图
						// transform: {
						// 	width: 200,
						// 	height: 200,
						// }
					})
				return data.publicUrl
			})

			console.debug('publicUrls', publicUrls)

			const newItemGroups = _(data)
				.zip(publicUrls)
				.map(([image, url]) => {
					console.debug('image', image)

					const lastModified = image.user_metadata?.lastModified
					const lastModifiedDate = format(lastModified)

					console.debug('lastModifiedDate', lastModifiedDate)

					return {
						...image,
						lastModified,
						lastModifiedDate,
						url,
					}
				})
				.groupBy('lastModifiedDate')
				.entries()
				.orderBy('[1][0].lastModified', 'desc')
				.value()

			console.debug('newItemGroups', newItemGroups)

			imageGroups.value.push(...newItemGroups)
			page++
		} catch (error) {
			error.value = true
			toastError(t('error.title'), error.message)
		} finally {
			loading.value = false
		}
	}

	return {
		containerRef,
		sentinel,
		imageGroups,
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
	contain: content;
	content-visibility: auto;
	contain-intrinsic-size: 100% auto;
	/* 预估高度 */
}

.images-group-container {
	display: grid;
	grid-template-rows: auto 1fr;
	/* 添加 contain 优化 */
	contain: layout;
	content-visibility: auto;
	contain-intrinsic-size: 100% auto;
}

.images-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(min(150px, 100%), 1fr));
	gap: 10px;

	@media (width>=640px) {
		grid-template-columns: repeat(auto-fill, minmax(min(200px, 100%), 1fr));
	}
}

.image-wrapper {
	position: relative;
	aspect-ratio: 1;
	overflow: hidden;
	border-radius: 0.5rem;
	/* 添加 contain 优化 */
	contain: layout paint;
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

.loading-sentinel {
	height: 50px;
	display: grid;
	place-items: center;
	contain: size layout;
}
</style>
