import vue3GoogleLogin from 'vue3-google-login'

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.use(vue3GoogleLogin, {
		// 必须直接填写，因为客户端插件无法访问环境变量
		clientId: '571862860524-n4ulfjogo75ace3ckb2j5g1sgehs6340.apps.googleusercontent.com',
	})
})
