<template>
	<div>
		<ULandingHero :title="t('hero.title')"
			:description="t('hero.description')"
			:links="heroLinks">
			<div
				class="absolute inset-0 landing-grid z-[-1] [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" />

			<template #headline>
				<UBadge variant="subtle" size="lg"
					class="relative rounded-full font-semibold">
					{{ t('hero.badge') }}
					<UIcon name="i-heroicons-sparkles"
						class="ml-1 w-4 h-4" />
				</UBadge>
			</template>
		</ULandingHero>

		<ULandingSection class="!pt-0">
			<!-- 这里可以放置一个动态演示搜索的界面 -->
			<div
				class="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
				<img src="" alt="" class="w-full" />
				<div
					class="absolute top-4 left-1/2 transform -translate-x-1/2 w-2/3">
					<div
						class="bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 flex items-center">
						<UIcon name="i-heroicons-magnifying-glass"
							class="w-5 h-5 text-gray-400 mr-2" />
						<span class="text-gray-400">
							{{ t('search.placeholder') }}
						</span>
					</div>
				</div>
			</div>
		</ULandingSection>

		<!-- 主要功能特点 -->
		<ULandingSection :title="t('features.section1.title')"
			:description="t('features.section1.description')"
			align="left" :features="smartFeatures">
			<div
				class="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
				<img src="" alt="" class="w-full" />
			</div>
		</ULandingSection>

		<!-- 便捷功能 -->
		<ULandingSection :title="t('features.section2.title')"
			:description="t('features.section2.description')"
			align="right" :features="easyFeatures">
			<div
				class="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
				<img src="" alt="" class="w-full" />
			</div>
		</ULandingSection>

		<!-- 核心优势 -->
		<ULandingSection :title="t('features.section3.title')"
			:description="t('features.section3.description')">
			<UPageGrid>
				<ULandingCard v-for="(feature, index) in features"
					:key="index" v-bind="feature" />
			</UPageGrid>
		</ULandingSection>

		<!-- 用户评价 -->
		<ULandingSection :headline="t('testimonials.headline')"
			:title="t('testimonials.title')"
			:description="t('testimonials.description')">
			<UPageColumns class="xl:columns-4">
				<div v-for="(testimonial, index) in testimonials"
					:key="index" class="break-inside-avoid">
					<ULandingTestimonial v-bind="testimonial"
						class="bg-gray-100/50 dark:bg-gray-800/50" />
				</div>
			</UPageColumns>
		</ULandingSection>

		<!-- 行动召唤 -->
		<ULandingSection>
			<ULandingCTA :title="t('cta.title')"
				:description="t('cta.description')" :links="[
					{
						label: t('cta.button'),
						size: 'xl',
						color: 'black',
						to: '/home'
					}
				]" class="bg-gray-100/50 dark:bg-gray-800/50" />
		</ULandingSection>
	</div>
</template>

<i18n lang="yaml">
en:
  hero:
    title: 'Intelligent Management of Your Precious Memories'
    description: 'PiChat is not just a photo album, but your intelligent memory butler. Find any photo moment easily through natural language search.'
    badge: 'New Upgrade'
  search:
    placeholder: 'Try typing: "Photos from the steakhouse dinner with friends last winter"'
  features:
    section1:
      title: 'Smart Search Beyond Traditional'
      description: 'Say goodbye to tedious tag classification, find every photo you want using natural language'
    section2:
      title: 'Simple to Use, Freedom to Choose'
      description: 'Focused on providing you with the most intuitive photo management experience'
    section3:
      title: 'Why Choose PiChat?'
      description: 'Making photo management smarter and simpler'
    smart:
      feature1:
        name: 'Natural Language Search'
        description: 'Use everyday language to describe scenes and easily find corresponding photos'
      feature2:
        name: 'Scene Recognition'
        description: 'Intelligently identify scenes, activities, and people in photos'
      feature3:
        name: 'Smart Time Inference'
        description: 'Automatically infer time periods based on descriptions for more precise photo location'
    easy:
      feature1:
        name: 'Quick Upload'
        description: 'Support batch uploads with automatic organization'
      feature2:
        name: 'Smart Albums'
        description: 'Automatically create themed albums to easily revisit wonderful moments'
      feature3:
        name: 'Cross-platform Access'
        description: 'View and manage your photos anytime, anywhere'
    core:
      feature1:
        title: 'Smart Search'
        description: 'Quickly find desired photos using natural language descriptions, goodbye to tedious tag management'
      feature2:
        title: 'Smart Classification'
        description: 'Automatically recognize scenes, people, and activities in photos, intelligently organize your photo library'
      feature3:
        title: 'Secure Storage'
        description: 'Using advanced encryption technology to ensure your photos are stored safely'
      feature4:
        title: 'Quick Upload'
        description: 'Support multiple upload methods for more efficient batch processing'
      feature5:
        title: 'Smart Sharing'
        description: 'Easily share photos and albums with family and friends'
      feature6:
        title: 'Offline Access'
        description: 'Support photo caching for viewing anytime without network restrictions'
  testimonials:
    headline: 'User Reviews'
    title: 'Hear What Users Say'
    description: 'Experiences from real users'
    review1:
      quote: "After using PiChat, finding photos is a breeze. I typed 'Thanksgiving dinner with family last year' and the photos appeared instantly. It's magical!"
      author:
        name: 'Ms. Johnson'
        description: 'Photography Enthusiast'
    review2:
      quote: 'As someone who takes photos frequently, PiChat has saved me tons of time organizing photos. The smart classification feature is especially useful.'
      author:
        name: 'Mr. Smith'
        description: 'Freelancer'
    review3:
      quote: 'Clean interface, easy to use, and most importantly, you can search photos by speaking naturally. Found all my beach barbecue photos in seconds!'
      author:
        name: 'Mrs. Davis'
        description: 'Designer'
    review4:
      quote: 'The smart search feature has really changed how I manage photos. No more struggling to find photos from Sunday brunches or weekend getaways.'
      author:
        name: 'Mr. Wilson'
        description: 'Corporate Manager'
  cta:
    title: 'Start Managing Your Photos Intelligently'
    description: 'Experience the new way of photo management now'
    button: 'Start Using for Free'
  links:
    start: 'Get Started'
    demo: 'View Demo'

