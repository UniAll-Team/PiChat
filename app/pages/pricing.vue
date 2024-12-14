<template>
	<div>
		<UPageHero align="center" :title="t('hero.title')"
			:description="t('hero.description')">
			<template #links>
				<UPricingToggle v-model="isYearly" class="w-48" />
			</template>
		</UPageHero>

		<UContainer>
			<UPricingGrid
				:class="isYearly ? 'lg:grid-cols' : 'lg:grid-cols-4'">
				<UPricingCard v-for="plan in plans" v-bind="plan" />
			</UPricingGrid>
			<UAlert icon="heroicons-exclamation-triangle"
				color="red" variant="outline" class="mt-8"
				:description="t('note')" />
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
    title: Choose a Plan, Preserve Precious Memories
    description: All accounts come with a free plan, but we recommend
      paying for your beautiful memories and treasured images.
  button:
    getStarted: Get Started
    currentPlan: Current Plan
  note: The index count refers to the number of images you can
    upload within a billing cycle. If you do not use up all your
    index counts in the current cycle, they will not carry over
    to the next cycle. For example, if you pay monthly and have
    100 index counts per month, this means you can upload up to
    100 images within that month. If you only upload 50 images,
    the remaining 50 index counts will not roll over to the next
    month. In the next month, you will still be able to upload
    100 images. If you choose to pay annually, the index counts
    apply to the entire year. This rule applies to all users to
    ensure transparency and predictability of the terms.
  pricing:
    cycle:
      month: /month
      year: /year
    features:
      storage: '{0} Storage'
      indexing: '{0} Image Indexing Times'
    free:
      description: Free to use, no credit card required.
    pro:
      description: Plan suitable for individual users with more
        storage and image indexing times.
    max:
      description: Plan suitable for most users with plenty of
        storage and image indexing times, to preserve your wonderful
        memories permanently.
    ultra:
      description: Plan suitable for photography enthusiasts or
        the whole family, with plenty of storage and image indexing
        times, to preserve every precious moment permanently.
  faqs:
    title: Frequently Asked Questions
    differentFromOthers:
      label: Why choose your product when there are already many
        online photo album applications on the market?
      content: Typical online photo albums do not allow you to
        search images using natural language but only based on
        image themes. PiCHat is different; it allows you to search
        images using natural language so that you can find the
        pictures you want.
    purchaseMethod:
      label: Why can't I purchase via the website?
      content: We are currently applying for stripe payment functionality,
        so it is temporarily unavailable for web purchase. If
        you want to buy now, please click the "Customer Service"
        button at the top of the page to contact us.
    planLimitations:
      label: Only 3 plans? I want more storage and features.
      content: We are currently in the early stages, and we will
        add more plans based on user needs and feedback. If you
        find that our plans do not meet your needs, please contact
        us.
    contactMethod:
      label: How can I contact you?
      content: Click the "Customer Service" button above to contact
        us in different ways.
    planSwitching:
      label: Can I switch to another plan?
      content: Certainly, you can switch to another plan at any
        time. Just do it in your account page.
    freeUsage:
      label: Can I use it for free?
      content: Yes, we have a free plan for you to use. However,
        we recommend paying for your beautiful memories and treasured
        images because memories and joy are priceless.
  toast:
    error: Payment failed, if you have any questions, please click
      the customer service on the left.

