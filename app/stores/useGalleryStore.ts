export const useGalleryStore = defineStore('gallery', () => {
	const lastObjectId = ref('')

	return {
		lastObjectId,
	}
})