zh-Hans:
  hero:
    title: '智能管理您的珍贵回忆'
    description: 'PiChat不仅仅是一个相册，更是您的智能回忆管家。通过自然语言搜索，轻松找到任何想要的照片瞬间。'
    badge: '全新升级'
  search:
    placeholder: '试试输入："去年冬天和朋友一起吃火锅的照片"'
  features:
    section1:
      title: '智能搜索，超越传统'
      description: '告别繁琐的标签分类，使用自然语言就能找到您想要的每一张照片'
    section2:
      title: '简单易用，随心所欲'
      description: '专注于为您提供最直观的照片管理体验'
    section3:
      title: '为什么选择 PiChat？'
      description: '让照片管理变得更智能、更简单'
    smart:
      feature1:
        name: '自然语言搜索'
        description: '使用日常语言描述场景，轻松找到对应照片'
      feature2:
        name: '场景识别'
        description: '智能识别照片中的场景、活动和人物'
      feature3:
        name: '时间智能推断'
        description: '根据描述自动推断时间段，更精准地定位照片'
    easy:
      feature1:
        name: '快速上传'
        description: '支持批量上传，自动组织整理'
      feature2:
        name: '智能相册'
        description: '自动创建主题相册，轻松回顾美好时光'
      feature3:
        name: '跨平台访问'
        description: '随时随地查看和管理您的照片'
    core:
      feature1:
        title: '智能搜索'
        description: '使用自然语言描述即可快速找到想要的照片，告别繁琐的标签管理'
      feature2:
        title: '智能分类'
        description: '自动识别照片中的场景、人物和活动，智能组织您的照片库'
      feature3:
        title: '安全存储'
        description: '采用高级加密技术，确保您的照片安全存储'
      feature4:
        title: '快速上传'
        description: '支持多种上传方式，批量处理更高效'
      feature5:
        title: '智能分享'
        description: '轻松与家人朋友分享照片和相册'
      feature6:
        title: '离线访问'
        description: '支持照片缓存，随时查看不受网络限制'
  testimonials:
    headline: '用户评价'
    title: '听听用户们怎么说'
    description: '来自真实用户的使用体验'
    review1:
      quote: '使用PiChat后，再也不用担心找不到照片了。输入"去年圣诞节的家庭聚会"，相关照片立即呈现，太神奇了！'
      author:
        name: '李小姐'
        description: '摄影爱好者'
    review2:
      quote: '作为一个经常拍照的人，PiChat帮我节省了大量整理照片的时间。智能分类功能特别好用。'
      author:
        name: '张先生'
        description: '自由职业者'
    review3:
      quote: '界面简洁，使用方便，最重要的是可以用说话的方式搜索照片，这个功能太赞了！'
      author:
        name: '王女士'
        description: '设计师'
    review4:
      quote: '智能搜索功能真的改变了我管理照片的方式，再也不用烦恼找不到特定场合的照片了。'
      author:
        name: '刘先生'
        description: '企业经理'
  cta:
    title: '开始智能管理您的照片'
    description: '立即体验全新的照片管理方式'
    button: '免费开始使用'
  links:
    start: '立即开始'
    demo: '查看演示'

