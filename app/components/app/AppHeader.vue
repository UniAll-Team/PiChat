<template>
	<UHeader :links="links">
		<template #logo>
			PiChat
		</template>

		<template #right>
			<UPopover>
				<!-- 弹出式语言切换 -->
				<UButton color="black" variant="ghost"
					icon="i-heroicons-language" />

				<template #panel>
					<ul>
						<li v-for="locale in locales">
							<UButton v-show="locale.code != currentLocale"
								:label="locale.name"
								@click="switchLocale(locale.code)"
								color="gray" variant="ghost" />
						</li>
					</ul>
				</template>
			</UPopover>

			<div v-if="user">
				<UButton :label="t('dashboard')" color="gray"
					to="/home" />
				<UButton :label="t('signout')"
					icon="i-heroicons-arrow-right-20-solid" trailing
					color="gray" @click="logout" />
			</div>
			<div v-else>
				<UButton :label="t('signin')" color="gray"
					to="/login"
					trailing-icon="i-heroicons-arrow-right-20-solid" />
			</div>

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
  logo: PiChat
  nav:
    docs: Docs
    pricing: Pricing
    install: Installation
    customer-service: Customer Service
  signin: Sign in
  signup: Sign up
  signout: Sign out
  dashboard: Dashboard

zh-Hans:
  logo: PiChat
  nav:
    docs: 文档
    pricing: 定价
    install: 安装
    customer-service: 客服
  signin: 登录
  signup: 注册
  signout: 登出
  dashboard: 仪表盘

ar:
  logo: PiChat
  nav:
    docs: الوثائق
    pricing: التسعير
    install: التثبيت
    customer-service: خدمة العملاء
  signin: تسجيل الدخول
  signup: اشترك
  signout: تسجيل الخروج
  dashboard: لوحة القيادة
</i18n>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const { t, locale: currentLocale, locales, setLocale } = useI18n()

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))
const user = useSupabaseUser()

const { logout } = useUserLogout()

async function switchLocale(code: string) {
	// @ts-ignore
	await setLocale(code)
	location.reload()
}

const links = [
	{
		label: t('nav.docs'),
		to: '/docs'
	},
	{
		label: t('nav.install'),
		to: '/docs/getting-started/installation'
	},
	{
		label: t('nav.pricing'),
		to: '/pricing'
	},
	{
		label: t('nav.customer-service'),
		to: '/docs/contact-us'
	}
]
</script>
