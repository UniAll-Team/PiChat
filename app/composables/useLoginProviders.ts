import type { Button } from '#ui/types/button'
import type { Provider } from '@supabase/supabase-js'

import { googleOneTap } from 'vue3-google-login'

export function useLoginProviders() {
	const supabase = useSupabaseClient()

	const { toastError, toastSuccess } = useAppToast()

	type UIProvider = Button & { [key: string]: any }
	type UIProviders = UIProvider[]

	let providers = ref<UIProviders>([
		/* {
			provider: 'github',
			label: 'Continue with GitHub',
			icon: 'i-simple-icons-github',
			color: 'black' as const,
		}, */
		{
			provider: 'google',
			label: 'Continue with Google',
			icon: 'i-simple-icons-google',
			color: 'red' as const,
		},
		/* {
			provider: 'apple',
			label: 'Continue with Apple',
			icon: 'i-simple-icons-apple',
			color: 'black' as const,
		},
		{
			provider: 'facebook',
			label: 'Continue with Facebook',
			icon: 'i-simple-icons-facebook',
			color: 'blue' as const,
		}, */
		{
			provider: 'twitter',
			label: 'Continue with X',
			icon: 'i-simple-icons-x',
			color: 'black' as const,
		},
		{
			provider: 'discord',
			label: 'Continue with Discord',
			icon: 'i-simple-icons-discord',
			color: 'blue' as const,
		}
	])

	function setLoading(provider: Provider, loading: boolean) {
		const index = providers.value.findIndex((p) => p.provider === provider)
		if (index !== -1) {
			if (loading) {
				providers.value[index].label = '正在登录验证，请不要关闭页面'
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

			toastSuccess('Logged in with Google One Tap')
			await navigateTo('/home')

		} catch (error) {
			console.error('Error logging in with OneTap', error)
			toastError("Error with One Tap Login", error.message)
		} finally {
			setLoading('google', false)
		}
	}

	async function loginWithProvider(provider: Provider) {
		try {
			setLoading(provider, true)

			const { data, error } = await supabase.auth.signInWithOAuth({ provider: provider.provider })
			if (error) {
				throw error
			}

			toastSuccess(`Logged in with ${provider}`)

			await navigateTo('/home')
		} catch (error) {
			console.error('Error logging in with OAuth', error)
			toastError("Error with Login", error.message)
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