ar:
  hero:
    title: 'إدارة ذكية لذكرياتك الثمينة'
    description: 'PiChat ليس مجرد ألبوم صور، بل هو مساعدك الذكي للذكريات. اعثر على أي صورة بسهولة من خلال البحث باللغة الطبيعية.'
    badge: 'تحديث جديد'
  search:
    placeholder: 'جرب الكتابة: "صور تناول الشاورما مع الأصدقاء في الشتاء الماضي"'
  features:
    section1:
      title: 'بحث ذكي يتجاوز التقليدي'
      description: 'قل وداعاً للتصنيف المتعب للعلامات، واستخدم اللغة الطبيعية للعثور على كل صورة تريدها'
    section2:
      title: 'سهل الاستخدام، حرية الاختيار'
      description: 'نركز على تقديم أكثر تجارب إدارة الصور بديهية'
    section3:
      title: 'لماذا تختار PiChat؟'
      description: 'جعل إدارة الصور أكثر ذكاءً وبساطة'
    smart:
      feature1:
        name: 'البحث باللغة الطبيعية'
        description: 'استخدم لغة يومية لوصف المشاهد والعثور على الصور المطابقة بسهولة'
      feature2:
        name: 'التعرف على المشاهد'
        description: 'تحديد ذكي للمشاهد والأنشطة والأشخاص في الصور'
      feature3:
        name: 'استدلال ذكي للوقت'
        description: 'استنتاج تلقائي للفترات الزمنية بناءً على الوصف للعثور على الصور بدقة أكبر'
    easy:
      feature1:
        name: 'تحميل سريع'
        description: 'دعم التحميل الجماعي مع التنظيم التلقائي'
      feature2:
        name: 'ألبومات ذكية'
        description: 'إنشاء ألبومات موضوعية تلقائياً لاستعادة اللحظات الجميلة بسهولة'
      feature3:
        name: 'الوصول عبر المنصات'
        description: 'عرض وإدارة صورك في أي وقت وأي مكان'
    core:
      feature1:
        title: 'بحث ذكي'
        description: 'العثور السريع على الصور المطلوبة باستخدام وصف اللغة الطبيعية، وداعاً لإدارة العلامات المتعبة'
      feature2:
        title: 'تصنيف ذكي'
        description: 'التعرف التلقائي على المشاهد والأشخاص والأنشطة في الصور، تنظيم ذكي لمكتبة صورك'
      feature3:
        title: 'تخزين آمن'
        description: 'استخدام تقنية تشفير متقدمة لضمان تخزين صورك بأمان'
      feature4:
        title: 'تحميل سريع'
        description: 'دعم طرق تحميل متعددة لمعالجة دفعات أكثر كفاءة'
      feature5:
        title: 'مشاركة ذكية'
        description: 'مشاركة الصور والألبومات بسهولة مع العائلة والأصدقاء'
      feature6:
        title: 'الوصول دون اتصال'
        description: 'دعم تخزين الصور مؤقتاً للعرض في أي وقت دون قيود الشبكة'
  testimonials:
    headline: 'آراء المستخدمين'
    title: 'اسمع ما يقوله المستخدمون'
    description: 'تجارب من مستخدمين حقيقيين'
    review1:
      quote: "بعد استخدام PiChat، أصبح العثور على الصور سهلاً للغاية. كتبت 'عزومة المنسف مع العائلة في رمضان الماضي' وظهرت الصور فوراً. إنه أمر مذهل!"
      author:
        name: 'السيدة فاطمة'
        description: 'هاوية تصوير'
    review2:
      quote: 'كشخص يلتقط الصور بشكل متكرر، وفر لي PiChat الكثير من الوقت في تنظيم الصور. ميزة التصنيف الذكي مفيدة بشكل خاص.'
      author:
        name: 'السيد أحمد'
        description: 'عامل حر'
    review3:
      quote: 'واجهة نظيفة، سهلة الاستخدام، والأهم من ذلك، يمكنك البحث عن الصور بالتحدث بشكل طبيعي. وجدت كل صور جلسات القهوة على الشاطئ في ثوانٍ!'
      author:
        name: 'السيدة نور'
        description: 'مصممة'
    review4:
      quote: 'ميزة البحث الذكي غيرت حقاً طريقة إدارتي للصور. لم أعد أعاني من العثور على صور من جلسات العشاء العائلية أو رحلات نهاية الأسبوع.'
      author:
        name: 'السيد عمر'
        description: 'مدير شركة'
  cta:
    title: 'ابدأ في إدارة صورك بذكاء'
    description: 'جرب طريقة إدارة الصور الجديدة الآن'
    button: 'ابدأ مجاناً'
  links:
    start: 'ابدأ الآن'
    demo: 'شاهد العرض التوضيحي'
