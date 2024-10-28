<template>
	<UCard class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
		<UAuthForm :fields="fields" :schema="schema" :providers="providers" align="top" title="Create an account"
			:ui="{ base: 'text-center', footer: 'text-center' }" :submit-button="{ label: 'Create account' }"
			@submit="signup">
			<template #description>
				Already have an account? <NuxtLink to="/login" class="text-primary font-medium">Login</NuxtLink>.
			</template>

			<template #footer>
				By signing up, you agree to our <NuxtLink to="/" class="text-primary font-medium">Terms of Service</NuxtLink>.
			</template>
		</UAuthForm>
	</UCard>
</template>

<script setup lang="ts">
import { z } from 'zod'

const supabase = useSupabaseClient()

definePageMeta({
	layout: 'auth',
	title: 'Sign up',
})

const toast = useToast()

const fields = [
	{
		name: 'name',
		type: 'text',
		label: 'Name',
		placeholder: 'Enter your name',
	},
	{
		name: 'email',
		type: 'email',
		label: 'Email',
		placeholder: 'Enter your email',
	},
	{
		name: 'password',
		label: 'Password',
		type: 'password',
		placeholder: 'Enter your password',
	},
]

const schema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z.string().min(1, { message: 'Password is required' }),
})

const providers = useProviders()

async function signup(data: any) {
	const { error } = await supabase.auth.signInWithPassword({
		email: data.email,
		password: data.password,
	})

	if (error) {
		toast.add({
			title: 'Signup Error',
			description: error.message,
			color: 'red',
		})
	} else {
		toast.add({
			title: 'Signup Successful',
			description: 'You have successfully logged in.',
			color: 'green',
		})

		await navigateTo('/docs')
	}
}
</script>
