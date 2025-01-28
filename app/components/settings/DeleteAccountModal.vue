<template>
	<UDashboardModal v-model="model" :title="t('title')"
		:description="t('description')"
		icon="i-heroicons-exclamation-circle" prevent-close
		:close-button="null" :ui="{
			icon: {
				base: 'text-red-500 dark:text-red-400'
			} as any,
			footer: {
				base: 'ml-16'
			} as any
		}">
		<template #footer>
			<UButton color="red" :label="t('button.delete')"
				:loading="loading" @click="deleteAccount" />
			<UButton color="white" :label="t('button.cancel')"
				@click="model = false" />
		</template>
	</UDashboardModal>
</template>

<i18n lang="yaml">
en:
  title: Delete Account
  description: Once your account is deleted, all your data will
    be permanently deleted and cannot be recovered. Are you sure
    you want to delete your account?
  button:
    delete: Delete
    cancel: Cancel
  toast:
    success: Account has been successfully deleted
    error: An error occurred while deleting the account

zh-Hans:
  title: 删除账户
  description: 一旦账户被删除，您的所有数据将被永久删除，而且无法恢复。请问您确定要删除账户吗？
  button:
    delete: 删除
    cancel: 取消
  toast:
    success: 账户已成功删除
    error: 删除账户时出现错误

ar:
  title: حذف الحساب
  description: بمجرد حذف حسابك، سيتم حذف جميع بياناتك بشكل دائم
    ولا يمكن استردادها. هل أنت متأكد أنك تريد حذف حسابك؟
  button:
    delete: حذف
    cancel: إلغاء
  toast:
    success: تم حذف الحساب بنجاح
    error: حدث خطأ أثناء حذف الحساب
</i18n>

<script setup lang="ts">
const model = defineModel<boolean>()

const { t } = useI18n()
const supabase = useSupabaseClient()

const { toastSuccess, toastError } = useAppToast()
const { deleteUser } = useServerFunctions()

const loading = ref(false)

async function deleteAccount() {
	{
		loading.value = true
		const { error } = await deleteUser()
		loading.value = false

		if (error) {
			console.error(error)
			toastError(t('toast.error'), error.message)
			return
		}
		toastSuccess(t('toast.success'))
	}

	// 刷新session，并导航到登录页
	{
		const { data, error } = await supabase.auth.refreshSession()
		await navigateTo('/')
	}
}
</script>
