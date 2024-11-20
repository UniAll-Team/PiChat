<template>
	<UPopover>
		<template #default="{ open }">
			<UButton color="gray" variant="ghost" :ui="{
				inline: 'grid grid-cols-2 grid-rows-3 gap-y-0 h-12 w-13 sm:inline-flex sm:items-center',
			}" :class="[open && 'bg-gray-50 dark:bg-gray-800']">
				<span
					class="row-start-1 row-end-2 col-start-1 col-end-2 leading-none sm:leading-normal">
					{{ format(selected.start, 'd/MM/yy') }}
				</span>
				<span
					class="row-start-2 row-end-3 col-start-1 col-end-2 leading-none sm:leading-normal">
					-
				</span>
				<span
					class="row-start-3 row-end-4 col-start-1 col-end-2 leading-none sm:leading-normal">
					{{ format(selected.end, 'd/MM/yy') }}
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
					<UButton v-for="(range, index) in ranges"
						:key="index" :label="range.label" color="gray"
						variant="ghost" class="rounded-none px-6"
						:class="[isRangeSelected(range.duration) ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50']"
						truncate
						@click="selectDateRange(range.duration)" />
				</div>

				<ClientOnly>
					<VCalendarDatePicker
						v-if="selected?.start && selected?.end"
						v-model.range="selected"
						:columns="smallerThanSm ? 1 : 2"
						:rows="smallerThanSm ? 2 : 1"
						v-bind="calendarAttrs" @input="close" />
					<VCalendarDatePicker v-else v-model="selected"
						v-bind="calendarAttrs" @input="close" />
				</ClientOnly>
			</div>
		</template>
	</UPopover>
</template>

<script setup lang="ts">
import type { Duration } from 'date-fns'
import type { DateRange } from '~/types/dashboard'

import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'
import { format, isSameDay, sub } from 'date-fns'
import { DatePicker as VCalendarDatePicker } from 'v-calendar'

import 'v-calendar/dist/style.css'

const ranges: {
	label: string
	duration: Duration
}[] =
	[
		{ label: 'Last 7 days', duration: { days: 7 } },
		{ label: 'Last 14 days', duration: { days: 14 } },
		{ label: 'Last 30 days', duration: { days: 30 } },
		{ label: 'Last 3 months', duration: { months: 3 } },
		{ label: 'Last 6 months', duration: { months: 6 } },
		{ label: 'Last year', duration: { years: 1 } },
	]

const selected = defineModel<DateRange>()

const breakpoints = useBreakpoints(breakpointsTailwind)
const smallerThanSm = breakpoints.smaller('sm')

const calendarAttrs = {
	transparent: true,
	borderless: true,
	color: 'primary',
	'is-dark': { selector: 'html', darkClass: 'dark' },
	'first-day-of-week': 2,
}

function isRangeSelected(duration: Duration) {
	if (!selected.value || typeof selected.value === 'string' || selected.value instanceof Date) {
		return false
	}
	const range = selected.value
	return (
		isSameDay(range.start, sub(new Date(), duration)) &&
		isSameDay(range.end, new Date())
	)
}

function selectDateRange(duration: Duration) {
	selected.value = { start: sub(new Date(), duration), end: new Date() }
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
