import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
	// 只能使用 AppConfig 而不能使用 RuntimeConfig，因为 RuntimeConfig 必须在服务端和客户端同时可用
	const appConfig = useAppConfig()

	nuxtApp.vueApp.use(vue3GoogleLogin, {
		clientId: appConfig.google.clientId
	})
})
