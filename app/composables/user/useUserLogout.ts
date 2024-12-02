import yaml from 'yaml'

const messages = `
zh:
  error: '登出失败'
  success: '已成功退出登录'
en:
  error: 'Logout failed'
  success: 'Successfully logged out'
ar:
  error: 'فشل تسجيل الخروج'
  success: 'تم تسجيل الخروج بنجاح'
`

export function useUserLogout() {
	const supabase = useSupabaseClient()
	const { t } = useI18n({ messages: yaml.parse(messages) })
	const { toastError, toastSuccess } = useAppToast()

	async function logout() {
		const { error } = await supabase.auth.signOut()
		if (error) {
			console.error('logout error:', error)
			toastError(t('error', { message: error.message }), error.message)
			return { error }
		}

		toastSuccess(t('success'))
		await navigateTo('/')
	}

	return {
		logout
	}
}
