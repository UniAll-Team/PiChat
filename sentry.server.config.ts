import * as Sentry from "@sentry/nuxt"
import dotenv from "dotenv"


// 由于 sentry 的服务端在 nuxt 启动前初始化，所以需要在这里加载环境变量
if (process.env.NODE_ENV != "production") {
	/*
	在非生产环境下，使用 dotenv 加载环境变量
	在生产环境下，环境变量应该由 node --env-file=.env 加载，或者由 CI/CD 工具注入
	 */
	dotenv.config({ override: true })
} else {
	// 为了兼容性，还是设置 dotenv，但是不开启 override
	dotenv.config()
}

Sentry.init({
	dsn: process.env.SENTRY_DSN,

	environment: process.env.NODE_ENV,

	// We recommend adjusting this value in production, or using tracesSampler
	// for finer control
	tracesSampleRate: 1.0,
})
