<template>
	<div class="success-container">
		<h1>
			{{ title }}
		</h1>
		<UIcon name="heroicons-check-circle-16-solid"
			class="w-36 h-36 text-green-500" />
		<UButton to="/home" color="green" :label="t('goToHome')"
			trailing-icon="i-heroicons-arrow-right-20-solid" />
	</div>
</template>

<i18n lang="yaml">
zh-Hans:
  subscription:
    success: 订阅成功
    update: 订阅已更新

en:
  subscription:
    success: Subscription successful
    update: Subscription updated

de:
  subscription:
    success: Abonnement erfolgreich
    update: Abonnement aktualisiert

ar:
  subscription:
    success: تم الاشتراك بنجاح
    update: تم تحديث الاشتراك
</i18n>

<script lang="ts" setup>
const { t } = useI18n()
const route = useRoute()
const title = ref('')

switch (route.params.event) {
	case 'checkout':
		title.value = t('subscription.success')
		break
	case 'update':
		title.value = t('subscription.update')
		break
	default:
		break
}

</script>

<style lang="scss" scoped>
.success-container {
	display: grid;
	grid-template-rows: auto 1fr auto;
	justify-items: center;
	gap: 1rem;

	padding-top: 2rem;
}

h1 {
	font-size: 5rem;
	font-weight: 600;
}
</style>
