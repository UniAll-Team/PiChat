import type { Provider } from '@supabase/supabase-js'

export function useProviders() {
	let providers = [
		{
			provider: 'github',
			label: 'Continue with GitHub',
			icon: 'i-simple-icons-github',
			color: 'gray' as const,
		},
		{
			provider: 'google',
			label: 'Continue with Google',
			icon: 'i-simple-icons-google',
			color: 'white' as const,
		},
	]

	async function loginWithProvider(provider: Provider) {
		const supabase = useSupabaseClient()
		const { data, error } = await supabase.auth.signInWithOAuth({ provider: provider })
		if (error) {
			console.error('Error logging in with OAuth', error)
		}
	}

	providers = providers.map((provider) => {
		return {
			...provider,
			click: async () => await loginWithProvider(<Provider>provider.provider),
		}
	})

	return providers
}
