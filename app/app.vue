<template>
	<div>
		<VitePwaManifest />

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

useSeoMeta({
	ogImage: 'https://saas-template.nuxt.dev/social-card.png',
	twitterImage: 'https://saas-template.nuxt.dev/social-card.png',
	twitterCard: 'summary_large_image'
})
</script>

<style lang="scss">
@media (width<=768px) {
	.hidden-on-mobile {
		display: none;
	}
}

@media (widh>=768px) {
	.hidden-on-desktop {
		display: none;
	}
}
</style>
