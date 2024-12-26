<template>
	<div>
		<div>
			<UProgress :value="userQuota.storageUsed"
				:max="userQuota.storageQuota" indicator />
			<p>
				{{ t('quota.storage', {
					used: format(userQuota.storageUsed),
					remaining: format(userQuota.storageRemaining),
					total: format(userQuota.storageQuota)
				}) }}
			</p>
		</div>

		<div>
			<UProgress :value="userQuota.cycleIndexedCount"
				:max="userQuota.indexingQuota" indicator />
			<p>
				{{ t('quota.indexing', {
					count: n(userQuota.cycleIndexedCount, 'decimal'),
					remaining: n(userQuota.cycleIndexingRemaining, 'decimal'),
					total: n(userQuota.indexingQuota, 'decimal')
				}) }}
			</p>
		</div>
	</div>
</template>

<i18n lang="yaml">
en:
  quota:
    storage: 'Storage used: {used}, remaining storage: {remaining},
      total storage: {total}'
    indexing: Indexed {count} images, {remaining} remaining indexing
      times, total {total} indexing times
  error:
    title: Failed to get user quota, please click the support
      button on the left

zh-Hans:
  quota:
    storage: 已使用存储：{used}，剩余存储：{remaining}，总存储：{total}
    indexing: 已索引{count}张图片，剩余{remaining}张图片索引次数，总共{total}张图片索引次数
  error:
    title: 获取用户配额失败，请点击左侧联系客服

ar:
  quota:
    storage: 'المساحة المستخدمة: {used}، المساحة المتبقية: {remaining}،
      إجمالي المساحة: {total}'
    indexing: تم فهرسة {count} صورة، تبقى {remaining} مرة فهرسة،
      الإجمالي {total} مرة فهرسة
  error:
    title: فشل في الحصول على حصة المستخدم، يرجى النقر على زر الدعم
      على اليسار
</i18n>

<script lang="ts" setup>
// @ts-ignore
const { t, n } = useI18n({ numberFormats })

const { error, userQuota } = await useUserQuota()
console.debug(
	'UserQuota',
	userQuota.value
)

const format = useLocaleBytes()

const { toastError } = useAppToast()

if (error) {
	toastError(t('error.title'), error.message)
}
</script>
