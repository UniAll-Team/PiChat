<template>
	<UPopover>
		<template #default="{ open }">
			<UButton color="gray" variant="ghost" :ui="{
				inline: 'grid grid-cols-2 grid-rows-3 gap-y-0 h-12 w-13 sm:inline-flex sm:items-center',
			}" :class="[open && 'bg-gray-50 dark:bg-gray-800']">
				<span
					class="row-start-1 row-end-2 col-start-1 col-end-2  leading-none	sm:leading-normal">
					{{ format(selected.start, 'd/MM/yy') }}
				</span>
				<span
					class="row-start-2 row-end-3 col-start-1 col-end-2 leading-none	sm:leading-normal">
					-
				</span>
				<span
					class="row-start-3 row-end-4 col-start-1 col-end-2 leading-none	sm:leading-normal">
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
						truncate @click="selectRange(range.duration)" />
				</div>

				<DatePicker v-model="selected" @close="close" />
			</div>
		</template>
	</UPopover>
</template>

<script lang="ts" setup>
import type { Duration } from 'date-fns'
import type { Range } from '~/types/dashboard'

import { format, isSameDay, sub } from 'date-fns'

const ranges: {
	label: string
	duration: Duration
}[] = [
		{ label: 'Last 7 days', duration: { days: 7 } },
		{ label: 'Last 14 days', duration: { days: 14 } },
		{ label: 'Last 30 days', duration: { days: 30 } },
		{ label: 'Last 3 months', duration: { months: 3 } },
		{ label: 'Last 6 months', duration: { months: 6 } },
		{ label: 'Last year', duration: { years: 1 } },
	]

const selected = defineModel<Range>()

function isRangeSelected(duration: Duration) {
	return (
		isSameDay(selected.value.start, sub(new Date(), duration)) &&
		isSameDay(selected.value.end, new Date())
	)
}

function selectRange(duration: Duration) {
	selected.value = { start: sub(new Date(), duration), end: new Date() }
}
</script>

<style lang="scss" scoped>
@media (width<=750px) {
	.date-text {
		line-height: 0.8;
	}
}
</style>
