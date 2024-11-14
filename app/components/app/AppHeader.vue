<template>
	<UHeader :links="links">
		<template #logo>
			PiCHat
		</template>

		<template #right v-if="user">
			<UButton :label="t('dashboard')" color="gray"
				to="/home" />
			<UButton :label="t('signout')"
				icon="i-heroicons-arrow-right-20-solid" trailing
				color="gray" @click="supabse.auth.signOut()" />
		</template>
		<template #right v-else>
			<UButton :label="t('signin')" color="gray"
				to="/login" />
			<UButton :label="t('signup')"
				icon="i-heroicons-arrow-right-20-solid" trailing
				color="black" to="/signup" />
		</template>

		<template #panel>
			<UNavigationTree
				:links="mapContentNavigation(navigation)"
				default-open />
		</template>
	</UHeader>
</template>

<i18n lang="yaml">
en:
  logo: PiCHat
  nav:
    docs: Docs
    pricing: Pricing
    blog: Blog
  signin: Sign in
  signup: Sign up
  signout: Sign out
  dashboard: Dashboard

zh-Hans:
  logo: PiCHat
  nav:
    docs: 文档
    pricing: 定价
    blog: 博客
  signin: 登录
  signup: 注册
  signout: 登出
  dashboard: 仪表盘

ar:
  logo: PiCHat
  nav:
    docs: الوثائق
    pricing: التسعير
    blog: المدونة
  signin: تسجيل الدخول
  signup: اشترك
  signout: تسجيل الخروج
  dashboard: لوحة القيادة
</i18n>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const { t } = useI18n()

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))
const supabse = useSupabaseClient()
const user = useSupabaseUser()

const links = [{
	label: t('nav.docs'),
	to: '/docs'
}, {
	label: t('nav.pricing'),
	to: '/pricing'
}, {
	label: t('nav.blog'),
	to: '/blog'
}]
</script>

<style scoped lang="scss"></style>
