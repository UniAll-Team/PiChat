import _ from "lodash"

export function useUserPlan() {
	const user = useSupabaseUser()

	const plan = computed(() => user.value.app_metadata?.plan)
	const userPlan = computed(() => _(userPlans).find(userPlan => userPlan.name === plan.value) ?? userPlans[0])

	return userPlan
}
