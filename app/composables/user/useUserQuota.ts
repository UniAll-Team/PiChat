
export async function useUserRemainingQuota() {
	const userPlan = useUserPlan()
	const userUsed = await useUserUsed()

	const storageQuota = computed(() => userPlan.value.storageLimit - userUsed.value.usedStorage)
	const indexingQuota = computed(() => userPlan.value.cycleIndexingLimit - userUsed.value.cycleIndexedCount)

	return computed(() => {
		return {
			storageQuota: storageQuota.value,
			indexingQuota: indexingQuota.value,
			fileSizeLimit: userPlan.value.fileSizeLimit,
			uploadQuota: Math.max(storageQuota.value / userPlan.value.fileSizeLimit, indexingQuota.value)
		}
	})
}
