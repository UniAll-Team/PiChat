// 不同的用户计划类型
export type UserPlan = {
	name: string
	storageQuota: number
	fileSizeLimit?: number
	lookupKeys: {
		month: string
		year: string
	},
	indexingQuotas: {
		month: number
		year?: number
	},
	// stripe的最小单位是美分，所以这里用整数表示
	pricesCent: {
		month: number
		year?: number
	},
	pricesStr?: {
		month: string
		year?: string
	}
	// 当前付费周期
	cycle?: string
	lookupKey?: string
	indexingQuota?: number
}

export type UserPlans = UserPlan[]