</i18n>

<script setup lang="ts">
const { t } = useI18n()

const heroLinks = [
	{
		label: t('links.start'),
		to: '/home',
		size: 'xl',
		color: 'black',
		icon: 'i-heroicons-arrow-right-20-solid',
		trailing: true,
	},
	{
		label: t('links.demo'),
		icon: 'i-heroicons-play-circle',
		size: 'xl',
		color: 'gray',
		to: '/demo',
	},
]

const smartFeatures = [
	{
		name: t('features.smart.feature1.name'),
		description: t('features.smart.feature1.description'),
		icon: 'i-heroicons-chat-bubble-left-right',
	},
	{
		name: t('features.smart.feature2.name'),
		description: t('features.smart.feature2.description'),
		icon: 'i-heroicons-camera',
	},
	{
		name: t('features.smart.feature3.name'),
		description: t('features.smart.feature3.description'),
		icon: 'i-heroicons-clock',
	},
]

const easyFeatures = [
	{
		name: t('features.easy.feature1.name'),
		description: t('features.easy.feature1.description'),
		icon: 'i-heroicons-cloud-arrow-up',
	},
	{
		name: t('features.easy.feature2.name'),
		description: t('features.easy.feature2.description'),
		icon: 'i-hugeicons-ai-brain-03',
	},
	{
		name: t('features.easy.feature3.name'),
		description: t('features.easy.feature3.description'),
		icon: 'i-heroicons-device-phone-mobile',
	},
]

const features = [
	{
		title: t('features.core.feature1.title'),
		description: t('features.core.feature1.description'),
		icon: 'i-heroicons-magnifying-glass',
	},
	{
		title: t('features.core.feature2.title'),
		description: t('features.core.feature2.description'),
		icon: 'i-heroicons-squares-2x2',
	},
	{
		title: t('features.core.feature3.title'),
		description: t('features.core.feature3.description'),
		icon: 'i-heroicons-shield-check',
	},
	{
		title: t('features.core.feature4.title'),
		description: t('features.core.feature4.description'),
		icon: 'i-heroicons-arrow-up-tray',
	},
	{
		title: t('features.core.feature5.title'),
		description: t('features.core.feature5.description'),
		icon: 'i-heroicons-share',
	},
	{
		title: t('features.core.feature6.title'),
		description: t('features.core.feature6.description'),
		icon: 'i-heroicons-cloud',
	},
]

const testimonials = [
	{
		quote:
			t('testimonials.review1.quote'),
		author: {
			name: t('testimonials.review1.author.name'),
			description: t('testimonials.review1.author.description'),
			avatar: {
				src: '',
				loading: 'lazy',
			},
		},
	},
	{
		quote: t('testimonials.review2.quote'),
		author: {
			name: t('testimonials.review2.author.name'),
			description: t('testimonials.review2.author.description'),
			avatar: {
				src: '',
				loading: 'lazy',
			},
		},
	},
	{
		quote: t('testimonials.review3.quote'),
		author: {
			name: t('testimonials.review3.author.name'),
			description: t('testimonials.review3.author.description'),
			avatar: {
				src: '',
				loading: 'lazy',
			},
		},
	},
	{
		quote: t('testimonials.review4.quote'),
		author: {
			name: t('testimonials.review4.author.name'),
			description: t('testimonials.review4.author.description'),
			avatar: {
				src: '',
				loading: 'lazy',
			},
		},
	},
]

// SEO Meta tags
useSeoMeta({
	titleTemplate: '%s - 智能照片管理助手',
	description: 'PiChat是一款智能照片管理工具，支持自然语言搜索，让您轻松找到任何想要的照片瞬间。',
})
</script>

<style scoped lang="scss">
.landing-grid {
	background-size: 100px 100px;
	background-image: linear-gradient(to right,
			rgb(var(--color-gray-200)) 1px,
			transparent 1px),
		linear-gradient(to bottom, rgb(var(--color-gray-200)) 1px, transparent 1px);
}

.dark {
	.landing-grid {
		background-image: linear-gradient(to right,
				rgb(var(--color-gray-800)) 1px,
				transparent 1px),
			linear-gradient(to bottom, rgb(var(--color-gray-800)) 1px, transparent 1px);
	}
}
</style>
