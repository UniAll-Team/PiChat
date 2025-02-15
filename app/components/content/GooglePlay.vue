<template>
	<UButton variant="outline"
		:to="`https://play.google.com/store/apps/details?id=${config.public.android.packageName}`"
		target="_blank" icon="logos-google-play-icon"
		label="Google Play" :ui="{ rounded: 'rounded-md' }" />
</template>

<script lang="ts" setup>
const config = useRuntimeConfig()
</script>

<style lang="scss" scoped></style>
