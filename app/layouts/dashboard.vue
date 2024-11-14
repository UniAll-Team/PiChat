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

<i18n lang="yaml">
en:
  home: Home
  shared: Shared
  settings: Settings
  general: General
  notifications: Notifications
  invitePeople: Invite people
  helpSupport: Help & Support
  linkCopiedToClipboard: Link copied to clipboard
  youCanNowShareThisLink: You can now share this link with others
  failedToCopyLink: Failed to copy link
  pleaseEnableClipboardPermission: Failed to copy, please enable clipboard permission

zh-Hans:
  home: 首页
  shared: 共享
  settings: 设置
  general: 常规
  notifications: 通知
  invitePeople: 邀请他人
  helpSupport: 帮助与支持
  linkCopiedToClipboard: 链接已复制到剪贴板
  youCanNowShareThisLink: 您现在可以与他人分享此链接
  failedToCopyLink: 复制链接失败
  pleaseEnableClipboardPermission: 复制失败，请开启剪贴板权限

ar:
  home: الصفحة الرئيسية
  shared: مشترك
  settings: الإعدادات
  general: عام
  notifications: الإشعارات
  invitePeople: دعوة الأشخاص
  helpSupport: المساعدة والدعم
  linkCopiedToClipboard: تم نسخ الرابط إلى الحافظة
  youCanNowShareThisLink: يمكنك الآن مشاركة هذا الرابط مع الآخرين
  failedToCopyLink: فشل في نسخ الرابط
  pleaseEnableClipboardPermission: فشل النسخ ، يرجى تمكين إذن الحافظة
</i18n>

<script lang="ts" setup>
const { isHelpSlideoverOpen } = useDashboard()
const { toastSuccess, toastError } = useAppToast()

const { t } = useI18n()

const links = [
	{
		id: 'home',
		label: t('home'),
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
		label: t('settings'),
		to: '/settings',
		icon: 'i-heroicons-cog-8-tooth',
		children: [
			{
				label: t('general'),
				to: '/settings',
				exact: true,
			},
			{
				label: t('notifications'),
				to: '/settings/notifications',
			},
		],
		tooltip: {
			text: t('settings'),
		},
	},
]

const footerLinks = [
	{
		label: t('invitePeople'),
		icon: 'i-heroicons-plus',
		click: async () => {
			// 复制网址链接到剪贴板
			try {
				await navigator.clipboard.writeText(window.location.origin)
				toastSuccess({
					title: t('linkCopiedToClipboard'),
					description: t('youCanNowShareThisLink'),
				})
			} catch (error) {
				toastError({
					title: t('failedToCopyLink'),
					description: t('pleaseEnableClipboardPermission'),
				})
			}
		},
	},
	{
		label: t('helpSupport'),
		icon: 'i-heroicons-question-mark-circle',
		click: () => (isHelpSlideoverOpen.value = true),
	},
]
</script>
