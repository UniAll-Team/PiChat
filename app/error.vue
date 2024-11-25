<template>
	<div>
		<AppHeader />

		<UMain>
			<UContainer>
				<UPage>
					<UPageError :error="error" />
				</UPage>
			</UContainer>
		</UMain>

		<!-- <AppFooter /> -->

		<UNotifications />
	</div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

useSeoMeta({
	title: 'Page not found',
	description: 'We are sorry but this page could not be found.'
})

defineProps({
	error: {
		type: Object as PropType<NuxtError>,
		required: true
	}
})

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation(), { default: () => [] })

provide('navigation', navigation)
</script>
