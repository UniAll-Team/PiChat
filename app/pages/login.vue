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
					<template v-for="term in terms"
						:key="term.placeholder" #[term.placeholder]>
						<a target="_blank" :href="term.href"
							class="text-primary">
							{{ term.label }}
						</a>
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
  footer: 登录即表示您同意我们的{terms}和{privacy}以及{disclaimer}。
  terms_and_conditions: 服务条款
  privacy_policy: 隐私政策
  disclaimer: 免责声明
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
      message: 您已成功登录。

en:
  title: Welcome
  description: If you do not have an account, your account will
    be automatically created.
  footer: By logging in, you agree to our {terms}, {privacy},
    and {disclaimer}.
  terms_and_conditions: Terms and Conditions
  privacy_policy: Privacy Policy
  disclaimer: Disclaimer
  fields:
    email:
      label: Email
      placeholder: Please enter your email
    otp:
      label: OTP
      placeholder: Please enter your OTP
      resend: Resend OTP
  validation:
    email: Invalid email address
    otp: Invalid OTP
  submit:
    send_email: Send Email
    login_with_otp: Login
  send_email:
    error:
      title: Email send failed
    success:
      title: OTP Sent
      message: An OTP has been sent to {email}, please enter it
        in the OTP input box.
  login_with_otp:
    error:
      title: Login Failed
    success:
      title: Login Successful
      message: You have successfully logged in.

ar:
  title: مرحبًا
  description: إذا لم يكن لديك حساب، سيتم إنشاء حساب لك تلقائيًا.
  footer: بتسجيل الدخول، فإنك توافق على {terms} و{privacy} و{disclaimer}.
  terms_and_conditions: الشروط والأحكام
  privacy_policy: سياسة الخصوصية
  disclaimer: إخلاء المسؤولية
  fields:
    email:
      label: البريد الإلكتروني
      placeholder: الرجاء إدخال بريدك الإلكتروني
    otp:
      label: الرمز السري
      placeholder: الرجاء إدخال الرمز السري
      resend: إعادة إرسال الرمز السري
  validation:
    email: عنوان بريد إلكتروني غير صالح
    otp: رمز سري غير صالح
  submit:
    send_email: إرسال البريد الإلكتروني
    login_with_otp: تسجيل الدخول
  send_email:
    error:
      title: فشل إرسال البريد الإلكتروني
    success:
      title: تم إرسال الرمز السري
      message: لقد تم إرسال رمز سري إلى {email}، يرجى إدخاله في
        خانة إدخال الرمز السري.
  login_with_otp:
    error:
      title: فشل تسجيل الدخول
    success:
      title: تم تسجيل الدخول بنجاح
      message: لقد قمت بتسجيل الدخول بنجاح.
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

const terms = [
	{
		placeholder: 'terms',
		label: t('terms_and_conditions'),
		href: '/terms/terms-and-conditions.html'
	},
	{
		placeholder: 'privacy',
		label: t('privacy_policy'),
		href: '/terms/privacy-policy.html'
	},
	{
		placeholder: 'disclaimer',
		label: t('disclaimer'),
		href: '/terms/disclaimer.html'
	}
]

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
const { submitLabel, resend, login } = useLoginEmail()

function useLoginEmail() {
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
		if (data.email === config.public.storeReview.email) {
			const { error } = await supabase.auth.signInWithPassword({
				email: data.email,
				password: config.public.storeReview.password
			})

			if (error) {
				toastError(t('login_with_otp.error.title'), error.message)
				return
			}

			toastSuccess('Login Successful', 'You have successfully logged in with the audit special account.')
			await navigateTo('/home')
			return
		}

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

			await navigateTo('/home')

			loginStatus.value = 'success'
		}
	}

	return {
		submitLabel,
		resend,
		login
	}
}


</script>
