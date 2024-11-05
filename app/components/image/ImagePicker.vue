<template>
	<div class="gallery-container">
		<div v-for="(image, index) in images" :key="index" class="image-wrapper">
			<!-- 选择按钮 -->
			<button class="select-btn" :class="{ 'selected': selectedImages.includes(image.id) }"
				@click.stop="toggleSelect(image)">
				<UIcon v-if="_some(selectedImages)" name="i-heroicons-check" class="text-white" />
				<UIcon v-else name="i-heroicons-plus" class="text-gray-700" />
			</button>

			<!-- 图片 -->
			<img :src="image.url" :alt="image.alt || ''" @click="handleImageClick(image)" class="gallery-image"
				:class="{ 'selectable': hasSelectedImages }" />
		</div>

		<!-- 使用UModal替换原来的预览弹窗 -->
		<UModal v-model="showPreview" :ui="{
			container: 'items-center justify-center',
			width: 'max-w-[90vw]',
			height: 'max-h-[90vh]',
			background: 'bg-black bg-opacity-90',
			padding: 'p-0'
		}">
			<div class="relative">
				<img :src="previewImage?.url" :alt="previewImage?.alt || ''" class="max-w-[90vw] max-h-[90vh] object-contain" />
				<UButton icon="i-heroicons-x-mark" class="absolute top-2 right-2" color="white" variant="ghost"
					@click="closePreview" />
			</div>
		</UModal>
	</div>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import type { Image, Images } from '~/types/image'

// 定义props和emits
const { images } = defineProps<{ images: Images }>()

const selectedImages = defineModel<Image[]>()

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

function handleImageClick(image: Image) {
	if (hasSelectedImages.value) {
		toggleSelect(image)
	} else {
		previewImage.value = image
		showPreview.value = true
	}
}

function closePreview() {
	showPreview.value = false
	previewImage.value = null
}
</script>

<style lang="scss" scoped>
.gallery-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	gap: 1rem;
	padding: 1rem;
}

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
}

.gallery-image:hover {
	transform: scale(1.05);
}

.select-btn {
	position: absolute;
	top: 0.5rem;
	left: 0.5rem;
	width: 2rem;
	height: 2rem;
	border-radius: 50%;
	@apply bg-white/80 hover:bg-white;
	border: 2px solid #fff;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1;
	transition: all 0.3s ease;
}

.select-btn.selected {
	@apply bg-primary border-primary;
}
</style>
