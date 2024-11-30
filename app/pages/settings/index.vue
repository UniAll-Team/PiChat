<template>
	<UDashboardPanelContent class="pb-24">
		<UDashboardSection :title="t('language.title')"
			:description="t('language.description')">
			<template #links>
				<USelectMenu v-model="locale" :options="locales"
					option-attribute="name" value-attribute="code"
					color="gray" />
			</template>
		</UDashboardSection>

		<UDivider class="mb-4" />

		<UDashboardSection :title="t('theme.title')"
			:description="t('theme.description')">
			<template #links>
				<UColorModeSelect color="gray" />
			</template>
		</UDashboardSection>

		<UDivider class="mb-4" />

		<UForm :state :schema @submit="updateProfile">
			<UDashboardSection :title="t('profile.title')"
				:description="t('profile.description')">
				<template #links>
					<UButton type="submit" :label="t('profile.save')"
						color="black" />
				</template>

				<UFormGroup name="full_name"
					:label="t('profile.full_name.label')"
					:description="t('profile.full_name.description')"
					class="grid grid-cols-2 gap-2 items-center"
					:ui="{ container: '' }">
					<UInput v-model="state.full_name"
						autocomplete="off" icon="i-heroicons-user"
						size="md" />
				</UFormGroup>

				<UFormGroup name="email"
					:label="t('profile.email.label')"
					:description="t('profile.email.description')"
					required class="grid grid-cols-2 gap-2"
					:ui="{ container: '' }">
					<UInput v-model="state.email" type="email"
						autocomplete="off" icon="i-heroicons-envelope"
						size="md" />
				</UFormGroup>

				<UFormGroup name="bio"
					:label="t('profile.bio.label')"
					:description="t('profile.bio.description')"
					class="grid grid-cols-2 gap-2"
					:ui="{ container: '' }">
					<UTextarea v-model="state.bio" :rows="5"
						autoresize size="md" />
				</UFormGroup>

				<UFormGroup name="password"
					:label="t('profile.password.label')"
					:description="t('profile.password.description')"
					class="grid grid-cols-2 gap-2"
					:ui="{ container: '' }">
					<UInput id="password" v-model="state.password"
						type="password"
						:placeholder="t('profile.password.new')"
						size="md" />
					<UInput id="repeatPassword"
						v-model="state.repeatPassword" type="password"
						:placeholder="t('profile.password.repeat')"
						size="md" class="mt-2" />
				</UFormGroup>
			</UDashboardSection>
		</UForm>

		<UDivider class="mb-4" />

		<!-- <UDashboardSection :title="t('account.title')"
			:description="t('account.description')">
			<div>
				<UButton color="red" :label="t('account.delete')"
					size="md"
					@click="isDeleteAccountModalOpen = true" />
			</div>
		</UDashboardSection>

		<SettingsDeleteAccountModal
			v-model="isDeleteAccountModalOpen" /> -->
	</UDashboardPanelContent>
</template>

<i18n lang="yaml">
en:
  language:
    title: 'Language'
    description: 'Select your preferred language.'
  theme:
    title: 'Theme'
    description: 'Customize the look and feel of your dashboard.'
  profile:
    title: 'Profile'
    description: 'Manage your basic profile information.'
    save: 'Save changes'
    full_name:
      label: 'Full Name'
      description: 'Will appear on receipts, invoices, and other communication.'
    email:
      label: 'Email'
      description: 'Used to sign in, for email receipts and product updates.'
    bio:
      label: 'Bio'
      description: 'Brief description for your profile. URLs are hyperlinked.'
    password:
      label: 'Password'
      description: 'Confirm your current password before setting a new one.'
      new: 'New password'
      repeat: 'Repeat New password'
      mismatch: 'Passwords must match'
  account:
    title: 'Account'
    description: 'No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently.'
    delete: 'Delete account'
  toast:
    success: 'Profile updated'
    error:
      title: 'Profile update failed'

zh-Hans:
  language:
    title: '语言'
    description: '选择您偏好的语言。'
  theme:
    title: '主题'
    description: '自定义仪表盘的外观和风格。'
  profile:
    title: '个人资料'
    description: '管理您的基本个人信息。'
    save: '保存更改'
    full_name:
      label: '姓名'
      description: '将显示在收据、发票和其他通信中。'
    email:
      label: '电子邮箱'
      description: '用于登录、接收电子回执和产品更新。'
    bio:
      label: '简介'
      description: '您的个人简介。网址将自动变成超链接。'
    password:
      label: '密码'
      description: '设置新密码前请确认当前密码。'
      new: '新密码'
      repeat: '重复新密码'
      mismatch: '两次输入的密码必须相同'
  account:
    title: '账号'
    description: '不想继续使用我们的服务？您可以在这里删除账号。此操作不可撤销，所有与此账号相关的信息将被永久删除。'
    delete: '删除账号'
  toast:
    success: '个人资料已更新'
    error:
      title: '个人资料更新失败'

ar:
  language:
    title: 'اللغة'
    description: 'اختر لغتك المفضلة.'
  theme:
    title: 'المظهر'
    description: 'خصص مظهر وأسلوب لوحة التحكم الخاصة بك.'
  profile:
    title: 'الملف الشخصي'
    description: 'إدارة معلومات ملفك الشخصي الأساسية.'
    save: 'حفظ التغييرات'
    full_name:
      label: 'الاسم الكامل'
      description: 'سيظهر في الإيصالات والفواتير والمراسلات الأخرى.'
    email:
      label: 'البريد الإلكتروني'
      description: 'يستخدم لتسجيل الدخول وإيصالات البريد الإلكتروني وتحديثات المنتج.'
    bio:
      label: 'النبذة التعريفية'
      description: 'وصف موجز لملفك الشخصي. سيتم ربط عناوين URL تلقائياً.'
    password:
      label: 'كلمة المرور'
      description: 'قم بتأكيد كلمة المرور الحالية قبل تعيين كلمة مرور جديدة.'
      new: 'كلمة المرور الجديدة'
      repeat: 'تكرار كلمة المرور الجديدة'
      mismatch: 'يجب أن تتطابق كلمات المرور'
  account:
    title: 'الحساب'
    description: 'لم تعد ترغب في استخدام خدمتنا؟ يمكنك حذف حسابك هنا. هذا الإجراء لا رجعة فيه. سيتم حذف جميع المعلومات المتعلقة بهذا الحساب بشكل دائم.'
    delete: 'حذف الحساب'
  toast:
    success: 'تم تحديث الملف الشخصي'
    error:
      title: 'فشل تحديث الملف الشخصي'</i18n>

<script lang="ts" setup>
import { z } from 'zod'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

const { locale, locales, setLocale } = useI18n()
const { t } = useI18n()

watch(locale, async () => {
	console.debug('Switching locale to', locale.value)
	await setLocale(locale.value)
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
			message: t('profile.password.mismatch'),
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
			toastError(t('toast.error.title'), error.message)
			return
		}

		toastSuccess(t('toast.success'))
	}

	return { state, schema, updateProfile }
}
</script>
