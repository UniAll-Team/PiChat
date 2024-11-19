<template>
	<div>
		<div>
			<UProgress :value="userQuota.storageUsed"
				:max="userQuota.storageQuota" indicator />
			<p>
				{{ t('quota.storage', storageValues) }}
			</p>
		</div>

		<div>
			<UProgress :value="userQuota.cycleIndexedCount"
				:max="userQuota.cycleIndexingQuota" indicator />
			<p>
				{{ t('quota.indexing', {
					count: userQuota.cycleIndexedCount,
					remaining: userQuota.cycleIndexingRemaining,
					total: userQuota.cycleIndexingQuota
				}) }}
			</p>
		</div>
	</div>
</template>

<i18n lang="yaml">
en:
  quota:
    storage: 'Storage used: {used}, remaining storage: {remaining}, total storage: {total}'
    indexing: '{count} items indexed, {remaining} items remaining, total quota: {total} items'
  error:
    title: 'Failed to get user quota, please click the support button on the left'

zh-Hans:
  quota:
    storage: '已使用存储：{used}，剩余存储：{remaining}，总存储：{total}'
    indexing: '已索引 {count} 项，剩余 {remaining} 项，总配额：{total} 项'
  error:
    title: '获取用户配额失败，请点击左侧联系客服'

ar:
  quota:
    storage: 'المساحة المستخدمة: {used}، المساحة المتبقية: {remaining}، إجمالي المساحة: {total}'
    indexing: 'تم فهرسة {count} عنصر، متبقي {remaining} عنصر، الحصة الإجمالية: {total} عنصر'
  error:
    title: 'فشل في الحصول على حصة المستخدم، يرجى النقر على زر الدعم على اليسار'
</i18n>

<script lang="ts" setup>
const { t, localeProperties } = useI18n()
import prettyBytes from 'pretty-bytes'

const { error, userQuota } = await useUserQuota()
console.debug(
	'UserQuota',
	userQuota.value
)

const storageValues = computed(() => {
	const language = localeProperties.value.language
	return {
		used: prettyBytes(userQuota.value.storageUsed, { locale: language }),
		remaining: prettyBytes(userQuota.value.storageRemaining, { locale: language }),
		total: prettyBytes(userQuota.value.storageQuota, { locale: language })
	}
})
console.debug('localeProperties', localeProperties.value, 'storageValues', storageValues)

const { toastError } = useAppToast()

if (error) {
	toastError({
		title: t('error.title'),
		description: error.message
	})
}
</script>
