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

		<ClientOnly>
			<LazyUContentSearch :files="files"
				:navigation="navigation" />
		</ClientOnly>

		<UNotifications />
	</div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'
import type { ParsedContent } from '@nuxt/content'

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

const { data: files } = await useAsyncData('files',
	() => queryContent().where({ _type: 'markdown', navigation: { $ne: false } }).find(),
	{ default: () => [] }
)

provide('navigation', navigation)
</script>
