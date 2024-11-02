import _ from "lodash"
import { userPlans } from "~/constants/user/userPlans"

export function useUserPlan() {
	const user = useSupabaseUser()

	const plan = computed(() => user.value.app_metadata?.plan)
	const userPlan = computed(() => _(userPlans).find(userPlan => userPlan.name === plan.value) ?? userPlans[0])

	return userPlan
}
