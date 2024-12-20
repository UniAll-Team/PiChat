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
				<!-- 这里要使用client-only，不然会水合失败，不知道为什么 -->
				<!-- <ClientOnly>
					<UDashboardSidebarLinks :links="links" />
				</ClientOnly> -->
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

	</UDashboardLayout>
</template>

<i18n lang="yaml">
en:
  home: Home
  shared: Shared
  settings: Settings
  general: General
  notifications: Notifications
  upgradeToPro: Upgrade to Pro
  updateSubscription: Update Subscription
  documentation: Documentation
  invitePeople: Invite people
  helpSupport: Help & Support
  customerService: Customer Service
  linkCopiedToClipboard: Link copied to clipboard
  youCanNowShareThisLink: You can now share this link with others
  failedToCopyLink: Failed to copy link
  pleaseEnableClipboardPermission: Failed to copy, please enable
    clipboard permission

zh-Hans:
  home: 首页
  shared: 共享
  settings: 设置
  general: 常规
  notifications: 通知
  upgradeToPro: 升级到专业版
  updateSubscription: 更新订阅
  documentation: 文档
  invitePeople: 邀请他人
  helpSupport: 帮助与支持
  customerService: 联系客服
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
  upgradeToPro: الترقية إلى النسخة المحترفة
  updateSubscription: تحديث الاشتراك
  documentation: التوثيق
  invitePeople: دعوة الأشخاص
  helpSupport: المساعدة والدعم
  customerService: خدمة العملاء
  linkCopiedToClipboard: تم نسخ الرابط إلى الحافظة
  youCanNowShareThisLink: يمكنك الآن مشاركة هذا الرابط مع الآخرين
  failedToCopyLink: فشل في نسخ الرابط
  pleaseEnableClipboardPermission: فشل النسخ ، يرجى تمكين إذن
    الحافظة
</i18n>

<script lang="ts" setup>

const supabase = useSupabaseClient()

const { toastSuccess, toastError } = useAppToast()

const { t } = useI18n()

// 载入框架之前刷新jwt，防止过期
const { error } = await supabase.auth.refreshSession()
if (error) {
	console.error('刷新jwt失败', error)
}

const userPlan = useUserPlan()

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
		]
	},
]

const footerLinks = [
	{
		label: t('documentation'),
		icon: 'i-heroicons-book-open',
		to: '/docs'
	},
	{
		label: t('invitePeople'),
		icon: 'i-heroicons-plus',
		click: async () => {
			// 复制网址链接到剪贴板
			try {
				await navigator.clipboard.writeText(window.location.origin)
				toastSuccess(t('linkCopiedToClipboard'), t('youCanNowShareThisLink'))
			} catch (error) {
				toastError(t('failedToCopyLink'), t('pleaseEnableClipboardPermission'))
			}
		},
	},
	{
		label: t('customerService'),
		icon: 'i-heroicons-chat-bubble-left-right',
		to: '/docs/contact-us',
	}
]

switch (userPlan.value.name) {
	case 'free':
		footerLinks.unshift({
			label: t('upgradeToPro'),
			icon: 'i-heroicons-credit-card',
			to: '/pricing'
		})
		break
	case 'pro':
		footerLinks.unshift({
			label: t('updateSubscription'),
			icon: 'i-heroicons-credit-card',
			to: '/pricing'
		})
		break
}
</script>
