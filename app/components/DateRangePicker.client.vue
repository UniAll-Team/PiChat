<template>
	<UPopover>
		<template #default="{ open }">
			<UButton color="gray" variant="ghost" :ui="{
				inline: 'grid grid-cols-2 grid-rows-3 gap-y-0 h-12 w-13 sm:inline-flex sm:items-center',
			}" :class="[open && 'bg-gray-50 dark:bg-gray-800']">
				<span
					class="row-start-1 row-end-2 col-start-1 col-end-2 leading-none sm:leading-normal">
					{{ format(dateRange.start) }}
				</span>
				<span
					class="row-start-2 row-end-3 col-start-1 col-end-2 leading-none sm:leading-normal">
					-
				</span>
				<span
					class="row-start-3 row-end-4 col-start-1 col-end-2 leading-none sm:leading-normal">
					{{ format(dateRange.end) }}
				</span>

				<template #trailing>
					<UIcon name="i-heroicons-chevron-down-20-solid"
						class="w-5 h-5 row-start-1 row-end-4 col-start-2 col-end-3" />
				</template>
			</UButton>
		</template>

		<template #panel="{ close }">
			<div
				class="flex items-center sm:divide-x divide-gray-200 dark:divide-gray-800">
				<div class="hidden sm:flex flex-col py-4">
					<UButton
						v-for="(presetDateRange, index) in presetDateRanges"
						:key="index" :label="presetDateRange.label"
						color="gray" variant="ghost"
						class="rounded-none px-6"
						:class="isSelectedDateRange(presetDateRange.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
						truncate
						@click="selectDateRange(presetDateRange.duration)" />
				</div>

				<VDatePicker is-required :locale
					v-model.range="dateRange"
					:columns="smallerThanSm ? 1 : 2"
					:rows="smallerThanSm ? 2 : 1"
					:min-date="new Date(1999, 0, 1)" :max-date="now"
					v-bind="calendarAttrs" @input="close" />
			</div>
		</template>
	</UPopover>
</template>

<i18n lang="yaml">
en:
  lastWeek: Last 1 week
  lastTwoWeeks: Last 2 weeks
  lastMonth: Last 1 month
  lastThreeMonths: Last 3 months
  lastSixMonths: Last 6 months
  lastYear: Last year
  lastFiveYears: Last 5 years

zh-Hans:
  lastWeek: 近1周
  lastTwoWeeks: 近2周
  lastMonth: 近1个月
  lastThreeMonths: 近3个月
  lastSixMonths: 近6个月
  lastYear: 近1年
  lastFiveYears: 近5年

ar:
  lastWeek: آخر أسبوع
  lastTwoWeeks: آخر أسبوعين
  lastMonth: آخر شهر
  lastThreeMonths: آخر ٣ أشهر
  lastSixMonths: آخر ٦ أشهر
  lastYear: آخر سنة
  lastFiveYears: آخر ٥ سنوات
</i18n>

<script setup lang="ts">
import type { Duration } from 'date-fns'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { isSameDay, sub } from 'date-fns'

const { t, locale } = useI18n()

const { dateRange } = storeToRefs(useDateRangeStore())

const { smallerThanSm, calendarAttrs } = useStyles()
const {
	now,
	presetDateRanges,
	format,
	isSelectedDateRange,
	selectDateRange
} = useDateRange()

function useDateRange() {
	const now = new Date()
	const presetDateRanges: {
		label: string
		duration: Duration
	}[] = [
			{ label: t('lastWeek'), duration: { weeks: 1 } },
			{ label: t('lastTwoWeeks'), duration: { weeks: 2 } },
			{ label: t('lastMonth'), duration: { months: 1 } },
			{ label: t('lastThreeMonths'), duration: { months: 3 } },
			{ label: t('lastSixMonths'), duration: { months: 6 } },
			{ label: t('lastYear'), duration: { years: 1 } },
			{ label: t('lastFiveYears'), duration: { years: 5 } },
		]

	const format = useLocaleDate('P')

	function isSelectedDateRange(duration: Duration) {
		if (!dateRange.value || typeof dateRange.value === 'string' || dateRange.value instanceof Date) {
			return false
		}
		const range = dateRange.value
		return (
			isSameDay(range.start, sub(now, duration)) &&
			isSameDay(range.end, now)
		)
	}

	function selectDateRange(duration: Duration) {
		dateRange.value = { start: sub(now, duration), end: now }
	}

	return {
		now,
		presetDateRanges,
		dateRange,
		format,
		isSelectedDateRange,
		selectDateRange
	}
}

function useStyles() {
	const breakpoints = useBreakpoints(breakpointsTailwind)
	const smallerThanSm = breakpoints.smaller('sm')

	const calendarAttrs = {
		transparent: true,
		borderless: true,
		color: 'primary',
		'is-dark': { selector: 'html', darkClass: 'dark' },
		'first-day-of-week': 2,
	}

	return { smallerThanSm, calendarAttrs }
}
</script>

<style>
:root {
	--vc-gray-50: rgb(var(--color-gray-50));
	--vc-gray-100: rgb(var(--color-gray-100));
	--vc-gray-200: rgb(var(--color-gray-200));
	--vc-gray-300: rgb(var(--color-gray-300));
	--vc-gray-400: rgb(var(--color-gray-400));
	--vc-gray-500: rgb(var(--color-gray-500));
	--vc-gray-600: rgb(var(--color-gray-600));
	--vc-gray-700: rgb(var(--color-gray-700));
	--vc-gray-800: rgb(var(--color-gray-800));
	--vc-gray-900: rgb(var(--color-gray-900));
}

.vc-primary {
	--vc-accent-50: rgb(var(--color-primary-50));
	--vc-accent-100: rgb(var(--color-primary-100));
	--vc-accent-200: rgb(var(--color-primary-200));
	--vc-accent-300: rgb(var(--color-primary-300));
	--vc-accent-400: rgb(var(--color-primary-400));
	--vc-accent-500: rgb(var(--color-primary-500));
	--vc-accent-600: rgb(var(--color-primary-600));
	--vc-accent-700: rgb(var(--color-primary-700));
	--vc-accent-800: rgb(var(--color-primary-800));
	--vc-accent-900: rgb(var(--color-primary-900));
}

@media (width<=750px) {
	.date-text {
		line-height: 0.8;
	}
}
</style>
