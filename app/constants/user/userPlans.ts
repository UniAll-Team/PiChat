import * as math from 'mathjs'

export const userPlans = [
	{
		name: 'free',
		icon: 'i-feather-star',
		color: 'gold' as const,
		storageQuota: math.unit('5GB').toNumber('B'),
		// fileSizeLimit: math.unit('10MB').toNumber('B'),
		cycleIndexingQuota: 177,
		pricing: '$0'
	},
	{
		name: 'pro',
		icon: 'i-feather-star',
		color: 'gold' as const,
		storageQuota: math.unit('97GB').toNumber('B'),
		// fileSizeLimit: math.unit('100MB').toNumber('B'),
		cycleIndexingQuota: 1777,
		pricing: '$19.7'
	},
]
