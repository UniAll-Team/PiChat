export function useUserPlan() {
	const user = useSupabaseUser()

	return computed(() =>
		_find(userPlans, userPlan => userPlan.name === user.value?.app_metadata?.plan)
		?? userPlans[0]
	)
}
