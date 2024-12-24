import type { DateRange } from '~/types'

import { endOfDay, sub } from 'date-fns'

export const useDateRangeStore = defineStore('dateRange', () => {
	const now = new Date()

	const dateRange = ref<DateRange>({
		start: sub(now, { years: 5 }),
		end: endOfDay(now),
	})

	return {
		dateRange
	}
}, {
	persist: true,
})
