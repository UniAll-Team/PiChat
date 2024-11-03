<template>
	<UDashboardPage>
		<UDashboardPanel grow>
			<UDashboardNavbar>
				<template #left>
					<!-- 在移动端搜索框聚焦时隐藏 -->
					<HomeDateRangePicker v-model="range" class="-ml-2.5" :class="{ 'hidden-on-mobile': isSearchFocused }" />
				</template>

				<template #right>
					<!-- 在移动端搜索框聚焦时隐藏 -->
					<UButton icon="i-heroicons-arrow-up-tray" color="gray" variant="outline" @click="openUploadModal"
						:class="{ 'hidden-on-mobile': isSearchFocused }">
						<span class="hidden-on-mobile">
							上传
						</span>
					</UButton>

					<UInput placeholder="Search" v-model="imageDescription" icon="i-heroicons-magnifying-glass" color="gray"
						autocomplete="off" variant="outline" :ui="{ icon: { trailing: { pointer: '' } } }"
						:class="{ 'mobile-search-focused': isSearchFocused, 'mobile-search-input': !isSearchFocused }"
						@focus="handleSearchFocus" @blur="handleSearchBlur" @keyup.enter="handleSearch">
						<template #trailing>
							<UButton v-show="imageDescription !== ''" class='hidden-on-mobile' color="gray" variant="link"
								icon="i-heroicons-x-mark" :padded="false" @click="imageDescription = ''" />
						</template>
					</UInput>
				</template>
			</UDashboardNavbar>

			<UDashboardPanelContent>
				<ImageGallery />
			</UDashboardPanelContent>
		</UDashboardPanel>
	</UDashboardPage>

	<UploadModal v-model="isUploadModalOpen" />
</template>

<script lang="ts" setup>
import { sub } from 'date-fns'
import type { Range } from '~/types/dashboard'

definePageMeta({
	layout: 'dashboard',
})

const imageDescription = ref('')
const isSearchFocused = ref(false)
const isUploadModalOpen = ref(false)

const range = ref<Range>({ start: sub(new Date(), { days: 14 }), end: new Date() })

const openUploadModal = () => {
	isUploadModalOpen.value = true
}

const handleSearchFocus = () => {
	isSearchFocused.value = true
}

const handleSearchBlur = () => {
	isSearchFocused.value = false
}

// 搜索处理函数
const handleSearch = async () => {
	if (!imageDescription.value.trim()) return

	try {
		// 这里添加您的搜索逻辑
		// 例如：
		// await searchImages(imageDescription.value)
		console.log('Searching for:', imageDescription.value)
	} catch (error) {
		console.error('Search failed:', error)
	}
}
</script>

<style lang="scss" scoped>
@media (width<=768px) {
	.mobile-search-focused {
		position: absolute;
		left: 1rem;
		right: 1rem;
		top: 1rem;
		z-index: 10;
	}

	.mobile-search-input {
		width: 4.2rem;
	}
}
</style>
