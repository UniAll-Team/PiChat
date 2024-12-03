<template>
	<ScriptYouTubePlayer :video-id :hl="localeMap[locale]"
		above-the-fold>
		<template #awaitingLoad>
			<UIcon name="i-logos-youtube-icon"
				class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12" />
		</template>
		<template #loading>
			<UIcon name="i-line-md-loading-loop"
				class="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-14 h-14" />
		</template>
	</ScriptYouTubePlayer>
</template>

<script lang="ts" setup>
const { videoId } = defineProps<{
	videoId: string
}>()

const { locale } = useI18n()
const localeMap = {
	en: 'en',
	'zh-Hans': 'zh',
	ar: 'ar'
}
</script>
