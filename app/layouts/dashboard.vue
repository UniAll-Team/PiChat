<template>
	<UDashboardLayout>
		<UDashboardPanel :width="250"
			:resizable="{ min: 200, max: 300 }" collapsible>
			<UDashboardNavbar class="!border-transparent"
				:ui="{ left: 'flex-1' }">
				<template #left>
					<UserDropdown />
				</template>
			</UDashboardNavbar>

			<UDashboardSidebar>
				<template #header>

				</template>

				<UDashboardSidebarLinks :links="links" />

				<div class="flex-1" />

				<UDashboardSidebarLinks :links="footerLinks" />

				<UDivider class="sticky bottom-0" />

				<template #footer>
					<UserQuota />
				</template>
			</UDashboardSidebar>
		</UDashboardPanel>

		<slot />

		<!-- ~/components/HelpSlideover.vue -->
		<HelpSlideover />

	</UDashboardLayout>
</template>

<script lang="ts" setup>
const { isHelpSlideoverOpen } = useDashboard()
const { toastSuccess, toastError } = useAppToast()

const links = [
	{
		id: 'home',
		label: 'Home',
		icon: 'i-heroicons-home',
		to: '/home',
	},
	/* {
		id: 'shared',
		label: 'Shared',
		icon: 'i-heroicons-folder-open',
		to: '/shared',
	}, */
	{
		id: 'settings',
		label: 'Settings',
		to: '/settings',
		icon: 'i-heroicons-cog-8-tooth',
		children: [
			{
				label: 'General',
				to: '/settings',
				exact: true,
			},
			{
				label: 'Notifications',
				to: '/settings/notifications',
			},
		],
		tooltip: {
			text: 'Settings',
		},
	},
]

const footerLinks = [
	{
		label: 'Invite people',
		icon: 'i-heroicons-plus',
		click: async () => {
			// 复制网址链接到剪贴板
			try {
				await navigator.clipboard.writeText(window.location.origin)
				toastSuccess({
					title: 'Link copied to clipboard',
					description: 'You can now share this link with others',
				})
			} catch (error) {
				toastError({
					title: 'Failed to copy link',
					description: '复制失败，请开启剪贴板权限',
				})
			}
		},
	},
	{
		label: 'Help & Support',
		icon: 'i-heroicons-question-mark-circle',
		click: () => (isHelpSlideoverOpen.value = true),
	},
]
</script>
