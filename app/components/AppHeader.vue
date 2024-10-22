<template>
	<UHeader :links="links">
		<template #logo>
			PiCHat
		</template>

		<template #right v-if="user">
			<UButton label="Dashboard" color="gray" to="/dashboard" />
			<UButton label="Sign out" icon="i-heroicons-arrow-right-20-solid" trailing color="gray"
				@click="supabse.auth.signOut()" />
		</template>
		<template #right v-else>
			<UButton label="Sign in" color="gray" to="/login" />
			<UButton label="Sign up" icon="i-heroicons-arrow-right-20-solid" trailing color="black" to="/signup" />
		</template>

		<template #panel>
			<UNavigationTree :links="mapContentNavigation(navigation)" default-open />
		</template>
	</UHeader>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const navigation = inject<Ref<NavItem[]>>('navigation', ref([]))
const supabse = useSupabaseClient()
const user = useSupabaseUser()

const links = [{
	label: 'Docs',
	to: '/docs'
}, {
	label: 'Pricing',
	to: '/pricing'
}, {
	label: 'Blog',
	to: '/blog'
}]
</script>

<style scoped lang="scss"></style>
