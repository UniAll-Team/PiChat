<template>
	<div>
		<div>
			<UProgress :value="userQuota.storageUsed"
				:max="userQuota.storageQuota" indicator />
			<p>
				<span>
					已使用
					{{ convertB2Readable(userQuota.storageUsed) }}，
				</span>
				<span>
					剩余
					{{ convertB2Readable(userQuota.storageRemaining) }}，
				</span>
				<span>
					共 {{ convertB2Readable(userQuota.storageQuota) }}
				</span>
			</p>
		</div>

		<ClientOnly>
			<div>
				<UProgress :value="userQuota.cycleIndexedCount"
					:max="userQuota.cycleIndexingQuota" indicator />
				<p>
					<span>
						已索引{{ userQuota.cycleIndexedCount }}张图片，
					</span>
					<span>
						还有{{ userQuota.cycleIndexingRemaining }}张图片可被索引，
					</span>
					<span>
						最多索引{{ userQuota.cycleIndexingQuota }}张图片
					</span>
				</p>
			</div>
		</ClientOnly>
	</div>
</template>

<script lang="ts" setup>
const { error, userQuota } = await useUserQuota()

const { toastError } = useAppToast()

if (error) {
	toastError({
		title: '获取用户配额失败，请点击左侧联系客服',
		description: error.message
	})
}

console.debug(
	'UserQuota',
	userQuota.value
)
</script>
