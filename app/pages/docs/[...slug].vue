<template>
	<UPage v-if="page">
		<UPageHeader :title="page.title"
			:description="page.description" :links="page.links"
			:headline="headline" />

		<UPageBody prose>
			<ContentRenderer v-if="page.body" :value="page" />

			<hr v-if="surround?.length">

			<UContentSurround :surround="surround" />
		</UPageBody>

		<template v-if="page.toc !== false" #right>
			<UContentToc :links="page.body?.toc?.links" />
		</template>
	</UPage>
</template>

<script setup lang="ts">
import { StatusCodes } from 'http-status-codes'
import { withoutTrailingSlash } from 'ufo'

const { locale } = useI18n()

const route = useRoute()

console.debug('locale', locale.value)

const { data: page } = await useAsyncData(route.path, () =>
	queryContent(route.path)
		.locale(locale.value)
		.findOne()
)

console.debug('page', page.value)

if (!page.value) {
	throw createError({ statusCode: StatusCodes.NOT_FOUND, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`,
	() => queryContent('docs')
		.locale(locale.value)
		.where({ _extension: 'md', navigation: { $ne: false } })
		.only(['title', 'description', '_path'])
		.findSurround(withoutTrailingSlash(route.path)),
	{ default: () => [] }
)

useSeoMeta({
	description: page.value?.description,
})

const headline = computed(() => findPageHeadline(page.value!))
</script>
