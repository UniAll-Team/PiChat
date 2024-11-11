
export async function useUserRemainingQuota() {
	const userPlan = useUserPlan()
	const userUsed = await useUserUsed()

	return computed(() => {
		const storageQuota = userPlan.value.storageLimit - userUsed.value.usedStorage
		const indexingQuota = userPlan.value.cycleIndexingLimit - userUsed.value.cycleIndexedCount

		return {
			storageQuota: storageQuota,
			indexingQuota: indexingQuota,
			fileSizeLimit: userPlan.value.fileSizeLimit,
			uploadQuota: Math.max(storageQuota / userPlan.value.fileSizeLimit, indexingQuota)
		}
	})
}
