import type { UserPlans } from '~/types'

import * as math from 'mathjs'

export const userPlans: UserPlans = [
	{
		name: 'free',
		storageQuota: math.unit('5GB').toNumber('B'),
		// fileSizeLimit: math.unit('10MB').toNumber('B'),
		indexingQuotas: {
			// 免费方案只有月度配额
			month: 177,
		},
		pricesStr: {
			month: 'Free',
			year: 'Free',
		},
		stripe: {
			lookupKeys: {
				month: 'free/month',
				year: 'free/year',
			},
			pricesCent: {
				month: 0,
				year: 0,
			}
		}
	},
	{
		name: 'pro',
		storageQuota: math.unit('177GB').toNumber('B'),
		// fileSizeLimit: math.unit('100MB').toNumber('B'),
		indexingQuotas: {
			month: 1777,
			year: 17777,
		},
		pricesStr: {
			month: '$19.7',
			year: '$199.7',
		},
		stripe: {
			lookupKeys: {
				month: 'pro/month',
				year: 'pro/year',
			},
			pricesCent: {
				month: 19_70,
				year: 199_70,
			},
		},
	},
	{
		name: 'max',
		storageQuota: math.unit('377GB').toNumber('B'),
		// fileSizeLimit: math.unit('1GB').toNumber('B'),
		indexingQuotas: {
			month: 3777,
			year: 37777,
		},
		pricesStr: {
			month: '$39.7',
			year: '$399.7',
		},
		stripe: {
			lookupKeys: {
				month: 'max/month',
				year: 'max/year',
			},
			pricesCent: {
				month: 39_70,
				year: 399_70,
			},
		},
	},
	{
		name: 'ultra',
		storageQuota: math.unit('777GB').toNumber('B'),
		// fileSizeLimit: math.unit('10GB').toNumber('B'),
		indexingQuotas: {
			month: 7777,
			year: 77777,
		},
		pricesStr: {
			month: '$77.7',
			year: '$777.7',
		},
		stripe: {
			lookupKeys: {
				month: 'ultra/month',
				year: 'ultra/year',
			},
			pricesCent: {
				month: 77_70,
				year: 777_70,
			}
		},
	}
]
