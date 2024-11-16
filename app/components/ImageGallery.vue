<template>
	<div>
		<div class="images-groups-container">
			<div v-for="imageGroupEntry in imageGroups"
				:key="imageGroupEntry[0]"
				class="images-group-container">
				<h3 class="">{{ imageGroupEntry[0] }}</h3>
				<div class="images-container">
					<!-- 你的列表项内容 -->
					<div v-for="image in imageGroupEntry[1]"
						:key="image.id" class="image-wrapper">
						<!-- 选择按钮 -->
						<button class="select-btn"
							:class="{ 'selected': isSelectedImage(image) }"
							@click.stop="toggleSelect(image)">
							<UIcon v-if="isSelectedImage(image)"
								name="i-heroicons-check"
								class="text-white" />
							<UIcon v-else name="i-heroicons-plus"
								class="text-gray-700" />
						</button>

						<!-- 图片 -->
						<img :src="image.url" :alt="image.alt ?? ''"
							@click="handleImageClick(image)"
							class="gallery-image"
							:class="{ 'selectable': hasSelectedImages }" />
					</div>
				</div>
			</div>
		</div>

		<ClientOnly>
			<InfiniteLoading @infinite="load">
				<template #spinner>
					<div>Loading...</div>
				</template>
				<template #complete>
					<div>没有更多数据了</div>
				</template>
				<template #error>
					<div>出错了</div>
				</template>
			</InfiniteLoading>
		</ClientOnly>

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

<script lang="ts" setup>
import type { Range } from '~/types/dashboard'
import type { Database } from '~/types/database'
import type { Image, Images } from '~/types/image'

import _ from 'lodash'

// 定义组件的 props
const { description, dateRange } = defineProps<{
	dateRange: Range,
	description: string,
}>()

const isSearching = computed(() => Boolean(description))

const { text2embedding } = useServerFunctions()

// 获取图片列表
const { imageGroups, load } = useImageGroups()

const { selectedImages, hasSelectedImages } = storeToRefs(useImagesStore())

// 图片选择相关
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

	const imageGroups = ref<ImageGroups>([])
	const page = ref(1)
	const pageSize = 10
	const hasMoreData = ref(true)

	const supabase = useSupabaseClient<Database>()
	const { toastError } = useAppToast()

	async function getImages() {
		const { data, error } = await supabase
			.from('image_details')
			.select(imageColumns)
			.order('id', { ascending: false })
			.range((page.value - 1) * pageSize, page.value * pageSize - 1)

		if (error) {
			throw error
		}

		return data
	}

	async function searchImages() {
		const embedding = await text2embedding(description)

		const { data, error } = await supabase
			.rpc('search_images', {
				query_embedding: embedding,
				match_threshold: 0.3,
				match_count: pageSize
			})

		if (error) {
			throw error
		}

		return data
	}

	async function load(state?: any) {
		try {
			console.debug('load', 'description', description)

			// 如果没有更多数据且不是第一页，直接完成
			if (!hasMoreData.value && page.value > 1) {
				state?.complete()
				return
			}

			const data = <Images>await (isSearching.value ? searchImages() : getImages())

			console.debug('data', data)

			// 如果没有数据或数据不足一页，设置没有更多数据
			if (_isEmpty(data) || data.length < pageSize) {
				hasMoreData.value = false
			}

			// 如果没有数据，直接完成
			if (_isEmpty(data)) {
				state?.complete()
				return
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
					const lastModifiedDate = formatUnixDate(lastModified, 'zhCN')

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
			page.value++
			state?.loaded()

			// 如果没有更多数据，直接完成
			if (!hasMoreData.value) {
				state?.complete()
			}
		} catch (error) {
			toastError({
				title: '加载失败',
				description: error.message,
			})
		}
	}

	return {
		imageGroups,
		load
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
}

.images-group-container {
	display: grid;
	grid-template-rows: repeat(2, auto);
}

.images-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 10px;
}

@media (width>=640px) {
	.images-container {
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	}
}

// 图片选择器样式
.image-wrapper {
	position: relative;
	aspect-ratio: 1;
	overflow: hidden;
	@apply rounded-lg;
}

.gallery-image {
	width: 100%;
	height: 100%;
	object-fit: cover;
	cursor: pointer;
	transition: transform 0.3s ease;

	&:hover {
		transform: scale(1.05);
	}
}

.select-btn {
	position: absolute;
	top: 0.5rem;
	left: 0.5rem;
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	@apply bg-white/80 hover:bg-white;
	border: 2px solid #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
	transition: all 0.3s ease;

	&.selected {
		@apply bg-primary border-primary;
	}
}
</style>
