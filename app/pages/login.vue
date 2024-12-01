<template>
	<UCard
		class="max-w-sm w-full bg-white/75 dark:bg-white/5 backdrop-blur">
		<UAuthForm :fields="fields" :schema="schema"
			:title="t('title')" :description="t('description')"
			:providers="<any>providers" align="top"
			icon="i-heroicons-lock-closed"
			:ui="{ base: 'text-center', footer: 'text-center' }"
			:submit-button="{ label: submitLabel, trailingIcon: 'i-heroicons-arrow-right-20-solid' }"
			@submit="login">

			<template #otp-hint>
				<UButton @click="resend" variant="ghost"
					:label="t('fields.otp.resend')" />
			</template>

			<template #footer>
				<i18n-t tag="p" keypath="footer">
					<template #terms>
						<NuxtLink to="/"
							class="text-primary font-medium">
							{{ t('terms_of_service') }}
						</NuxtLink>
					</template>
				</i18n-t>
			</template>
		</UAuthForm>
	</UCard>
</template>

<i18n lang="yaml">
zh-Hans:
  title: 欢迎
  description: 如果您没有账号，将自动创建您的账号。
  footer: 登录即表示您同意我们的{terms}。
  terms_of_service: 服务条款
  fields:
    email:
      label: 电子邮箱
      placeholder: 请输入您的邮箱
    otp:
      label: 验证码
      placeholder: 请输入您的验证码
      resend: 重新发送验证码
  validation:
    email: 无效的邮箱地址
    otp: 无效的验证码
  submit:
    send_email: 发送邮件
    login_with_otp: 登录
  send_email:
    error:
      title: 邮件发送失败
    success:
      title: 已发送验证码
      message: 已向{email}发送了验证码，请将其输入到验证码输入框中。
  login_with_otp:
    error:
      title: 登录失败
    success:
      title: 登录成功
      message: 您已成功登录

# English (en) Translation
en:
  title: Welcome
  description: If you don't have an account, one will be automatically created for you.
  footer: By logging in, you agree to our {terms}.
  terms_of_service: Terms of Service
  fields:
    email:
      label: Email
      placeholder: Please enter your email
    otp:
      label: Verification Code
      placeholder: Please enter your verification code
      resend: Resend Verification Code
  validation:
    email: Invalid email address
    otp: Invalid verification code
  submit:
    send_email: Send Email
    login_with_otp: Log In
  send_email:
    error:
      title: Email Sending Failed
    success:
      title: Verification Code Sent
      message: A verification code has been sent to {email}, please enter it in the verification code input field.
  login_with_otp:
    error:
      title: Login Failed
    success:
      title: Login Successful
      message: You have successfully logged in

# Arabic (ar) Translation
ar:
  title: أهلاً بك
  description: إذا لم يكن لديك حساب، سيتم إنشاء حساب تلقائيًا.
  footer: بتسجيل الدخول، فإنك توافق على {terms} الخاصة بنا.
  terms_of_service: شروط الخدمة
  fields:
    email:
      label: البريد الإلكتروني
      placeholder: يرجى إدخال بريدك الإلكتروني
    otp:
      label: رمز التحقق
      placeholder: يرجى إدخال رمز التحقق الخاص بك
      resend: إعادة إرسال رمز التحقق
  validation:
    email: عنوان بريد إلكتروني غير صالح
    otp: رمز التحقق غير صالح
  submit:
    send_email: إرسال البريد الإلكتروني
    login_with_otp: تسجيل الدخول
  send_email:
    error:
      title: فشل إرسال البريد الإلكتروني
    success:
      title: تم إرسال رمز التحقق
      message: تم إرسال رمز التحقق إلى {email}، يرجى إدخاله في حقل إدخال رمز التحقق.
  login_with_otp:
    error:
      title: فشل تسجيل الدخول
    success:
      title: تم تسجيل الدخول بنجاح
      message: لقد قمت بتسجيل الدخول بنجاح
</i18n>

<script setup lang="ts">
import { z } from 'zod'

definePageMeta({
	layout: 'auth',
})

const { t } = useI18n()
const config = useRuntimeConfig()

const supabase = useSupabaseClient()

const { toastError, toastSuccess } = useAppToast()

const fields = ref([
	{
		name: 'email',
		type: 'email',
		label: t('fields.email.label'),
		placeholder: t('fields.email.placeholder'),
	}
])

const schema = ref(z.object({
	email: z.string().email()
}))

const providers = useLoginProviders()

const loginStatus = ref('send')
const submitLabel = computed(() => {
	switch (loginStatus.value) {
		case 'send':
			return t('submit.send_email')
		case 'otp':
			return t('submit.login_with_otp')
	}
})
let resend: any

async function sendEmail(email: string, immediate = true) {
	async function send() {
		const { error } = await supabase.auth.signInWithOtp({
			email: email
		})

		if (error) {
			toastError(t('send_email.error.title'), error.message)
		} else {
			toastSuccess(
				t('send_email.success.title'),
				t('send_email.success.message', { email })
			)
		}

		return { error }
	}

	if (immediate) {
		var { error } = await send()
	}

	return {
		error,
		send
	}
}

async function login(data: any) {
	switch (loginStatus.value) {
		case 'send':
			await signInWithOtp()
			break
		case 'otp':
			await verifyOTP()
			break
	}

	async function signInWithOtp() {
		const { error, send } = await sendEmail(data.email)

		resend = send

		if (error) {
			return
		}

		fields.value.push(
			{
				name: 'otp',
				type: 'text',
				label: t('fields.otp.label'),
				placeholder: t('fields.otp.placeholder'),
			}
		)

		schema.value = z.object({
			email: z.string().email(),
			otp: z.string().length(6)
		})

		loginStatus.value = 'otp'
	}

	async function verifyOTP() {
		const { error } = await supabase.auth.verifyOtp({
			email: data.email,
			token: data.otp,
			type: 'email'
		})

		if (error) {
			toastError(t('login_with_otp.error.title'), error.message)
			return
		}

		toastSuccess(
			t('login_with_otp.success.title'),
			t('login_with_otp.success.message')
		)

		navigateTo('/home')

		loginStatus.value = 'success'
	}
}
</script>
