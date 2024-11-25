<template>
	<UCard
		class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
		<UAuthForm :fields="fields" :schema="schema"
			:providers="<any>providers" title="Welcome back"
			align="top" icon="i-heroicons-lock-closed"
			:ui="{ base: 'text-center', footer: 'text-center' }"
			:submit-button="{ trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
			@submit="login">
			<template #description>
				Don't have an account? <NuxtLink to="/signup"
					class="text-primary font-medium">Sign up
				</NuxtLink>.
			</template>

			<template #password-hint>
				<NuxtLink to="/" class="text-primary font-medium">
					Forgot password?</NuxtLink>
			</template>

			<template #footer>
				By signing in, you agree to our <NuxtLink to="/"
					class="text-primary font-medium">Terms of Service
				</NuxtLink>.
			</template>
		</UAuthForm>
	</UCard>
</template>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
	layout: 'auth',
})

const supabase = useSupabaseClient()

const { toastError, toastSuccess } = useAppToast()

useSeoMeta({
	titleTemplate: '%s - Login',
	description: 'Login to your account',
})

const fields = [
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

const providers = useLoginProviders()

async function login(data: any) {
	const { error } = await supabase.auth.signInWithPassword({
		email: data.email,
		password: data.password,
	})

	if (error) {
		toastError('Login Error', error.message)

		return
	}

	toastSuccess('Login Successful', 'You have successfully logged in.')

	await navigateTo('/home')
}
</script>
