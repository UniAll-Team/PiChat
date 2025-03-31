import removeConsole from "vite-plugin-remove-console"

export default defineNuxtConfig({
	extends: ['@nuxt/ui-pro'],

	modules: [
		'nuxt-server-fn',
		'nuxt-zod-i18n',
		'nuxt-lodash',
		// 'nuxt-swiper',
		'nuxt-viewport',
		'@nuxtjs/i18n',
		'@nuxtjs/seo',
		'@nuxtjs/supabase',
		'@nuxt/scripts',
		'@nuxt/content',
		// '@nuxt/fonts',
		'@nuxt/image',
		'@nuxt/ui',
		'@vueuse/nuxt',
		'@pinia/nuxt',
		'pinia-plugin-persistedstate/nuxt',
		'nuxt-webhook-validators',
		'@sentry/nuxt/module',
		'@samk-dev/nuxt-vcalendar',
		'@vite-pwa/nuxt',
	],

	vite: {
		plugins: [
			removeConsole({
				includes: ['debug', 'dir'],
			})
		]
	},

	// 生产环境下打开，否则后台没有任何输出
	debug: process.env.NODE_ENV == 'production',

	logLevel: 'verbose',

	devtools: {
		enabled: true,
	},

	features: {
		devLogs: true,
	},

	devServer: {
		// 防止与生产环境端口冲突
		port: 4000,
	},

	runtimeConfig: {
		openai: {
			apiKey: process.env.OPENAI_API_KEY,
			baseURL: process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
		},
		voyageAI: {
			apiKey: process.env.VOYAGE_API_KEY,
		},
		webhook: {
			paddle: {
				webhookId: process.env.PADDLE_WEBHOOK_ID,
			},
		},
		paddle: {
			apiKey: process.env.PADDLE_API_KEY
		},
		// 是否使用代理，这里不能使用 `yn`，因为 `yn` 的输出在编译时会被转换为常量
		useProxy: process.env.NUXT_USE_PROXY,
		proxy: {
			// 代理配置，不能在 .env 中配置，因为会干扰很多程序
			http: 'http://localhost:8800',
			socks5: 'socks5://localhost:1080',
			socks5h: 'socks5h://localhost:1080',
		},
		public: {
			sentry: {
				dsn: process.env.SENTRY_DSN,
				environment: process.env.NODE_ENV,
			},
			paddle: {
				environment: process.env.PADDLE_ENVIRONMENT as 'sandbox' | 'production',
				clientToken: process.env.PADDLE_CLIENT_TOKEN,
			},
			storeReview: {
				email: process.env.STORE_REVIEW_EMAIL,
				password: process.env.STORE_REVIEW_PASSWORD,
			},
			android: {
				packageName: process.env.ANDROID_PACKAGE_NAME,
			}
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
		},
	},

	piniaPluginPersistedstate: {
		// 使用 `localStorage`，使用 `cookies` 很容易导致 cookie 过大，从而导致请求失败
		storage: 'localStorage',
	},

	i18n: {
		//debug: true,

		// 必须使用`no_prefix`，否则用户点击其他路径时将被重定向到默认语言
		strategy: 'no_prefix',
		detectBrowserLanguage: {
			redirectOn: 'root',
			alwaysRedirect: true,
			useCookie: true,
			cookieCrossOrigin: true,
			fallbackLocale: (process.env.NUXT_DEFAULT_LOCALE as 'en' | 'ar' | 'zh-Hans') || 'en',
		},
		customBlocks: {
			defaultSFCLang: 'yaml'
		},
		lazy: true,
		defaultLocale: (process.env.NUXT_DEFAULT_LOCALE as 'en' | 'ar' | 'zh-Hans') || 'en',
		baseUrl: process.env.NUXT_SITE_URL || 'http://localhost:3000',
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
				isCatchallLocale: true,
			},
			{
				code: 'de',
				language: 'de',
				name: 'Deutsch',
				file: 'de.yaml',
			},
		].filter(local =>
			// 仅在开发环境下显示中文
			process.env.NODE_ENV == 'development' || local.code != 'zh-Hans'
		),
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
		// 将 `@nuxt/ui` 组件定义为全局组件，以便在 `.md` 中使用它们（随意添加您需要的组件）
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
		// 不能开启，因为大量外部组件没有类型定义
		//typeCheck: true,
	},

	future: {
		compatibilityVersion: 4,
	},

	app: {
		head: {
			// @ts-ignore
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
					url: `${process.env.NUXT_SITE_URL}/icon-og.png`,
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
			id: process.env.NUXT_SITE_NAME?.toLowerCase(),
			name: process.env.NUXT_SITE_NAME,
			description: process.env.NUXT_SITE_DESCRIPTION,
			// PWABuilder 必须使用16进制颜色，否则会报错
			theme_color: '#ecffff',
			categories: ['photo', 'productivity', 'utilities'],
			screenshots: [
				{
					src: '/images/home.jpg',
					sizes: '1660x800',
					type: 'image/jpg',
				},
				{
					src: '/images/settings.png',
					sizes: '1460x800',
					type: 'image/png',
				},
			],
			lang: process.env.NUXT_DEFAULT_LOCALE || 'en',
			orientation: 'natural',
			prefer_related_applications: false,
			launch_handler: {
				client_mode: 'auto',
			},
			display_override: [
				'window-controls-overlay',
				'standalone',
				'browser',
			],
			icons: [
				{
					src: '/icon-64.png',
					sizes: '64x64',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: '/icon-192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: '/icon-384.png',
					sizes: '384x384',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: '/icon-512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: '/icon-1024.png',
					sizes: '1024x1024',
					type: 'image/png',
					purpose: 'any',
				},
				{
					src: '/maskable-icon-192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: '/maskable-icon-384.png',
					sizes: '384x384',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: '/maskable-icon-512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: '/maskable-icon-1024.png',
					sizes: '1024x1024',
					type: 'image/png',
					purpose: 'maskable',
				},
				{
					src: '/removebg-icon-192.png',
					sizes: '192x192',
					type: 'image/png',
					purpose: 'monochrome',
				},
				{
					src: '/removebg-icon-384.png',
					sizes: '384x384',
					type: 'image/png',
					purpose: 'monochrome',
				},
				{
					src: '/removebg-icon-512.png',
					sizes: '512x512',
					type: 'image/png',
					purpose: 'monochrome',
				},
				{
					src: '/removebg-icon-1024.png',
					sizes: '1024x1024',
					type: 'image/png',
					purpose: 'monochrome',
				}
			]
		},
		// 必须使用 `autoUpdate`，否则有可能产生缓存问题，打开网页是白板
		registerType: 'autoUpdate',
		workbox: {
			// 全部开启，防止产生缓存问题
			skipWaiting: true,
			clientsClaim: true,
			cleanupOutdatedCaches: true,
		},
		registerWebManifestInRouteRules: true,
		devOptions: {
			enabled: true,
			type: 'module',
			navigateFallback: '/',
			navigateFallbackAllowlist: [/^\/$/],
		},
	},

	icon: {
		serverBundle: {
			collections: [
				'heroicons',
				'simple-icons',
				'hugeicons',
				'line-md',
				'logos',
				'mdi',
			]
		}
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
			exclude: ['/', '/docs/**', '/pricing'],
		},
	},

	sourcemap: true,
	sentry: {
		sourceMapsUploadOptions: {
			org: process.env.SENTRY_ORG,
			project: process.env.SENTRY_PROJECT,
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
		metaTag: false,
		blockNonSeoBots: true,
		disallow: '',
		allow: '/',
	},

	compatibilityDate: '2024-12-26',
})
