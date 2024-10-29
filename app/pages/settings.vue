<template>
	<UDashboardPage>
		<UDashboardPanel grow>
			<UDashboardNavbar title="Settings" />

			<UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
				<UHorizontalNavigation :links="links" />
			</UDashboardToolbar>

			<NuxtPage />
		</UDashboardPanel>
	</UDashboardPage>
</template>

<script setup lang="ts">
definePageMeta({
	layout: 'dashboard',
})

const links = [
	[
		{
			label: 'General',
			icon: 'i-heroicons-user-circle',
			to: '/settings',
			exact: true,
		},
		{
			label: 'Notifications',
			icon: 'i-heroicons-bell',
			to: '/settings/notifications',
		},
	],
	[
		{
			label: 'Documentation',
			icon: 'i-heroicons-book-open',
			to: '/docs'
		},
		{
			label: 'Upgrade to Pro',
			icon: 'i-heroicons-credit-card',
			to: '/pricing'
		},
	],
]
</script>
