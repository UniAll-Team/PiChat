// 不同的用户计划类型
export type UserPlan = {
	// 用户计划名称
	name: string
	// 当前付费周期
	cycle?: string
	// 当前付费周期的索引配额
	indexingQuota?: number
	storageQuota: number
	fileSizeLimit?: number
	indexingQuotas: {
		month: number
		year?: number
	},
	// 价格字符串
	pricesStr?: {
		month: string
		year: string
	}
	// stripe相关信息
	stripe?: {
		lookupKey?: string
		lookupKeys: {
			month: string
			year: string
		}
		pricesCent: {
			month: number
			year: number
		}
	}
	// Paddle相关信息
	paddle?: {
		productId: string
		priceIds: {
			month: string
			year?: string
		}
	}
}

export type UserPlans = UserPlan[]
