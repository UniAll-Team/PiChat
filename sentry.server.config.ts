import * as Sentry from "@sentry/nuxt"

/*
需要使用 node --env-file=.env，不能使用 dotenv。
因为 dotenv 依赖于 .env 文件，而 .env 文件是在 nuxt.config.ts 之后加载的，形成了循环依赖。
*/

Sentry.init({
	dsn: process.env.SENTRY_DSN,

	environment: process.env.SENTRY_ENVIRONMENT,

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
})
