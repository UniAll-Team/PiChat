<template>
	<UDropdown :items="items" :popper="{ gpuAcceleration: true, adaptive: true }" class="w-full">
		<template #default="{ open }">
			<UButton color="gray" variant="ghost" class="w-full" :label="user.user_metadata.full_name"
				:class="[open && 'bg-gray-50 dark:bg-gray-800']">
				<template #leading>
					<UAvatar :src="user.user_metadata.avatar_url" size="2xs" />
				</template>
			</UButton>
		</template>

		<template #account>
			<div class="text-left">
				<p>
					Signed in as
				</p>
				<p class="truncate font-medium text-gray-900 dark:text-white">
					{{ user.email }}
				</p>
			</div>
		</template>
	</UDropdown>
</template>

<script lang="ts" setup>
const user = useSupabaseUser()
const supabase = useSupabaseClient()

const { isHelpSlideoverOpen } = useDashboard()
const { isDashboardSearchModalOpen } = useUIState()
const { metaSymbol } = useShortcuts()

const items = computed(() => [
	[
		{
			slot: 'account',
			label: '',
			disabled: true,
		},
	],
	[
		{
			label: 'Settings',
			icon: 'i-heroicons-cog-8-tooth',
			to: '/settings',
		},
		{
			label: 'Command menu',
			icon: 'i-heroicons-command-line',
			shortcuts: [metaSymbol.value, 'K'],
			click: () => {
				isDashboardSearchModalOpen.value = true
			},
		},
		{
			label: 'Help & Support',
			icon: 'i-heroicons-question-mark-circle',
			shortcuts: ['?'],
			click: () => (isHelpSlideoverOpen.value = true),
		},
	],
	[
		{
			label: 'Documentation',
			icon: 'i-heroicons-book-open',
			to: '/docs'
		},
		{
			label: 'GitHub repository',
			icon: 'i-simple-icons-github',
			to: 'https://github.com/nuxt-ui-pro/dashboard'
		},
		{
			label: 'Upgrade to Pro',
			icon: 'i-heroicons-credit-card',
			to: '/pricing'
		},
	],
	[
		{
			label: 'Sign out',
			icon: 'i-heroicons-arrow-left-on-rectangle',
			click: () => supabase.auth.signOut()
		},
	],
])
</script>
