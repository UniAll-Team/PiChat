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
		// '@nuxt/fonts',
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
			meta: [
				{ charset: 'utf-8' },
				{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
				{ hid: 'description', name: 'description', content: 'PiCHat is an AI-powered smart photo album.' },
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
				{ rel: 'icon', type: 'image/png', sizes: '180x180', href: '/favicon-180.png' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-180.png' },
			],
		},
	},

	pwa: {
		manifest: {
			name: 'PiCHat',
			short_name: 'PiCHat',
			description: 'PiCHat is an AI-powered smart photo album.',
			theme_color: '#000000',
			lang: 'zh-Hans',
			icons: [
				{
					src: '/icon-64.png',
					sizes: '64x64',
					type: 'image/png',
				},
				{
					src: '/icon-192.png',
					sizes: '192x192',
					type: 'image/png',
				},
				{
					src: '/icon-512.png',
					sizes: '512x512',
					type: 'image/png',
				},
				{
					src: '/icon-1024.png',
					sizes: '1024x1024',
					type: 'image/png',
				},
			]
		},
		registerWebManifestInRouteRules: true,
		devOptions: {
			enabled: true,
			type: 'module',
			navigateFallback: '/',
			navigateFallbackAllowlist: [/^\/$/],
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
		// debug: true,
		// 必须使用 `no_prefix`，否则用户点击其他路径时又会跳转到默认语言
		strategy: 'no_prefix',
		detectBrowserLanguage: {
			redirectOn: 'root',
			alwaysRedirect: true,
			useCookie: true,
			cookieCrossOrigin: true,
			fallbackLocale: process.env.NUXT_DEFAULT_LOCALE || 'en',
		},
		lazy: true,
		langDir: 'locales/',
		defaultLocale: process.env.NUXT_DEFAULT_LOCALE || 'en',
		baseUrl: process.env.NUXT_BASE_URL || 'http://localhost:3000',
		locales: [
			{
				code: 'en',
				language: 'en',
				name: 'English',
				file: 'en.yaml',
			},
			{
				code: 'ar',
				language: 'ar',
				name: 'العربية',
				file: 'ar.yaml',
			},
			{
				code: 'zh-Hans',
				language: 'zh-Hans',
				name: '简体中文',
				file: 'zh-Hans.yaml',
			},
		],
		experimental: {
			switchLocalePathLinkSSR: true,
		}
	},

	content: {
		defaultLocale: process.env.NUXT_DEFAULT_LOCALE || 'en',
		locales: [
			'en',
			'zh-Hans',
			'ar'
		]
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
		'/docs': { redirect: '/docs/getting-started/usage' },
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
