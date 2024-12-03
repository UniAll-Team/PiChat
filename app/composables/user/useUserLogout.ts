export function useUserLogout() {
	const supabase = useSupabaseClient()
	const { t } = useI18n()
	const { toastError, toastSuccess } = useAppToast()

	async function logout() {
		const { error } = await supabase.auth.signOut()
		if (error) {
			console.error('logout error:', error)
			toastError(t('logout.error', { message: error.message }), error.message)
			return { error }
		}

		toastSuccess(t('logout.success'))
		await navigateTo('/')
	}

	return {
		logout
	}
}
