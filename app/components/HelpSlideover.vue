<template>
	<UDashboardSlideover v-model="isHelpSlideoverOpen" title="Help & Support">
		<div class="flex flex-col gap-y-3">
			<UButton v-for="(link, index) in links" :key="index" color="white" v-bind="link" />
		</div>
	</UDashboardSlideover>
</template>

<script setup lang="ts">
const { isHelpSlideoverOpen } = useDashboard()
const query = ref('')

const links = [
	{
		label: 'Documentation',
		icon: 'i-heroicons-book-open',
		to: 'https://ui.nuxt.com/pro/getting-started',
		target: '_blank',
	},
	{
		label: 'GitHub repository',
		icon: 'i-simple-icons-github',
		to: 'https://github.com/nuxt-ui-pro/dashboard',
		target: '_blank',
	},
	{
		label: 'Buy Nuxt UI Pro',
		icon: 'i-heroicons-credit-card',
		to: 'https://ui.nuxt.com/pro/purchase',
		target: '_blank',
	},
]

const categories = computed(() => [
	{
		title: 'General',
		items: [
			{ name: 'Command menu' },
			{ name: 'Notifications' },
			{ name: 'Help & Support' },
			{ name: 'Search' },
		],
	},
	{
		title: 'Navigation',
		items: [
			{ name: 'Go to Home' },
			{ name: 'Go to Inbox' },
			{ name: 'Go to Users' },
			{ name: 'Go to Settings' },
		],
	},
	{
		title: 'Inbox',
		items: [
			{ name: 'Prev notification' },
			{ name: 'Next notification' },
		],
	},
])

const filteredCategories = computed(() => {
	return categories.value
		.map((category) => ({
			title: category.title,
			items: category.items.filter((item) => {
				return item.name.search(new RegExp(query.value, 'i')) !== -1
			}),
		}))
		.filter((category) => !!category.items.length)
})
</script>