zh-Hans:
  hero:
    title: 选择一个方案，留住珍贵回忆
    description: 所有账户都有免费方案，但是我们推荐您为自己的美好回忆和珍贵图像付费。
  button:
    getStarted: 开始使用
    currentPlan: 当前计划
  note: 索引次数是指在一个结算周期内，您可以上传图片的数量。如果您在当前周期内未用完所有的索引次数，该次数不会结转到下一个周期。例如，若您按月付费，每月有100次索引次数，这意味着您在本月内可以上传最多100张图片。如果您仅上传了50张，剩余的50次索引次数不会累积到下一个月。在下一个月，您仍然可以上传100张图片。若您选择按年付费，索引次数则适用于整个年度。这一规则适用于所有用户，旨在确保条款的透明性和可预测性。
  pricing:
    cycle:
      month: /月
      year: /年
    features:
      storage: '{0}存储空间'
      indexing: '{0}次图片索引次数'
    free:
      description: 免费使用，无需信用卡。
    pro:
      description: 适合个人用户的方案，具有更多的存储空间和图片索引次数。
    max:
      description: 适合绝大多数用户的方案，具有大量的存储空间和图片索引次数，可以将您的美好回忆永久保存。
    ultra:
      description: 适合爱好摄影的用户或者全家人使用的方案，具有大量的存储空间和图片索引次数，可以将每一个珍贵的瞬间保存到永久。
  faqs:
    title: 常见问题
    differentFromOthers:
      label: 当市场上已经有大量的在线相册应用，还为什么要选择你们的产品？
      content: 一般的在线相册都不允许您使用自然语言搜索图片，而只能根据图片主题进行检索。PiCHat不同，它允许您使用自然语言搜索图片，这样您就可以找到您想要的图片。
    purchaseMethod:
      label: 为什么无法通过网页购买？
      content: 我们目前正在申请stripe付款功能，所以暂时无法通过网页购买。如果您现在就想购买，请点击页面顶部的"客服"按钮联系我们。
    planLimitations:
      label: 只有3个计划？我想要更多的存储空间和功能。
      content: 目前我们处于早期阶段，我们会根据用户的需求和反馈来增加更多的计划，如果当你发现我们的计划不满足您的需求，请联系我们。
    contactMethod:
      label: 我如何联系你们？
      content: 点击上方的"客服"按钮，就能使用不同的方式联系我们。
    planSwitching:
      label: 我能否切换到其他计划？
      content: 当然，您可以随时切换到其他计划。只需要在您的账户页面中进行操作即可。
    freeUsage:
      label: 我能免费使用吗？
      content: 是的，我们有免费的方案供您使用。但是我们推荐您为自己的美好回忆和珍贵图像付费，因为回忆和快乐是无价的。
  toast:
    error: 支付失败，如果您有任何疑问，请点击左侧客服。

ar:
  hero:
    title: اختر خطة، حافظ على الذكريات الثمينة
    description: جميع الحسابات تأتي بخطة مجانية، ولكن نوصي بالدفع
      من أجل ذكرياتك الجميلة وصورك الثمينة.
  button:
    getStarted: ابدأ
    currentPlan: الخطة الحالية
  note: عدد المرات التي يتم فيها الفهرسة يشير إلى عدد الصور التي
    يمكنك تحميلها في دورة تسوية واحدة. إذا لم تستهلك جميع مرات
    الفهرسة في الدورة الحالية, فلن يتم ترحيلها إلى الدورة القادمة.
    على سبيل المثال, إذا كنت تدفع شهريًا ولديك ١٠٠ مرة فهرسة شهريًا,
    فهذا يعني أنه يمكنك تحميل ما يصل إلى ١٠٠ صورة في هذا الشهر.
    إذا قمت بتحميل ٥٠ صورة فقط, فإن الـ ٥٠ مرة فهرسة المتبقية
    لن تتراكم إلى الشهر المقبل. في الشهر القادم, يمكنك تحميل ١٠٠
    صورة مرة أخرى. إذا اخترت الدفع سنويًا, فإن عدد مرات الفهرسة
    ينطبق على السنة كاملة. هذه القاعدة تنطبق على جميع المستخدمين
    وهي تهدف إلى ضمان شفافية الشروط وقابليتها للتنبؤ.
  pricing:
    cycle:
      month: /شهر
      year: /سنة
    features:
      storage: مساحة تخزين {0}
      indexing: '{0} عدد مرات فهرسة الصور'
    free:
      description: استخدام مجاني، لا حاجة لبطاقة ائتمان.
    pro:
      description: خطة مناسبة للمستخدمين الأفراد مع مساحة تخزين
        أكبر وعدد مرات فهرسة الصور.
    max:
      description: خطة مناسبة لمعظم المستخدمين مع الكثير من التخزين
        وعدد مرات فهرسة الصور، للاحتفاظ بذكرياتك الجميلة إلى الأبد.
    ultra:
      description: خطة مناسبة لمحبي التصوير أو لجميع أفراد العائلة،
        مع الكثير من التخزين وعدد مرات فهرسة الصور، للاحتفاظ بكل
        لحظة ثمينة إلى الأبد.
  faqs:
    title: الأسئلة الشائعة
    differentFromOthers:
      label: لماذا تختار منتجكم عندما يكون هناك العديد من تطبيقات
        ألبومات الصور عبر الإنترنت بالفعل في السوق؟
      content: لا تسمح ألبومات الصور عبر الإنترنت النموذجية بالبحث
        عن الصور باستخدام اللغة الطبيعية بل فقط بناءً على موضوعات
        الصور. بي آي كات مختلف؛ فهو يتيح لك البحث عن الصور باستخدام
        اللغة الطبيعية حتى تتمكن من العثور على الصور التي تريدها.
    purchaseMethod:
      label: لماذا لا أستطيع الشراء عبر الموقع؟
      content: نحن حالياً بصدد طلب وظيفة الدفع عبر stripe، لذلك
        فهي غير متاحة مؤقتاً للشراء عبر الإنترنت. إذا كنت تريد
        الشراء الآن، يرجى النقر على زر "خدمة العملاء" في أعلى
        الصفحة للتواصل معنا.
    planLimitations:
      label: ثلاث خطط فقط؟ أريد المزيد من التخزين والميزات.
      content: نحن حالياً في المراحل الأولى، وسنضيف المزيد من
        الخطط بناءً على احتياجات وتغذية المستخدمين الراجعة. إذا
        وجدت أن خططنا لا تفي باحتياجاتك، يرجى الاتصال بنا.
    contactMethod:
      label: كيف يمكنني الاتصال بكم؟
      content: انقر على زر "خدمة العملاء" أعلاه للاتصال بنا بطرق
        مختلفة.
    planSwitching:
      label: هل يمكنني التبديل إلى خطة أخرى؟
      content: بالتأكيد، يمكنك التبديل إلى خطة أخرى في أي وقت.
        فقط قم بذلك من خلال صفحة حسابك.
    freeUsage:
      label: هل يمكنني استخدامه مجاناً؟
      content: نعم، لدينا خطة مجانية لاستخدامك. مع ذلك، نوصي بالدفع
        من أجل ذكرياتك الجميلة وصورك الثمينة لأن الذكريات والفرح
        لا تقدر بثمن.
  toast:
    error: فشل الدفع، إذا كان لديك أي أسئلة، يرجى النقر على خدمة
      العملاء على اليسار.
