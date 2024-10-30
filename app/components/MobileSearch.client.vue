<!-- MobileSearch.vue -->
<template>
	<div class="mobile-search-container">
		<!-- 移动端搜索按钮 -->
		<UButton v-if="!isExpanded" icon="i-heroicons-magnifying-glass" color="gray" variant="outline" class="md:hidden"
			@click="expandSearch" />

		<!-- 展开的搜索框 -->
		<div v-else class="search-expanded md:hidden">
			<UInput v-model="searchText" placeholder="Search" icon="i-heroicons-magnifying-glass" color="gray"
				autocomplete="off" variant="outline" class="mobile-search-input" @keyup.enter="handleSearch" ref="searchInput"
				:autofocus="true">
				<template #trailing>
					<UButton color="gray" variant="link" icon="i-heroicons-x-mark" :padded="false" @click="collapseSearch" />
				</template>
			</UInput>
		</div>
	</div>
</template>

<script lang="ts" setup>
const isExpanded = ref(false)
const searchText = ref('')
const searchInput = ref()

const emit = defineEmits(['search'])

const expandSearch = () => {
	isExpanded.value = true
	// DOM 更新后自动聚焦不需要手动处理，因为添加了 autofocus 属性
}

const collapseSearch = () => {
	isExpanded.value = false
	searchText.value = ''
}

const handleSearch = () => {
	if (!searchText.value.trim()) return
	emit('search', searchText.value)
	collapseSearch()
}
</script>

<style lang="scss" scoped>
.mobile-search-container {
	position: relative;
}

.search-expanded {
	position: fixed;
	/* 改为 fixed 定位，确保覆盖整个导航栏 */
	top: 0;
	left: 0;
	right: 0;
	z-index: 50;
	background-color: white;
	/* 直接使用白色背景 */
	padding: 0.5rem;
}

@media (min-width: 768px) {
	.mobile-search-container {
		display: none;
	}
}
</style>
