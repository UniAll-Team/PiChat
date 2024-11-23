import type { Provider } from '@supabase/supabase-js'

import { googleOneTap } from 'vue3-google-login'

export function useLoginProviders() {
	const supabase = useSupabaseClient()

	const { toastError, toastSuccess } = useAppToast()

	let providers = [
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
	]

	async function loginWithOneTap() {
		try {
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
		}
	}

	async function loginWithProvider(provider: Provider) {
		const { data, error } = await supabase.auth.signInWithOAuth({ provider })
		if (error) {
			console.error('Error logging in with OAuth', error)
		}

		toastSuccess(`Logged in with ${provider}`)

		await navigateTo('/home')
	}

	providers = providers.map((provider) => {
		switch (provider.provider) {
			case 'google':
				var login = loginWithOneTap
				break
			default:
				var login = async () => await loginWithProvider(<Provider>provider.provider)
		}

		return {
			...provider,
			click: login,
		}
	})

	return providers
}
