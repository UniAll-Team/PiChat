export async function useUserQuota() {
	const userPlan = useUserPlan()
	const { error, userUsed } = await useUserUsed()

	if (error) {
		console.error(error)
		return { error }
	}

	const userQuota = computed(() => {
		const storageRemaining = userPlan.value.storageQuota - userUsed.value.storageUsed
		const cycleIndexingRemaining = userPlan.value.cycleIndexingQuota - userUsed.value.cycleIndexedCount

		return {
			...userUsed.value,
			...userPlan.value,
			storageRemaining,
			cycleIndexingRemaining,
			uploadRemaining: Math.round(Math.max(storageRemaining / userPlan.value.fileSizeLimit, cycleIndexingRemaining))
		}
	})

	return {
		userQuota
	}
}
