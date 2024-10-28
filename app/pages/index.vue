<template>
	<div>
		<ULandingHero title="智能管理您的珍贵回忆" description="PiChat不仅仅是一个相册，更是您的智能回忆管家。通过自然语言搜索，轻松找到任何想要的照片瞬间。" :links="heroLinks">
			<div
				class="absolute inset-0 landing-grid z-[-1] [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]" />

			<template #headline>
				<UBadge variant="subtle" size="lg" class="relative rounded-full font-semibold">
					全新升级
					<UIcon name="i-heroicons-sparkles" class="ml-1 w-4 h-4" />
				</UBadge>
			</template>
		</ULandingHero>

		<ULandingSection class="!pt-0">
			<!-- 这里可以放置一个动态演示搜索的界面 -->
			<div class="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
				<img src="" alt="PiChat Interface Demo" class="w-full" />
				<div class="absolute top-4 left-1/2 transform -translate-x-1/2 w-2/3">
					<div class="bg-white dark:bg-gray-800 rounded-full shadow-lg p-3 flex items-center">
						<UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5 text-gray-400 mr-2" />
						<span class="text-gray-400">试试输入："去年冬天和朋友一起吃火锅的照片"</span>
					</div>
				</div>
			</div>
		</ULandingSection>

		<!-- 主要功能特点 -->
		<ULandingSection title="智能搜索，超越传统" description="告别繁琐的标签分类，使用自然语言就能找到您想要的每一张照片" align="left"
			:features="smartFeatures">
			<div class="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
				<img src="" alt="Natural Language Search Demo" class="w-full" />
			</div>
		</ULandingSection>

		<!-- 便捷功能 -->
		<ULandingSection title="简单易用，随心所欲" description="专注于为您提供最直观的照片管理体验" align="right" :features="easyFeatures">
			<div class="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800">
				<img src="" alt="Easy to Use Interface" class="w-full" />
			</div>
		</ULandingSection>

		<!-- 核心优势 -->
		<ULandingSection title="为什么选择 PiChat？" description="让照片管理变得更智能、更简单">
			<UPageGrid>
				<ULandingCard v-for="(feature, index) in features" :key="index" v-bind="feature" />
			</UPageGrid>
		</ULandingSection>

		<!-- 用户评价 -->
		<ULandingSection headline="用户评价" title="听听用户们怎么说" description="来自真实用户的使用体验">
			<UPageColumns class="xl:columns-4">
				<div v-for="(testimonial, index) in testimonials" :key="index" class="break-inside-avoid">
					<ULandingTestimonial v-bind="testimonial" class="bg-gray-100/50 dark:bg-gray-800/50" />
				</div>
			</UPageColumns>
		</ULandingSection>

		<!-- 行动召唤 -->
		<ULandingSection>
			<ULandingCTA title="开始智能管理您的照片" description="立即体验全新的照片管理方式" :links="[
				{
					label: '免费开始使用',
					size: 'xl',
					color: 'black',
					to: '/dashboard'
				}
			]" class="bg-gray-100/50 dark:bg-gray-800/50" />
		</ULandingSection>
	</div>
</template>

<script setup lang="ts">
const heroLinks = [
	{
		label: '立即开始',
		to: '/dashboard',
		size: 'xl',
		color: 'black',
		icon: 'i-heroicons-arrow-right-20-solid',
		trailing: true,
	},
	{
		label: '查看演示',
		icon: 'i-heroicons-play-circle',
		size: 'xl',
		color: 'gray',
		to: '/demo',
	},
]

const smartFeatures = [
	{
		name: '自然语言搜索',
		description: '使用日常语言描述场景，轻松找到对应照片',
		icon: 'i-heroicons-chat-bubble-left-right',
	},
	{
		name: '场景识别',
		description: '智能识别照片中的场景、活动和人物',
		icon: 'i-heroicons-camera',
	},
	{
		name: '时间智能推断',
		description: '根据描述自动推断时间段，更精准地定位照片',
		icon: 'i-heroicons-clock',
	},
]

const easyFeatures = [
	{
		name: '快速上传',
		description: '支持批量上传，自动组织整理',
		icon: 'i-heroicons-cloud-arrow-up',
	},
	{
		name: '智能相册',
		description: '自动创建主题相册，轻松回顾美好时光',
		icon: 'i-heroicons-photo-album',
	},
	{
		name: '跨平台访问',
		description: '随时随地查看和管理您的照片',
		icon: 'i-heroicons-device-phone-mobile',
	},
]

const features = [
	{
		title: '智能搜索',
		description: '使用自然语言描述即可快速找到想要的照片，告别繁琐的标签管理',
		icon: 'i-heroicons-magnifying-glass',
	},
	{
		title: '智能分类',
		description: '自动识别照片中的场景、人物和活动，智能组织您的照片库',
		icon: 'i-heroicons-squares-2x2',
	},
	{
		title: '安全存储',
		description: '采用高级加密技术，确保您的照片安全存储',
		icon: 'i-heroicons-shield-check',
	},
	{
		title: '快速上传',
		description: '支持多种上传方式，批量处理更高效',
		icon: 'i-heroicons-arrow-up-tray',
	},
	{
		title: '智能分享',
		description: '轻松与家人朋友分享照片和相册',
		icon: 'i-heroicons-share',
	},
	{
		title: '离线访问',
		description: '支持照片缓存，随时查看不受网络限制',
		icon: 'i-heroicons-cloud',
	},
]

const testimonials = [
	{
		quote:
			'使用PiChat后，再也不用担心找不到照片了。输入"去年圣诞节的家庭聚会"，相关照片立即呈现，太神奇了！',
		author: {
			name: '李小姐',
			description: '摄影爱好者',
			avatar: {
				src: '/api/placeholder/120/120',
				loading: 'lazy',
			},
		},
	},
	{
		quote: '作为一个经常拍照的人，PiChat帮我节省了大量整理照片的时间。智能分类功能特别好用。',
		author: {
			name: '张先生',
			description: '自由职业者',
			avatar: {
				src: '/api/placeholder/120/120',
				loading: 'lazy',
			},
		},
	},
	{
		quote: '界面简洁，使用方便，最重要的是可以用说话的方式搜索照片，这个功能太赞了！',
		author: {
			name: '王女士',
			description: '设计师',
			avatar: {
				src: '/api/placeholder/120/120',
				loading: 'lazy',
			},
		},
	},
	{
		quote: '智能搜索功能真的改变了我管理照片的方式，再也不用烦恼找不到特定场合的照片了。',
		author: {
			name: '刘先生',
			description: '企业经理',
			avatar: {
				src: '/api/placeholder/120/120',
				loading: 'lazy',
			},
		},
	},
]

// SEO Meta tags
useSeoMeta({
	titleTemplate: '',
	title: 'PiChat - 智能照片管理助手',
	ogTitle: 'PiChat - 智能照片管理助手',
	description: 'PiChat是一款智能照片管理工具，支持自然语言搜索，让您轻松找到任何想要的照片瞬间。',
	ogDescription: 'PiChat是一款智能照片管理工具，支持自然语言搜索，让您轻松找到任何想要的照片瞬间。',
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
