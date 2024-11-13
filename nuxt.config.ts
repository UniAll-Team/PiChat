// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	extends: ['@nuxt/ui-pro'],

	modules: [
		'nuxt-server-fn',
		'nuxt-zod-i18n',
		'nuxt-lodash',
		'nuxt-swiper',
		// '@bit0r/nuxt-chatgpt',
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
		'@unlok-co/nuxt-stripe',
		'@sentry/nuxt/module',
		'@sentry/nuxt',
		'@samk-dev/nuxt-vcalendar',
		'nuxt-viewport'
	],

	// debug: true,

	logLevel: 'verbose',

	devtools: {
		enabled: true,
	},

	features: {
		devLogs: true,
	},

	runtimeConfig: {
		openai: {
			apiKey: process.env.OPENAI_API_KEY,
			baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
		},
	},

	app: {
		head: {
			title: 'PiCHat',
		},
	},

	imports: {
		dirs: [
			'./stores',
			'./constants',
		],
	},

	nitro: {
		prerender: {
			routes: ['/', '/docs'],
			crawlLinks: true,
		},
		imports: {
			dirs: ['./constants'],
		}
	},

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
				code: 'zh-CN',
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

	colorMode: {
		disableTransition: true,
	},

	routeRules: {
		'/api/search.json': { prerender: true },
		'/docs': { redirect: '/docs/getting-started', prerender: false },
	},

	typescript: {
		strict: false,
	},

	future: {
		compatibilityVersion: 4,
	},

	lodash: {
		prefix: '_',
		prefixSkip: false,
		upperAfterPrefix: false,
	},

	supabase: {
		redirect: true,
		redirectOptions: {
			login: '/login',
			callback: '/',
			exclude: ['/', '/signup', '/docs', '/pricing'],
		},
	},

	// chatgpt: {
	// 	apiKey: process.env.OPENAI_API_KEY,
	// 	baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
	// },

	stripe: {
		server: {
			key: process.env.STRIPE_SECRET_KEY,
		},
		client: {
			key: process.env.STRIPE_PUBLIC_KEY,
		},
	},

	compatibilityDate: '2024-07-11',
})
