<template>
	<div>
		<AppHeader />

		<UMain>
			<slot />
		</UMain>

		<!-- <AppFooter /> -->

		<ClientOnly>
			<LazyUContentSearch :files="files"
				:navigation="navigation" />
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import type { ParsedContent } from '@nuxt/content'

const { locale } = useI18n()

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
