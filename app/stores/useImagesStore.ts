import type { Images } from '~/types/image'

export const useImagesStore = defineStore('selectedImages', () => {
	const selectedImages = ref<Images>([])

	// 计算属性：是否有选中的图片
	const hasSelectedImages = computed(() => selectedImages.value.length > 0)

	function resetSelectedImages() {
		selectedImages.value = []
	}

	return {
		selectedImages,
		hasSelectedImages,
		resetSelectedImages,
	}
})
