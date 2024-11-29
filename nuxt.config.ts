// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	extends: ['@nuxt/ui-pro'],

	modules: [
		'nuxt-server-fn',
		'nuxt-zod-i18n',
		'nuxt-lodash',
		'nuxt-swiper',
		'nuxt-viewport',
		'@nuxtjs/i18n',
		'@nuxtjs/supabase',
		'@nuxt/content',
		// '@nuxt/fonts',
		'@nuxt/image',
		'@nuxt/ui',
		'@nuxthq/studio',
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'@nuxtjs/seo',
		'@unlok-co/nuxt-stripe',
		'@sentry/nuxt/module',
		'@samk-dev/nuxt-vcalendar',
		'@vite-pwa/nuxt',
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
		public: {
			sentry: {
				dsn: process.env.SENTRY_DSN,
				environment: process.env.SENTRY_ENVIRONMENT,
			}
		}
	},

	app: {
		head: {
			seoMeta: {
				titleTemplate: `%s %separator ${process.env.NUXT_SITE_NAME}`,
				description: process.env.NUXT_SITE_DESCRIPTION,
				author: process.env.NUXT_SITE_AUTHOR,
				applicationName: process.env.NUXT_SITE_NAME,
				appleMobileWebAppTitle: process.env.NUXT_SITE_NAME,
				mobileWebAppCapable: 'yes',
				appleMobileWebAppCapable: 'yes',

				ogType: 'website',
				ogImage: {
					url: `${process.env.NUXT_PUBLIC_SITE_URL}/icon-og.png`,
					width: 1024,
					height: 730,
					type: 'image/png',
					alt: 'Logo'
				},
				ogSiteName: process.env.NUXT_SITE_NAME,
				ogAuthor: process.env.NUXT_SITE_AUTHOR,
				ogTitle: process.env.NUXT_SITE_OG_TITLE,
			},
			meta: [
				{ charset: 'utf-8' },
			],
			link: [
				{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
				{ rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16.png' },
				{ rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32.png' },
				{ rel: 'icon', type: 'image/png', href: '/favicon-180.png' },
				{ rel: 'icon', type: 'image/png', sizes: '180x180', href: '/favicon-180.png' },
				{ rel: 'apple-touch-icon', sizes: '180x180', href: '/favicon-180.png' },
			],
		},
	},

	pwa: {
		manifest: {
			name: process.env.NUXT_SITE_NAME,
			description: process.env.NUXT_SITE_DESCRIPTION,
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
		// must use `no_prefix`, otherwise user will be redirected to default language when clicking other paths
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
		baseUrl: process.env.NUXT_PUBLIC_I18N_BASE_URL || 'http://localhost:3000',
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

	stripe: {
		server: {
			key: process.env.STRIPE_SECRET_KEY,
		},
		client: {
			key: process.env.STRIPE_PUBLIC_KEY,
		},
	},

	sourcemap: { client: true },
	sentry: {
		sourceMapsUploadOptions: {
			authToken: process.env.SENTRY_AUTH_TOKEN,
		}
	},

	linkChecker: {
		failOnError: true,
		report: {
			markdown: true,
		}
	},

	seo: {
		automaticDefaults: true,
	},

	ogImage: {
		zeroRuntime: true,
	},

	robots: {
		blockNonSeoBots: true,
	},

	compatibilityDate: '2024-07-11',
})
