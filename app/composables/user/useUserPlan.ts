export function useUserPlan() {
	const user = useSupabaseUser()

	return computed(() => {
		const plan = user.value?.app_metadata?.plan

		// 获取用户订阅的产品
		const userPlan = _find(userPlans, userPlan => userPlan.name === plan?.name)
			?? userPlans[0]

		// 设置用户当前的付费周期
		userPlan.cycle = plan?.cycle ?? 'month'
		userPlan.indexingQuota = userPlan.indexingQuotas[userPlan.cycle ?? 'month']
		userPlan.lookupKey = userPlan.lookupKeys[userPlan.cycle ?? 'month']

		return userPlan
	})
}
