import * as Sentry from "@sentry/nuxt"
import dotenv from 'dotenv'

dotenv.config()

Sentry.init({
	dsn: process.env.SENTRY_DSN,

	environment: process.env.SENTRY_ENVIRONMENT,

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
})
