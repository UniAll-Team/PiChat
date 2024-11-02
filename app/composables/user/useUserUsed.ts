export async function useUserUsed() {

	const supabase = useSupabaseClient()
	const user = useSupabaseUser()
	const { toastError } = useAppToast()

	try {
		const { data, error } = await supabase
			.from('used_storage')
			.select('used_storage')
			.single()

		if (error) {
			throw error
		}

		const usedStorage = data.used_storage ?? 0
		const cycleIndexedCount = computed(() => user.value.app_metadata?.cycleIndexedCount ?? 0)

		return computed(() => {
			return {
				usedStorage,
				cycleIndexedCount: cycleIndexedCount.value
			}
		})
	}
	catch (error) {
		toastError(error.message)
		return computed(() => {
			return {
				usedStorage: 0,
				cycleIndexedCount: 0
			}
		})
	}
}
