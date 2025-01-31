<template>
	<div>
		<NuxtPwaManifest />

		<NuxtLoadingIndicator />

		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>

		<UNotifications />
		<UModals />
	</div>
</template>

<i18n lang="yaml">
en:
  ogTitle: "PiChat, an intelligent album surpassing traditional online albums!"
  description: "PiChat is an AI-based intelligent album that allows you to search your photos in your native language. PiChat automatically recognizes objects, scenes, and people in your photos, making it easier for you to find them."
zh-Hans:
  ogTitle: "PiChat，一个超越传统在线相册的智能相册！"
  description: "PiChat 是一个基于AI的智能相册，您可以用您的母语搜索您的照片，PiChat 会自动识别您的照片中的物体、场景、人物等信息，让您可以更方便地找到您的照片。"
ar:
  ogTitle: "PiChat، ألبوم ذكي يتفوق على الألبومات التقليدية عبر الإنترنت!"
  description: "PiChat هو ألبوم ذكي يعتمد على الذكاء الاصطناعي يسمح لك بالبحث في صورك بلغتك الأم. يقوم PiChat بالتعرف تلقائيًا على الأشياء والمشاهد والأشخاص في صورك، مما يسهل عليك العثور عليها."
</i18n>

<script setup lang="ts">
import * as Sentry from '@sentry/nuxt'

const { t } = useI18n()
const config = useRuntimeConfig()
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

const user = useSupabaseUser()

const localeHead = useLocaleHead()

useHead(() => ({
	htmlAttrs: {
		lang: localeHead.value.htmlAttrs?.lang,
		dir: localeHead.value.htmlAttrs?.dir,
	},
	link: [...(localeHead.value.link || [])],
	meta: [...(localeHead.value.meta || [])]
}))

useSeoMeta({
	ogTitle: t('ogTitle'),
	description: t('description'),
})

watchEffect(() =>
	Sentry.setUser({
		id: user.value?.id,
		username: user.value?.user_metadata.full_name,
		email: user.value?.email,
		ip_address: '{{auto}}'
	})
)
</script>

<style lang="scss">
@media (width<=768px) {
	.hidden-on-mobile {
		display: none;
	}
}

@media (width>=768px) {
	.hidden-on-desktop {
		display: none;
	}
}
</style>
