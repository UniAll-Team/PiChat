// plugins/hydration-error-handler.ts
export default defineNuxtPlugin(nuxtApp => {
	nuxtApp.vueApp.config.errorHandler = async (error, instance, info) => {
		console.error('Global error handler:', error, instance, info)

		if (info === 'hydration') {
			console.error('Hydration error detected', error)
			await correctHydrationIssue()
		}
	}
})

async function correctHydrationIssue() {
	const supabase = useSupabaseClient()
	const { error } = await supabase.auth.refreshSession()
	if (error) {
		console.error('Failed to refresh session', error)
		return
	}
}
