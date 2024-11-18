<template>
	<UDashboardPanelContent class="pb-24">
		<UDashboardSection title="Language"
			description="Select your preferred language.">
			<template #links>
				<USelectMenu v-model="locale" :options="locales"
					option-attribute="name" value-attribute="code"
					color="gray" />
			</template>
		</UDashboardSection>

		<UDivider class="mb-4" />

		<UDashboardSection title="Theme"
			description="Customize the look and feel of your dashboard.">
			<template #links>
				<UColorModeSelect color="gray" />
			</template>
		</UDashboardSection>

		<UDivider class="mb-4" />

		<UForm :state :schema @submit="updateProfile">
			<UDashboardSection title="Profile"
				description="This information will be displayed publicly so be careful what you share.">
				<template #links>
					<UButton type="submit" label="Save changes"
						color="black" />
				</template>

				<UFormGroup name="full_name" label="Full Name"
					description="Will appear on receipts, invoices, and other communication."
					class="grid grid-cols-2 gap-2 items-center"
					:ui="{ container: '' }">
					<UInput v-model="state.full_name"
						autocomplete="off" icon="i-heroicons-user"
						size="md" />
				</UFormGroup>

				<UFormGroup name="email" label="Email"
					description="Used to sign in, for email receipts and product updates."
					required class="grid grid-cols-2 gap-2"
					:ui="{ container: '' }">
					<UInput v-model="state.email" type="email"
						autocomplete="off" icon="i-heroicons-envelope"
						size="md" />
				</UFormGroup>

				<UFormGroup name="bio" label="Bio"
					description="Brief description for your profile. URLs are hyperlinked."
					class="grid grid-cols-2 gap-2"
					:ui="{ container: '' }">
					<UTextarea v-model="state.bio" :rows="5"
						autoresize size="md" />
				</UFormGroup>

				<UFormGroup name="password" label="Password"
					description="Confirm your current password before setting a new one."
					class="grid grid-cols-2 gap-2"
					:ui="{ container: '' }">
					<UInput id="password" v-model="state.password"
						type="password" placeholder="Current password"
						size="md" />
					<UInput id="repeatPassword"
						v-model="state.repeatPassword" type="password"
						placeholder="Repeat New password" size="md"
						class="mt-2" />
				</UFormGroup>
			</UDashboardSection>
		</UForm>

		<UDivider class="mb-4" />

		<UDashboardSection title="Account"
			description="No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently.">
			<div>
				<UButton color="red" label="Delete account"
					size="md"
					@click="isDeleteAccountModalOpen = true" />
			</div>
		</UDashboardSection>

		<SettingsDeleteAccountModal
			v-model="isDeleteAccountModalOpen" />
	</UDashboardPanelContent>
</template>

<script lang="ts" setup>
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { locale, locales, setLocale } = useI18n()

watch(locale, () => {
	console.debug('Switching locale to', locale.value)
	setLocale(locale.value)
	// 需要强制刷新页面，因为 Nuxt 无法动态切换语言
	location.reload()
})

const { toastSuccess, toastError } = useAppToast()

const isDeleteAccountModalOpen = ref(false)

const { state, schema, updateProfile } = useUserProfile()

function useUserProfile() {
	const state = ref({
		full_name: user.value.user_metadata?.full_name,
		email: user.value.email,
		bio: user.value.user_metadata?.bio,
		password: '',
		repeatPassword: '',
	})

	const schema = z.object({
		full_name: z.string().min(2).optional(),
		email: z.string().email(),
		bio: z.string().max(255).optional(),
		password: z.string().min(8).optional().or(z.literal('')),
		repeatPassword: z.string().min(8).optional().or(z.literal('')),
	}).refine(({ password, repeatPassword }) => password === repeatPassword,
		{
			message: 'Passwords must match',
			path: ['password'],
		}
	)

	async function updateProfile() {
		const { error } = await supabase
			.auth
			.updateUser({
				email: state.value.email,
				password: state.value.password || undefined,
				data: {
					full_name: state.value.full_name || undefined,
					bio: state.value.bio || undefined,
				}
			})

		if (error) {
			toastError({
				title: 'Profile update failed'
				, description: error.message
			})
			return
		}

		toastSuccess({ title: 'Profile updated' })
	}

	return { state, schema, updateProfile }
}
</script>
