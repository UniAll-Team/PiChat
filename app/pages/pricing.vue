<template>
	<div>
		<UPageHero title="选择一个方案，留住珍贵回忆" align="center"
			description="所有账户都有免费方案，但是我们推荐您为自己的美好回忆和珍贵图像付费。">
			<template #links>
				<UPricingToggle v-model="isYearly" class="w-48" />
			</template>
		</UPageHero>

		<UContainer>
			<UPricingGrid class="lg:grid-cols">
				<UPricingCard v-for="(plan, index) in plans"
					:key="index" v-bind="plan"
					:price="isYearly ? plan.price.year : plan.price.month"
					:cycle="isYearly ? '/year' : '/month'"
					:features="isYearly ? plan.features.year : plan.features.month" />
			</UPricingGrid>
		</UContainer>

		<!-- <ULandingSection>
			<ULandingLogos>
				<UIcon v-for="icon in logos.icons" :key="icon"
					:name="icon"
					class="w-12 h-12 flex-shrink-0 text-gray-500 dark:text-gray-400" />
			</ULandingLogos>
		</ULandingSection> -->

		<ULandingSection :title="t('faqs.title')">
			<ULandingFAQ :items="faqs" multiple
				class="max-w-4xl mx-auto" />
		</ULandingSection>
	</div>
</template>

<i18n lang="yaml">
en:
  hero:
    title: 'Choose a Plan, Preserve Precious Memories'
    description: 'All accounts have a free option, but we recommend investing in your beautiful memories and cherished images.'
  pricing:
    free:
      title: Free Tier
      description: 'Free to use, no credit card required.'
      features:
        month: ['5 GB Storage', '177 Uploads/Month']
        year: ['5 GB Storage', '177 Uploads/Month']
    professional:
      title: 'Professional'
      description: 'Professional features with advanced capabilities and more storage space.'
      features:
        month: ['97 GB Storage', '1,777 Uploads/Month']
        year: ['97 GB Storage', '17,777 Uploads/Year']
    enhanced:
      title: 'Professional Enhanced'
      description: 'For users with more images, offering more storage space and additional features.'
      features:
        month: ['297 GB Storage', '17,777 Uploads/Month']
        year: ['297 GB Storage', '177,777 Uploads/Year']
  faqs:
    title: 'Frequently Asked Questions'
    differentFromOthers:
      label: 'Why choose us in a market with many online album apps?'
      content: 'Most online albums only allow searching by image themes, but PiCHat enables natural language image search, helping you find exactly what you want.'
    purchaseMethod:
      label: "Why can't I purchase through the web?"
      content: 'We are currently applying for Stripe payment functionality, so web purchases are temporarily unavailable. If you want to purchase now, please click the "Customer Service" button at the top of the page to contact us.'
    planLimitations:
      label: 'Only 3 plans? I want more storage and features.'
      content: 'We are in an early stage and will add more plans based on user needs and feedback. If our current plans do not meet your requirements, please contact us.'
    contactMethod:
      label: 'How can I contact you?'
      content: 'Click the "Customer Service" button above to reach us through various channels.'
    planSwitching:
      label: 'Can I switch to another plan?'
      content: 'Absolutely! You can switch plans anytime by simply operating in your account page.'
    freeUsage:
      label: 'Can I use it for free?'
      content: 'Yes, we offer a free plan for your use. However, we recommend investing in your beautiful memories and precious images, because memories and happiness are priceless.'

zh-Hans:
  hero:
    title: '选择一个方案，留住珍贵回忆'
    description: '所有账户都有免费方案，但是我们推荐您为自己的美好回忆和珍贵图像付费。'
  pricing:
    free:
      title: '免费版'
      description: '免费使用，无需信用卡。'
      features:
        month: ['5 GB存储', '177 次上传/月']
        year: ['5 GB存储', '177 次上传/月']
    professional:
      title: '专业版'
      description: '专业版本的功能，具有高级功能和更多存储空间。'
      features:
        month: ['97 GB存储', '1777 次上传/月']
        year: ['97 GB存储', '17777 次上传/年']
    enhanced:
      title: '专业增强版'
      description: '适用于较多图片的用户，具有更多的存储空间和更多的功能。'
      features:
        month: ['297 GB存储', '17777 次上传/月']
        year: ['297 GB存储', '177777 次上传/年']
  faqs:
    title: '常见问题'
    differentFromOthers:
      label: '当市场上已经有大量的在线相册应用，还为什么要选择你们的产品？'
      content: '一般的在线相册都不允许您使用自然语言搜索图片，而只能根据图片主题进行检索。PiCHat不同，它允许您使用自然语言搜索图片，这样您就可以找到您想要的图片。'
    purchaseMethod:
      label: '为什么无法通过网页购买？'
      content: '我们目前正在申请stripe付款功能，所以暂时无法通过网页购买。如果您现在就想购买，请点击页面顶部的"客服"按钮联系我们。'
    planLimitations:
      label: '只有3个计划？我想要更多的存储空间和功能。'
      content: '目前我们处于早期阶段，我们会根据用户的需求和反馈来增加更多的计划，如果当你发现我们的计划不满足您的需求，请联系我们。'
    contactMethod:
      label: '我如何联系你们？'
      content: '点击上方的"客服"按钮，就能使用不同的方式联系我们。'
    planSwitching:
      label: '我能否切换到其他计划？'
      content: '当然，您可以随时切换到其他计划。只需要在您的账户页面中进行操作即可。'
    freeUsage:
      label: '我能免费使用吗？'
      content: '是的，我们有免费的方案供您使用。但是我们推荐您为自己的美好回忆和珍贵图像付费，因为回忆和快乐是无价的。'

