import type { UserPlans } from '~/types'

import * as math from 'mathjs'

export const userPlans: UserPlans = [
	{
		name: 'free',
		storageQuota: math.unit('5GB').toNumber('B'),
		// fileSizeLimit: math.unit('10MB').toNumber('B'),
		lookupKeys: {
			month: 'free/month',
			year: 'free/year',
		},
		indexingQuotas: {
			// 免费方案只有月度配额
			month: 1777,
		},
		pricesCent: {
			month: 0,
		},
		pricesStr: {
			month: '$0',
		}
	},
	{
		name: 'pro',
		storageQuota: math.unit('177GB').toNumber('B'),
		// fileSizeLimit: math.unit('100MB').toNumber('B'),
		lookupKeys: {
			month: 'pro/month',
			year: 'pro/year',
		},
		indexingQuotas: {
			month: 1777,
			year: 17777,
		},
		pricesCent: {
			month: 1970,
			year: 19970,
		},
		pricesStr: {
			month: '$19.7',
			year: '$199.7',
		}
	},
	{
		name: 'max',
		storageQuota: math.unit('377GB').toNumber('B'),
		// fileSizeLimit: math.unit('1GB').toNumber('B'),
		lookupKeys: {
			month: 'max/month',
			year: 'max/year',
		},
		indexingQuotas: {
			month: 3777,
			year: 37777,
		},
		pricesCent: {
			month: 3970,
			year: 39970,
		},
		pricesStr: {
			month: '$39.7',
			year: '$399.7',
		}
	},
	{
		name: 'ultra',
		storageQuota: math.unit('777GB').toNumber('B'),
		// fileSizeLimit: math.unit('10GB').toNumber('B'),
		lookupKeys: {
			month: 'ultra/month',
			year: 'ultra/year',
		},
		indexingQuotas: {
			month: 7777,
			year: 77777,
		},
		pricesCent: {
			month: 7770,
			year: 77770,
		},
		pricesStr: {
			month: '$77.7',
			year: '$777.7',
		}
	}
]
