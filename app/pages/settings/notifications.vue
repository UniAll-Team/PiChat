<template>
	<UDashboardPanelContent class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800">
		<UDashboardSection v-for="(section, index) in sections" :key="index" :title="section.title"
			:description="section.description" orientation="horizontal" class="px-4 py-6">
			<UCard :ui="{ body: { base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col' } }">
				<UFormGroup v-for="field in section.fields" :key="field.name" :name="field.name" :label="field.label"
					:description="field.description" class="flex items-center justify-between pt-4 first:pt-0 gap-2"
					:ui="{ container: 'flex' }">
					<UToggle v-model="state[field.name]" size="md" @update:model-value="updateNotifications" />
				</UFormGroup>
			</UCard>
		</UDashboardSection>
	</udashboardpanelcontent>
</template>

<script setup lang="ts">
const supabase = useSupabaseClient()
const user = useSupabaseUser()
const { toastSuccess, toastError } = useAppToast()

const state = ref<{ [key: string]: boolean }>(user.value.user_metadata?.notifications)
if (!state.value) {
	state.value = {
		email: true,
		app: false,
		discounts: true,
		product_updates: false,
		important_updates: true,
	}
}

const sections = [
	{
		title: 'Notification channels',
		description: 'Where can we notify you?',
		fields: [
			{
				name: 'email',
				label: 'Email',
				description: 'Receive notifications via email.',
			},
			{
				name: 'app',
				label: 'App',
				description: 'Receive notifications in the app.',
			},
		],
	},
	{
		title: 'Account updates',
		description: 'Receive updates about Nuxt UI.',
		fields: [
			{
				name: 'discounts',
				label: '优惠活动',
				description: 'Receive notifications about discounts and promotions.',
			},
			{
				name: 'product_updates',
				label: 'Product updates',
				description: 'Receive a monthly email with all new features and updates.',
			},
			{
				name: 'important_updates',
				label: 'Important updates',
				description:
					'Receive emails about important updates like security fixes, maintenance, etc.',
			},
		],
	},
]

async function updateNotifications() {
	try {
		const { data, error } = await supabase.auth.updateUser({
			data: {
				notifications: state.value,
			},
		})

		if (error) throw error

		toastSuccess({
			title: 'Success',
			description: 'Notifications updated successfully.',
		})
	} catch (error) {
		toastError({
			title: 'Error',
			description: error.message,
		})
	}
}
</script>
