<template>
	<div>
		<UPageHero title="选择一个方案，留住珍贵回忆" align="center"
			description="所有账户都有免费方案，但是我们推荐您为自己的美好回忆和珍贵图像付费。">
			<template #links>
				<UPricingToggle v-model="isYearly" class="w-48" />
			</template>
		</UPageHero>

		<UContainer>
			<UPricingGrid class="lg:grid-cols-2">
				<UPricingCard v-for="(plan, index) in plans"
					:key="index" v-bind="plan"
					:price="isYearly ? plan.price.year : plan.price.month"
					:cycle="isYearly ? '/year' : '/month'"
					:features="isYearly ? plan.features.year : plan.features.month" />
			</UPricingGrid>
		</UContainer>

		<ULandingSection>
			<ULandingLogos>
				<UIcon v-for="icon in logos.icons" :key="icon"
					:name="icon"
					class="w-12 h-12 flex-shrink-0 text-gray-500 dark:text-gray-400" />
			</ULandingLogos>
		</ULandingSection>

		<ULandingSection title="常见问题">
			<ULandingFAQ :items="faqs" multiple
				class="max-w-4xl mx-auto" />
		</ULandingSection>
	</div>
</template>

<script setup lang="ts">
const logos = {
	title: "Trusted by the world's best",
	icons: [
		'i-simple-icons-amazonaws',
		'i-simple-icons-heroku',
		'i-simple-icons-netlify',
		'i-simple-icons-vercel',
		'i-simple-icons-cloudflare',
	],
}

const plans = [
	{
		title: '免费版',
		description: '免费使用，无需信用卡。',
		price: {
			month: '$0',
			year: '$0',
		},
		align: 'top',
		button: {
			label: 'Get Started',
			color: 'white',
		},
		features:
		{
			month: [
				'5 GB存储',
				'177 次上传/月',
			],
			year: [
				'5 GB存储',
				'177 次上传/月',
			],
		}
	},
	{
		title: '专业版',
		description: '专业版本的功能，具有高级功能和更多存储空间。',
		price: {
			month: '$19.7',
			year: '$199.7',
		},
		align: 'top',
		button: {
			label: 'Get Started',
			color: 'white',
		},
		features: {
			month: [
				'97 GB存储',
				'1777 次上传/月',
			],
			year: [
				'97 GB存储',
				'17777 次上传/年',
			],
		}
	},
	// {
	// 	title: '专业增强版',
	// 	description: '适用于较多图片的用户，具有更多的存储空间和更多的功能。',
	// 	price: {
	// 		month: '$39.7',
	// 		year: '$399.7',
	// 	},
	// 	align: 'top',
	// 	button: {
	// 		label: 'Get Started',
	// 		color: 'white',
	// 	},
	// 	features: {
	// 		month: [
	// 			'297 GB存储',
	// 			'17777 次上传/月',
	// 		],
	// 		year: [
	// 			'297 GB存储',
	// 			'177777 次上传/年',
	// 		],
	// 	}
	// },
]

const faqs = [
	{
		label: '当市场上已经有大量的在线相册应用，还为什么要选择你们的产品？',
		content:
			`一般的在线相册都不允许您使用自然语言搜索图片，而只能根据招聘主题进行检索。
			PiCHat不同，它允许您使用自然语言搜索图片，这样您就可以找到您想要的图片。`,
	},
	{
		label: '我能免费使用吗？',
		content: '是的，我们有免费的方案供您使用。但是我们推荐您为自己的美好回忆和珍贵图像付费，因为回忆和快乐是无价的。',
	},
	{
		label: '只有两个计划？我想要更多的存储空间和功能。',
		content:
			'目前我们处于早期阶段，我们会根据用户的需求和反馈来增加更多的计划，如果当你发现我们的计划不满足您的需求，请联系我们。',
	},
	{
		label: '我如何联系你们？',
		content: '点击上方的“客服”按钮，就能使用不同的方式联系我们。',
	},
	{
		label: '我能否切换到其他计划？',
		content: '当然，您可以随时切换到其他计划。只需要在您的账户页面中进行操作即可。',
	}
]

useSeoMeta({
	titleTemplate: '%s - Pricing',
	description: "Choose the plan that's right for you."
})

const isYearly = ref(false)
</script>
