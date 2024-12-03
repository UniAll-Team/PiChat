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

const { locale } = useI18n()

useSeoMeta({
	title: 'Page not found',
	description: 'We are sorry but this page could not be found.'
})

const { error } = defineProps<{ error: NuxtError }>()
const { data: navigation } = await useAsyncData('navigation',
	() => fetchContentNavigation(
		queryContent().locale(locale.value)
	),
	{ default: () => [] }
)

provide('navigation', navigation)
</script>