ar:
  hero:
    title: 'اختر خطة، واحتفظ بالذكريات الثمينة'
    description: 'جميع الحسابات لديها خيار مجاني، لكننا نوصي باستثمار ذكرياتك الجميلة وصورك الثمينة.'
  pricing:
    free:
      title: 'الخطة المجانية'
      description: 'مجاني للاستخدام، لا يتطلب بطاقة ائتمان.'
      features:
        month: ['٥ جيجابايت تخزين', '١٧٧ رفع/شهر']
        year: ['٥ جيجابايت تخزين', '١٧٧ رفع/سنة']
    professional:
      title: 'الخطة المهنية'
      description: 'مميزات احترافية مع قدرات متقدمة ومساحة تخزين أكبر.'
      features:
        month: ['٩٧ جيجابايت تخزين', '١٬٧٧٧ رفع/شهر']
        year: ['٩٧ جيجابايت تخزين', '١٧٬٧٧٧ رفع/سنة']
    enhanced:
      title: 'الخطة المهنية المعززة'
      description: 'للمستخدمين بالمزيد من الصور، توفر مساحة تخزين أكبر وميزات إضافية.'
      features:
        month: ['٢٩٧ جيجابايت تخزين', '١٧٬٧٧٧ رفع/شهر']
        year: ['٢٩٧ جيجابايت تخزين', '١٧٧٬٧٧٧ رفع/سنة']
  faqs:
    title: 'الأسئلة الشائعة'
    differentFromOthers:
      label: 'لماذا تختارنا في سوق مليء بتطبيقات الألبومات عبر الإنترنت؟'
      content: 'معظم الألبومات عبر الإنترنت تسمح فقط بالبحث حسب مواضيع الصور، لكن PiCHat يمكنك من البحث عن الصور باللغة الطبيعية، مما يساعدك على العثور على ما تريده بالضبط.'
    purchaseMethod:
      label: 'لماذا لا يمكنني الشراء عبر الويب؟'
      content: 'نحن حاليًا نتقدم بطلب وظيفة الدفع عبر Stripe، لذلك المشتريات عبر الويب غير متاحة مؤقتًا. إذا كنت تريد الشراء الآن، يرجى النقر فوق زر "خدمة العملاء" في أعلى الصفحة للتواصل معنا.'
    planLimitations:
      label: 'فقط 3 خطط؟ أريد المزيد من مساحة التخزين والميزات.'
      content: 'نحن في مرحلة مبكرة وسنضيف المزيد من الخطط بناءً على احتياجات المستخدمين وردودهم. إذا لم تلبِ خططنا الحالية متطلباتك، فالرجاء التواصل معنا.'
    contactMethod:
      label: 'كيف يمكنني التواصل معكم؟'
      content: 'انقر فوق زر "خدمة العملاء" أعلاه للتواصل معنا من خلال قنوات مختلفة.'
    planSwitching:
      label: 'هل يمكنني التبديل إلى خطة أخرى؟'
      content: 'بالتأكيد! يمكنك التبديل بين الخطط في أي وقت من خلال التشغيل ببساطة في صفحة حسابك.'
    freeUsage:
      label: 'هل يمكنني استخدامه مجانًا؟'
      content: 'نعم، نقدم خطة مجانية للاستخدام. ومع ذلك، نوصي باستثمار ذكرياتك الجميلة وصورك الثمينة، لأن الذكريات والسعادة لا تقدر بثمن.'
</i18n>

<script setup lang="ts">
const { t } = useI18n()

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
		title: t('pricing.free.title'),
		description: t('pricing.free.description'),
		price: {
			month: '$0',
			year: '$0',
		},
		align: 'top',
		button: {
			label: t('getStarted'),
			color: 'white',
		},
		features:
		{
			month: [
				t('pricing.free.features.month[0]'),
				t('pricing.free.features.month[1]'),
			],
			year: [
				t('pricing.free.features.year[0]'),
				t('pricing.free.features.year[1]'),
			],
		}
	},
	{
		title: t('pricing.professional.title'),
		description: t('pricing.professional.description'),
		price: {
			month: '$19.7',
			year: '$199.7',
		},
		align: 'top',
		button: {
			label: t('getStarted'),
			color: 'white',
		},
		features: {
			month: [
				t('pricing.professional.features.month[0]'),
				t('pricing.professional.features.month[1]'),
			],
			year: [
				t('pricing.professional.features.year[0]'),
				t('pricing.professional.features.year[1]'),
			],
		}
	},
	{
		title: t('pricing.enhanced.title'),
		description: t('pricing.enhanced.description'),
		price: {
			month: '$39.7',
			year: '$399.7',
		},
		align: 'top',
		button: {
			label: t('getStarted'),
			color: 'white',
		},
		features: {
			month: [
				t('pricing.enhanced.features.month[0]'),
				t('pricing.enhanced.features.month[1]'),
			],
			year: [
				t('pricing.enhanced.features.year[0]'),
				t('pricing.enhanced.features.year[1]'),
			],
		}
	},
]

const faqs = [
	{
		label: t('faqs.differentFromOthers.label'),
		content: t('faqs.differentFromOthers.content'),
	},
	{
		label: t('faqs.purchaseMethod.label'),
		content: t('faqs.purchaseMethod.content'),
	},
	{
		label: t('faqs.planLimitations.label'),
		content: t('faqs.planLimitations.content'),
	},
	{
		label: t('faqs.contactMethod.label'),
		content: t('faqs.contactMethod.content'),
	},
	{
		label: t('faqs.planSwitching.label'),
		content: t('faqs.purchaseMethod.content'),
	},
	{
		label: t('faqs.freeUsage.label'),
		content: t('faqs.freeUsage.content'),
	},
]

const isYearly = ref(false)
</script>
