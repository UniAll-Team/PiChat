import * as Sentry from "@sentry/nuxt"

const config = useRuntimeConfig()

console.debug('import env', import.meta.env)

Sentry.init({
	// If set up, you can use your runtime config here
	dsn: config.public.sentry.dsn,
	environment: config.public.sentry.environment,
	enabled: import.meta.env.PROD,
	integrations: [
		Sentry.replayIntegration({
			maskAllText: false,
			blockAllMedia: false
		}),
		Sentry.replayCanvasIntegration(),
		Sentry.feedbackIntegration({
			showBranding: false
		}),
	],
	// Tracing
	// We recommend adjusting this value in production, or using a tracesSampler for finer control.
	tracesSampleRate: 1.0, //  Capture 100% of the transactions

	// This sets the sample rate to be 10%. You may want this to be 100% while
	// in development and sample at a lower rate in production
	replaysSessionSampleRate: 0.1,

	// If the entire session is not sampled, use the below sample rate to sample
	// sessions when an error occurs.
	replaysOnErrorSampleRate: 1.0,
})
