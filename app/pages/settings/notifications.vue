<template>
	<UDashboardPanelContent
		class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800">
		<UDashboardSection v-for="(section, index) in sections"
			:key="index" :title="section.title"
			:description="section.description"
			orientation="horizontal" class="px-4 py-6">
			<UCard
				:ui="{ body: { base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col' } }">
				<UFormGroup v-for="field in section.fields"
					:key="field.name" :name="field.name"
					:label="field.label"
					:description="field.description"
					class="flex items-center justify-between pt-4 first:pt-0 gap-2"
					:ui="{ container: 'flex' }">
					<UToggle v-model="state[field.name]" size="md"
						@update:model-value="updateNotifications" />
				</UFormGroup>
			</UCard>
		</UDashboardSection>
	</udashboardpanelcontent>
</template>

<i18n lang="yaml">
en:
  notifications:
    channels:
      title: Notification Channels
      description: How would you like to be notified?
      email:
        label: Email
        description: Receive notifications via email.
      app:
        label: In-app
        description: Receive notifications within the app.
    types:
      title: Notification Types
      description: Which types of notifications would you like
        to receive?
      discounts:
        label: Discounts
        description: Receive notifications about discounts and
          promotions.
      product:
        label: Product Updates
        description: Receive a monthly email with all the new
          features and updates.
      important:
        label: Important Updates
        description: Receive emails about important updates such
          as security fixes and maintenance.
    toast:
      success:
        title: Success
        description: Notification settings updated successfully.
      error:
        title: Error

zh-Hans:
  notifications:
    channels:
      title: 通知渠道
      description: 我们如何通知您？
      email:
        label: 邮件
        description: 通过邮件接收通知。
      app:
        label: 应用内
        description: 在应用内接收通知。
    types:
      title: 通知类型
      description: 您想接收哪些类型的通知？
      discounts:
        label: 优惠活动
        description: 接收折扣和促销活动的通知。
      product:
        label: 产品更新
        description: 每月接收一次包含所有新功能和更新的邮件。
      important:
        label: 重要更新
        description: 接收关于安全修复、维护等重要更新的邮件。
    toast:
      success:
        title: 成功
        description: 通知设置更新成功。
      error:
        title: 错误

ar:
  notifications:
    channels:
      title: قنوات الإشعارات
      description: كيف ترغب في تلقي الإشعارات؟
      email:
        label: البريد الإلكتروني
        description: تلقي الإشعارات عبر البريد الإلكتروني.
      app:
        label: داخل التطبيق
        description: تلقي الإشعارات داخل التطبيق.
    types:
      title: أنواع الإشعارات
      description: ما هي أنواع الإشعارات التي ترغب في تلقيها؟
      discounts:
        label: الخصومات
        description: تلقي الإشعارات حول الخصومات والعروض الترويجية.
      product:
        label: تحديثات المنتج
        description: تلقي بريد إلكتروني شهري مع جميع الميزات والتحديثات
          الجديدة.
      important:
        label: التحديثات الهامة
        description: تلقي رسائل بريد إلكتروني حول التحديثات الهامة
          مثل إصلاحات الأمان والصيانة.
    toast:
      success:
        title: نجاح
        description: تم تحديث إعدادات الإشعار بنجاح.
      error:
        title: خطأ

</i18n>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()

const { t } = useI18n()

const state = ref<{ [key: string]: boolean }>(user.value.user_metadata?.notifications)
if (!state.value) {
	state.value = {
		email: true,
		app: false,
		discounts: true,
		product_updates: false,
		important_updates: true,
	}
}

const sections = [
	{
		title: t('notifications.channels.title'),
		description: t('notifications.channels.description'),
		fields: [
			{
				name: 'email',
				label: t('notifications.channels.email.label'),
				description: t('notifications.channels.email.description'),
			},
			{
				name: 'app',
				label: t('notifications.channels.app.label'),
				description: t('notifications.channels.app.description'),
			},
		],
	},
	{
		title: t('notifications.types.title'),
		description: t('notifications.types.description'),
		fields: [
			{
				name: 'discounts',
				label: t('notifications.types.discounts.label'),
				description: t('notifications.types.discounts.description'),
			},
			{
				name: 'product_updates',
				label: t('notifications.types.product.label'),
				description: t('notifications.types.product.description'),
			},
			{
				name: 'important_updates',
				label: t('notifications.types.important.label'),
				description:
					t('notifications.types.important.description'),
			},
		],
	},
]

async function updateNotifications() {
	try {
		const { data, error } = await supabase.auth.updateUser({
			data: {
				notifications: state.value,
			},
		})

		if (error) throw error

		toastSuccess(t('notifications.toast.success.title'), t('notifications.toast.success.description'))
	} catch (error) {
		toastError(t('notifications.toast.error.title'), error.message)
	}
}
</script>
