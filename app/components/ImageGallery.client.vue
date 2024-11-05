<template>
	<div>
		<div class="images-groups-container">
			<div v-for="(imageGroup, lastModifiedDate) in imageGroups" :key="lastModifiedDate" class="images-group-container">
				<h3 class="">{{ lastModifiedDate }}</h3>
				<div class="images-container">
					<!-- 你的列表项内容 -->
					<div v-for="(image) in imageGroup" :key="image.id" class="image-wrapper">
						<!-- 选择按钮 -->
						<button class="select-btn" :class="{ 'selected': isSelectedImage(image) }"
							@click.stop="toggleSelect(image)">
							<UIcon v-if="isSelectedImage(image)" name="i-heroicons-check" class="text-white" />
							<UIcon v-else name="i-heroicons-plus" class="text-gray-700" />
						</button>

						<!-- 图片 -->
						<img :src="image.url" :alt="image.alt ?? ''" @click="handleImageClick(image)" class="gallery-image"
							:class="{ 'selectable': hasSelectedImages }" />
					</div>
				</div>
			</div>
		</div>

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
				<UButton icon="i-heroicons-x-mark" color="white" variant="ghost" @click="closePreview" />
			</div>
			<div class="flex items-center justify-center w-full h-full">
				<img :src="previewImage?.url" :alt="previewImage?.alt || ''"
					class="max-w-[90vw] max-h-[90vh] w-auto h-auto object-contain" />
			</div>
		</UModal>
	</div>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import type { Database } from '~/types/database'
import type { Image, Images } from '~/types/image'

// 获取图片列表
const { imageGroups, load } = useImageGroups()

// 图片选择相关
const {
	selectedImages,
	showPreview,
	previewImage,
	hasSelectedImages,
	isSelectedImage,
	toggleSelect,
	handleImageClick,
	closePreview
} = useImagePicker()

function useImageGroups() {
	const imageGroups = ref<{ [lastModifiedDate: string]: Images }>({})
	const page = ref(1)
	const pageSize = 10

	const supabase = useSupabaseClient<Database>()
	const { toastError } = useAppToast()

	async function getImages() {
		const { data, error } = await supabase
			.from('image_details')
			.select('*')
			.order('id', { ascending: false })
			.range((page.value - 1) * pageSize, page.value * pageSize - 1)

		if (error) {
			throw error
		}

		return data
	}

	async function load(state?: any) {
		try {
			const data = await getImages()

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

			const newItemGroups = _(data)
				.zip(publicUrls)
				.map(([image, url]) => {
					console.debug('image', image)

					const lastModifiedDate = formatUnixDate((image.user_metadata as any)?.lastModified, 'zhCN')

					console.debug('lastModifiedDate', lastModifiedDate)
					return {
						...image,
						lastModifiedDate,
						url,
					}
				})
				.groupBy('lastModifiedDate')
				.value()

			console.debug('newItemGroups', newItemGroups)
			if (_.isEmpty(newItemGroups)) {
				state?.complete()
			} else {
				imageGroups.value = _.merge(imageGroups.value, newItemGroups)
				page.value++
				state?.loaded()
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
		load,
	}
}

function useImagePicker() {
	const selectedImages = ref([])

	const showPreview = ref(false)
	const previewImage = ref(null)

	// 计算属性：是否有选中的图片
	const hasSelectedImages = computed(() => selectedImages.value.length > 0)

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
		selectedImages,
		showPreview,
		previewImage,
		hasSelectedImages,
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
