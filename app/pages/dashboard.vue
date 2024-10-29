<template>
	<UDashboardPage>
		<UDashboardPanel grow>

			<UDashboardToolbar>
				<template #left>
					<!-- ~/components/home/HomeDateRangePicker.vue -->
					<HomeDateRangePicker v-model="range" class="-ml-2.5" />
				</template>

				<template #right>
					<UDashboardSearchButton label="使用自然语言进行搜索" />
				</template>
			</UDashboardToolbar>

			<UDashboardPanelContent>
				<ImageGallery />
			</UDashboardPanelContent>
		</UDashboardPanel>
	</UDashboardPage>
</template>

<script setup lang="ts">
import { sub } from 'date-fns'
import type { Period, Range } from '~/types/dashboard'

definePageMeta({
	layout: 'dashboard',
})

const { isNotificationsSlideoverOpen } = useDashboard()

const items = [[{
	label: 'New mail',
	icon: 'i-heroicons-paper-airplane',
	to: '/inbox'
}, {
	label: 'New user',
	icon: 'i-heroicons-user-plus',
	to: '/users'
}]]

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })
</script>
