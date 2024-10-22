// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	extends: ['@nuxt/ui-pro'],

	modules: [
		'nuxt-zod-i18n',
		'@nuxtjs/i18n',
		'@vite-pwa/nuxt',
		'@nuxtjs/supabase',
		'@nuxt/content',
		'@nuxt/fonts',
		'@nuxt/image',
		'@nuxt/ui',
		'@nuxthq/studio',
		'@vueuse/nuxt',
		'nuxt-og-image',
		'@pinia/nuxt',
	],

	i18n: {
		strategy: 'prefix_and_default',
		detectBrowserLanguage: {
			useCookie: true,
			redirectOn: 'root',
			alwaysRedirect: true,
		},
		lazy: true,
		langDir: 'locales/',
		defaultLocale: 'en',
		locales: [
			{
				code: 'en',
				language: 'en-US',
				name: 'English',
				file: 'en-US.ts',
			},
			{
				code: 'ar',
				language: 'ar-SA',
				name: 'العربية',
				file: 'ar-SA.ts',
			},
			{
				code: 'zh',
				language: 'zh-CN',
				name: '简体中文',
				file: 'zh-CN.ts',
			},
		],
	},

	hooks: {
		// Define `@nuxt/ui` components as global to use them in `.md` (feel free to add those you need)
		'components:extend': (components) => {
			const globals = components.filter((c) => ['UButton'].includes(c.pascalName))

			globals.forEach((c) => (c.global = true))
		},
	},

	// colorMode: {
	// 	disableTransition: true,
	// },

	// nitro: {
	// 	prerender: {
	// 		routes: ['/', '/docs'],
	// 		crawlLinks: true,
	// 	},
	// },

	// routeRules: {
	// 	'/api/search.json': { prerender: true },
	// 	'/docs': { redirect: '/docs/getting-started', prerender: false },
	// },

	devtools: {
		enabled: true,
	},

	// typescript: {
	// 	strict: false,
	// },

	future: {
		compatibilityVersion: 4,
	},

	supabase: {
		redirect: true,
		redirectOptions: {
			login: '/login',
			callback: '/',
			exclude: ['/', '/signup', '/docs', '/pricing'],
		},
	},

	compatibilityDate: '2024-07-11',
})
