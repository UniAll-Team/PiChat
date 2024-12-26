import type { Provider } from '@supabase/supabase-js'
import type { ProviderButton } from '~/types'

import { UAParser } from 'ua-parser-js'
import { googleOneTap } from 'vue3-google-login'

export function useLoginProviders() {
	const { t } = useI18n()

	const supabase = useSupabaseClient()

	const { toastError, toastSuccess } = useAppToast()

	type UIProviders = ProviderButton[]

	let providers = ref<UIProviders>([
		// github 有bug，不知道怎么修复
		/* {
			provider: 'github',
			label: t('login_provider.continue_with', { provider: 'GitHub' }),
			icon: 'i-simple-icons-github',
			color: 'black' as const,
		}, */
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

			console.debug('登录中', provider)

			const { data, error } = await supabase.auth.signInWithOAuth({
				provider,
				options: { redirectTo: location.origin }
			})
			if (error) {
				throw error
			}

			console.debug('登录成功', data)
			toastSuccess(t('login_provider.loading'))
		} catch (error) {
			console.error('登录出错', error)
			toastError(t('login_provider.error.oauth', { message: error.message }))
		} finally {
			setLoading(provider, false)
		}
	}

	providers.value = providers.value.map(
		provider => {
			const providerName = provider.provider

			const result = UAParser()
			const browserName = result.browser.name
			const engineName = result.engine.name

			if (providerName == 'google' && engineName == 'Blink' && browserName != 'Edge') {
				var login = loginWithOneTap
			} else {
				var login = async () => await loginWithProvider(provider.provider)
			}

			return {
				...provider,
				click: login,
			}
		})

	return providers
}
