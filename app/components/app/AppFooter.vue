<template>
	<UFooter>
		<template #top>
			<UFooterColumns :links="links">
				<template #right>
					<form @submit.prevent="onSubmit">
						<UFormGroup :label="t('newsletter.title')"
							:ui="{ container: 'mt-3' }">
							<UInput v-model="email" type="email"
								:placeholder="t('newsletter.title')"
								:ui="{ icon: { trailing: { pointer: '' } } }"
								required size="xl" autocomplete="off"
								class="max-w-sm" input-class="rounded-full">
								<template #trailing>
									<UButton type="submit" size="xs"
										color="primary"
										:label="loading ? t('newsletter.submitting') : t('newsletter.submit')"
										:loading="loading" />
								</template>
							</UInput>
						</UFormGroup>
					</form>
				</template>
			</UFooterColumns>
		</template>

		<template #left>
			<p class="text-gray-500 dark:text-gray-400 text-sm">
				Copyright © {{ new Date().getFullYear() }}. All
				rights reserved.
			</p>
		</template>

		<template #right>
			<UColorModeButton size="sm" />

			<UButton to="https://github.com/nuxt-ui-pro/saas"
				target="_blank" icon="i-simple-icons-github"
				aria-label="GitHub" color="gray" variant="ghost" />
		</template>
	</UFooter>
</template>

<i18n lang="yaml">
en:
  resources:
    resources: Resources
    help_center: Help center
    docs: Docs
    roadmap: Roadmap
    changelog: Changelog
  features:
    features: Features
    affiliates: Affiliates
    portal: Portal
    jobs: Jobs
    sponsors: Sponsors
  company:
    company: Company
    about: About
    pricing: Pricing
    careers: Careers
    blog: Blog
  newsletter:
    title: Subscribe to our newsletter
    submit: Subscribe
    submitting: Subscribing
  footer:
    copyright: Copyright © {year}. All rights reserved.

zh-Hans:
  resources:
    resources: 资源
    help_center: 帮助中心
    docs: 文档
    roadmap: 路线图
    changelog: 变更日志
  features:
    features: 特性
    affiliates: 会员
    portal: 门户
    jobs: 工作
    sponsors: 赞助商
  company:
    company: 公司
    about: 关于
    pricing: 价格
    careers: 职业
    blog: 博客
  newsletter:
    title: 订阅我们的新闻通讯
    submit: 订阅
    submitting: 订阅中
  footer:
    copyright: © {year} 版权所有

ar:
  resources:
    resources: الموارد
    help_center: مركز المساعدة
    docs: الأدلة
    roadmap: خريطة الطريق
    changelog: سجل التغييرات
  features:
    features: الميزات
    affiliates: الشركاء
    portal: البوابة
    jobs: الوظائف
    sponsors: الرعاة
  company:
    company: الشركة
    about: عن
    pricing: التسعير
    careers: الوظائف
    blog: المدونة
  newsletter:
    title: اشترك في النشرة الإخبارية لدينا
    submit: اشترك
    submitting: جار الاشتراك
  footer:
    copyright: حقوق الطبع والنشر © {year}. جميع الحقوق محفوظة.
</i18n>

<script setup lang="ts">
const { t } = useI18n()

const links = [{
	label: t('resources.resources'),
	children: [{
		label: t('resources.help_center')
	}, {
		label: t('resources.docs')
	}, {
		label: t('resources.roadmap')
	}, {
		label: t('resources.changelog')
	}]
}, {
	label: t('features.features'),
	children: [{
		label: t('features.affiliates')
	}, {
		label: t('features.portal')
	}, {
		label: t('features.jobs')
	}, {
		label: t('features.sponsors')
	}]
}, {
	label: t('company.company'),
	children: [{
		label: t('company.about')
	}, {
		label: t('company.pricing')
	}, {
		label: t('company.careers')
	}, {
		label: t('company.blog')
	}]
}]

const toast = useToast()

const email = ref('')
const loading = ref(false)

function onSubmit() {
	loading.value = true

	setTimeout(() => {
		toast.add({
			title: 'Subscribed!',
			description: 'You\'ve been subscribed to our newsletter.'
		})

		loading.value = false
	}, 1000)
}
</script>
