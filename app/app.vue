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

<script setup lang="ts">
import * as Sentry from '@sentry/nuxt'


const config = useRuntimeConfig()
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

const user = useSupabaseUser()

const localeHead = useLocaleHead({
	addDirAttribute: true,
	identifierAttribute: 'id',
	addSeoAttributes: true
})

useHead(() => ({
	htmlAttrs: {
		lang: localeHead.value.htmlAttrs?.lang,
		dir: localeHead.value.htmlAttrs?.dir,
	},
	link: [...(localeHead.value.link || [])],
	meta: [...(localeHead.value.meta || [])]
}))

useSeoMeta({
	titleTemplate: '%s %seperator PiCHat',
	ogType: 'website',
	ogImage: {
		url: `${config.public.i18n.baseUrl}/icon-og.png`,
		width: 1024,
		height: 730,
		type: 'image/png',
		alt: 'PiCHat Logo'
	},
	ogTitle: 'PiCHat，一个超越传统在线相册的新型智慧相册。',
	description: 'PiCHat是一个AI赋能的智慧相册，具有安全的相片存储和便捷的使用体验，允许你用自然语言检索保存的图片。'
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