</i18n>

<script setup lang="ts">
import type { ClickableButton } from '~/types'

const { t, n } = useI18n({ numberFormats })
const format = useLocaleBytes()

const user = useSupabaseUser()

const { createPaymentIntent } = useServerFunctions()

const { toastError } = useAppToast()
const userPlan = useUserPlan()

const isYearly = ref(false)
const displayedCycle = computed(() => isYearly.value ? 'year' : 'month')

console.debug('userPlan', userPlan.value)

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

const plans = computed(() => userPlans
	.filter(plan => !(isYearly.value && plan.name === 'free'))
	.map(plan => {
		const isCurrentPlan = userPlan.value.lookupKey === plan.lookupKeys[displayedCycle.value]

		return {
			...plan,
			ui: {
				features: {
					item: {
						label: '',
					},
				},
			},
			key: plan.name,
			title: _capitalize(plan.name),
			description: t(`pricing.${plan.name}.description`),
			align: 'top',
			price: plan.pricesStr[displayedCycle.value],
			cycle: isYearly.value ? t('pricing.cycle.year') : t('pricing.cycle.month'),
			features: [
				t('pricing.features.storage', [format(plan.storageQuota)]),
				t('pricing.features.indexing', [n(plan.indexingQuotas[displayedCycle.value], 'decimal')]),
			],
			button: {
				label: isCurrentPlan ? t('button.currentPlan') : t('button.getStarted'),
				variant: isCurrentPlan ? 'solid' : 'outline',
				disabled: isCurrentPlan,
				color: isCurrentPlan ? 'gray' : 'primary',
				async click() {
					if (!user.value) {
						await navigateTo('/login')
						return
					}

					const { url, error } = await createPaymentIntent(plan.lookupKeys[displayedCycle.value], location.origin)

					if (error) {
						console.error(error)
						toastError(
							t('toast.error'),
							error.message
						)
						return
					}

					await navigateTo(url)
				},
			} as ClickableButton,
		}
	})

)

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
</script>
