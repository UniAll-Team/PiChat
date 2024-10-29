<template>
	<div>
		<div v-for="item in items" :key="item.id">
			<!-- 你的列表项内容 -->
			{{ item.name }}
		</div>

		<infinite-loading @infinite="load">
			<template #spinner>
				<div>Loading...</div>
			</template>
			<template #complete>
				<div>没有更多数据了</div>
			</template>
			<template #error>
				<div>出错了</div>
			</template>
		</infinite-loading>
	</div>
</template>

<script lang="ts" setup>
import type { Database, Tables } from '~/types/database';

const items = ref([])
const page = ref(1)
const pageSize = 10

async function load(state: any) {
	const supabase = useSupabaseClient<Database>()
	try {
		// 这里替换成你的实际API调用
		const { data, error }
			= await supabase
				.from('image_details')
				.select('*')
				.order('id', { ascending: false })
				.range((page.value - 1) * pageSize, page.value * pageSize - 1)

		if (error) {
			throw error
		}

		const newItems = data.map(imageDetail => imageDetail.name)

		if (newItems.length) {
			items.value.push(...data)
			page.value++
			state.loaded()
		} else {
			state.complete()
		}
	} catch (error) {
		state.error()
	}
}
</script>
