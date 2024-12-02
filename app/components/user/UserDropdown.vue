<template>
	<UDropdown :items="links"
		:popper="{ gpuAcceleration: true, adaptive: true }"
		class="w-full">
		<template #default="{ open }">
			<UButton color="gray" variant="ghost" class="w-full"
				:label="displayName"
				:class="[open && 'bg-gray-50 dark:bg-gray-800']">
				<template #leading v-if="hasAvatar">
					<UAvatar :src="user.user_metadata.avatar_url"
						size="2xs" />
				</template>
				<template #trailing>
					<UBadge :label="t(userPlan.name)"
						:style="{ backgroundColor: userPlan.color }" />
				</template>
			</UButton>
		</template>

		<template #account>
			<div class="text-left">
				<p>
					{{ t('signedInAs') }}
				</p>
				<p
					class="truncate font-medium text-gray-900 dark:text-white">
					{{ user.email }}
				</p>
			</div>
		</template>
	</UDropdown>
</template>

<i18n lang="yaml">
en:
  signedInAs: 'Signed in as'
  menuItems:
    settings: 'Settings'
    commandMenu: 'Command menu'
    helpAndSupport: 'Help & Support'
    documentation: 'Documentation'
    githubRepository: 'GitHub repository'
    upgradeToPro: 'Upgrade to Pro'
    signOut: 'Sign out'

zh-Hans:
  signedInAs: '当前登录账号'
  menuItems:
    settings: '系统设置'
    commandMenu: '命令面板'
    helpAndSupport: '帮助与支持'
    documentation: '帮助文档'
    githubRepository: '代码仓库'
    upgradeToPro: '升级到专业版'
    signOut: '退出登录'

ar:
  signedInAs: 'تم تسجيل الدخول باسم'
  menuItems:
    settings: 'الإعدادات'
    commandMenu: 'قائمة الأوامر'
    helpAndSupport: 'المساعدة والدعم'
    documentation: 'التوثيق'
    githubRepository: 'مستودع GitHub'
    upgradeToPro: 'الترقية إلى النسخة المحترفة'
    signOut: 'تسجيل الخروج'
</i18n>

<script lang="ts" setup>

const { t } = useI18n()

const user = useSupabaseUser()
const supabase = useSupabaseClient()

const displayName = computed(
	() => user.value?.user_metadata.full_name
		?? user.value?.email.split('@')[0]
)

const { logout } = useUserLogout()

const userPlan = useUserPlan()

const hasAvatar = computed(() => Boolean(user.value?.user_metadata?.avatar_url))

const links = [
	[
		{
			slot: 'account',
			label: '',
			disabled: true,
		},
	],
	/* [
		{
			label: t('menuItems.documentation'),
			icon: 'i-heroicons-book-open',
			to: '/docs'
		},
	], */
	[
		{
			label: t('menuItems.signOut'),
			icon: 'i-heroicons-arrow-left-on-rectangle',
			click: logout
		},
	],
]

if (userPlan.value.name === 'free') {
	links[1].push({
		label: t('menuItems.upgradeToPro'),
		icon: 'i-heroicons-credit-card',
		to: '/pricing'
	})
}
</script>
