import type { Button } from '#ui/types/button'
import type { Provider } from '@supabase/supabase-js'

import { googleOneTap } from 'vue3-google-login'
import yaml from 'yaml'

const messages = `
en:
  login:
    continue_with: 'Continue with {provider}'
    loading: 'Logging in, please do not close this page...'
    success: 'Successfully logged in with {provider}!'
    error:
      one_tap: 'Error with One Tap Login: {message}'
      oauth: 'Error with Login: {message}'

zh-Hans:
  login:
    continue_with: '使用{provider}继续'
    loading: '正在登录验证，请不要关闭页面...'
    success: '已通过{provider}成功登录！'
    error:
      one_tap: 'One Tap登录出错：{message}'
      oauth: '登录出错：{message}'

ar:
  login:
    continue_with: 'المتابعة باستخدام {provider}'
    loading: 'جارٍ تسجيل الدخول، يرجى عدم إغلاق الصفحة...'
    success: 'تم تسجيل الدخول بنجاح باستخدام {provider}!'
    error:
      one_tap: 'خطأ في تسجيل الدخول السريع: {message}'
      oauth: 'خطأ في تسجيل الدخول: {message}'
`

export function useLoginProviders() {
	const { t } = useI18n({ messages: yaml.parse(messages) })

	const config = useRuntimeConfig()
	const supabase = useSupabaseClient()

	const { toastError, toastSuccess } = useAppToast()

	type UIProvider = Button & { click?: Function, provider: Provider }
	type UIProviders = UIProvider[]

	let providers = ref<UIProviders>([
		/* {
			provider: 'github',
			label: t('login.continue_with', { provider: 'GitHub' }),
			icon: 'i-simple-icons-github',
			color: 'black' as const,
		}, */
		{
			provider: 'google',
			label: t('login.continue_with', { provider: 'Google' }),
			icon: 'i-simple-icons-google',
			color: 'red' as const,
		},
		/* {
			provider: 'apple',
			label: t('login.continue_with', { provider: 'Apple' }),
			icon: 'i-simple-icons-apple',
			color: 'black' as const,
		},
		{
			provider: 'facebook',
			label: t('login.continue_with', { provider: 'Facebook' }),
			icon: 'i-simple-icons-facebook',
			color: 'blue' as const,
		}, */
		{
			provider: 'twitter',
			label: t('login.continue_with', { provider: 'Twitter' }),
			icon: 'i-simple-icons-x',
			color: 'black' as const,
		},
		{
			provider: 'discord',
			label: t('login.continue_with', { provider: 'Discord' }),
			icon: 'i-simple-icons-discord',
			color: 'blue' as const,
		}
	])

	function setLoading(provider: Provider, loading: boolean) {
		const index = providers.value.findIndex((p) => p.provider === provider)
		if (index !== -1) {
			if (loading) {
				providers.value[index].label = t('login.loading')
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

			toastSuccess(t('login.success', { provider: 'Google' }))
			await navigateTo('/home')

		} catch (error) {
			console.error('登录出错', error)
			toastError(t('login.error.one_tap', { message: error.message }))
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

			toastSuccess(`Logged in with ${provider}`)

			await navigateTo('/home')
		} catch (error) {
			console.error('登录出错', error)
			toastError(t('login.error.oauth', { message: error.message }))
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
