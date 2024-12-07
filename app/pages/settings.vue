<template>
	<UDashboardPage>
		<UDashboardPanel grow>
			<UDashboardNavbar :title="t('settings')" />

			<NuxtPage />
		</UDashboardPanel>
	</UDashboardPage>
</template>

<i18n lang="yaml">
en:
  settings: Settings

zh-Hans:
  settings: 设置

ar:
  settings: الإعدادات
</i18n>

<script setup lang="ts">
definePageMeta({
	layout: 'dashboard',
})

const { t } = useI18n()
</script>
