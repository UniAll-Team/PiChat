import type { Button } from '#ui/types/button'
import type { Provider } from '@supabase/supabase-js'

import { googleOneTap } from 'vue3-google-login'

export function useLoginProviders() {
	const { t } = useI18n()

	const config = useRuntimeConfig()
	const supabase = useSupabaseClient()

	const { toastError, toastSuccess } = useAppToast()

	type UIProvider = Button & { click?: Function, provider: Provider }
	type UIProviders = UIProvider[]

	let providers = ref<UIProviders>([
		{
			provider: 'github',
			label: t('login_provider.continue_with', { provider: 'GitHub' }),
			icon: 'i-simple-icons-github',
			color: 'black' as const,
		},
		{
			provider: 'google',
			label: t('login_provider.continue_with', { provider: 'Google' }),
			icon: 'i-simple-icons-google',
			color: 'red' as const,
		},
		/* {
			provider: 'apple',
			label: t('login_provider.continue_with', { provider: 'Apple' }),
			icon: 'i-simple-icons-apple',
			color: 'black' as const,
		},
		{
			provider: 'facebook',
			label: t('login_provider.continue_with', { provider: 'Facebook' }),
			icon: 'i-simple-icons-facebook',
			color: 'blue' as const,
		}, */
		{
			provider: 'twitter',
			label: t('login_provider.continue_with', { provider: 'X' }),
			icon: 'i-simple-icons-x',
			color: 'black' as const,
		},
		{
			provider: 'discord',
			label: t('login_provider.continue_with', { provider: 'Discord' }),
			icon: 'i-simple-icons-discord',
			color: 'blue' as const,
		}
	])

	function setLoading(provider: Provider, loading: boolean) {
		const index = providers.value.findIndex((p) => p.provider === provider)
		if (index !== -1) {
			if (loading) {
				providers.value[index].label = t('login_provider.loading')
			}
			providers.value[index].loading = loading
		}
	}

	async function loginWithOneTap() {
		try {
			setLoading('google', true)

			const response = await googleOneTap()

			const { data, error } = await supabase.auth.signInWithIdToken({
				provider: 'google',
				token: response.credential
			})
			if (error) {
				throw error
			}

			console.debug('登录成功', data)
			toastSuccess(t('login_provider.success', { provider: 'Google' }))

			await navigateTo('/home')
		} catch (error) {
			console.error('登录出错', error)
			toastError(t('login_provider.error.one_tap', { message: error.message }))
		} finally {
			setLoading('google', false)
		}
	}

	async function loginWithProvider(provider: Provider) {
		try {
			setLoading(provider, true)

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: { redirectTo: config.public.i18n.baseUrl }
			})
			if (error) {
				throw error
			}

			console.debug('登录成功', data)
			toastSuccess(t('login_provider.success', { provider }))
		} catch (error) {
			console.error('登录出错', error)
			toastError(t('login_provider.error.oauth', { message: error.message }))
		} finally {
			setLoading(provider, false)
		}
	}

	providers.value = providers.value.map(
		(provider) => {
			switch (provider.provider) {
				case 'google':
					var login = loginWithOneTap
					break
				default:
					var login = async () => await loginWithProvider(provider.provider)
			}

			return {
				...provider,
				click: login,
			}
		})

	return providers
}
