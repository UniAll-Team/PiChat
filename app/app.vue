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
const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#111827' : 'white')

const localeHead = useLocaleHead({
	addDirAttribute: true,
	identifierAttribute: 'id',
	addSeoAttributes: true
})

useHead(() => {

	const head = {
		htmlAttrs: {
			lang: localeHead.value.htmlAttrs?.lang,
			dir: localeHead.value.htmlAttrs?.dir,
		},
		link: [...(localeHead.value.link || [])],
		meta: [...(localeHead.value.meta || [])]
	}

	console.debug('head', head)

	return head
})

useSeoMeta({
	// ogImage: 'https://saas-template.nuxt.dev/social-card.png',
	// twitterImage: 'https://saas-template.nuxt.dev/social-card.png',
	// twitterCard: 'summary_large_image'
})
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
