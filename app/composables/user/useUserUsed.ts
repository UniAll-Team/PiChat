export async function useUserUsed() {
	const supabase = useSupabaseClient()
	const user = useSupabaseUser()

	const { data, error } = await supabase
		.from('used_storage')
		.select('size')
		.single()

	if (error) {
		return { error }
	}

	const userUsed = computed(() => {
		return {
			storageUsed: data.size ?? 0,
			cycleIndexedCount: user.value?.app_metadata?.cycle_indexed_count ?? 0
		}
	})

	return {
		userUsed
	}
}
