<template>
	<UDashboardLayout>
		<UDashboardPanel :width="250" :resizable="{ min: 200, max: 300 }" collapsible>
			<UDashboardNavbar class="!border-transparent" :ui="{ left: 'flex-1' }">
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

					<!-- <UserDropdown /> -->
				</template>
			</UDashboardSidebar>
		</UDashboardPanel>

		<slot />

		<!-- ~/components/HelpSlideover.vue -->
		<HelpSlideover />

		<ClientOnly>
			<LazyUDashboardSearch :groups="groups" />
		</ClientOnly>
	</UDashboardLayout>
</template>

<script lang="ts" setup>
const route = useRoute()
const appConfig = useAppConfig()
const { isHelpSlideoverOpen } = useDashboard()

const links = [
	{
		id: 'home',
		label: 'Home',
		icon: 'i-heroicons-home',
		to: '/dashboard',
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
		to: '/settings/members',
	},
	{
		label: 'Help & Support',
		icon: 'i-heroicons-question-mark-circle',
		click: () => (isHelpSlideoverOpen.value = true),
	},
]

const groups = [
	{
		key: 'links',
		label: 'Go to',
		commands: links.map((link) => ({ ...link, shortcuts: link.tooltip?.shortcuts })),
	},
	{
		key: 'code',
		label: 'Code',
		commands: [
			{
				id: 'source',
				label: 'View page source',
				icon: 'i-simple-icons-github',
				click: () => {
					window.open(
						`https://github.com/nuxt-ui-pro/dashboard/blob/main/pages${route.path === '/' ? '/index' : route.path}.vue`,
						'_blank'
					)
				},
			},
		],
	},
]

</script>
