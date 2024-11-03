<template>
	<div>
		<div v-for="(itemGroup, updatedAt) in itemGroups" :key="updatedAt">
			<!-- 你的列表项内容 -->
			<h3 class="text-lg">{{ formatLocalDate(updatedAt, 'zhCN') }}</h3>
			<img v-for="item in itemGroup" :key="item.id" :src="item.url" alt="图片" class="w-24 h-24 sm:w-60 sm:h-auto" />
		</div>

		<InfiniteLoading @infinite="load">
			<template #spinner>
				<div>Loading...</div>
			</template>
			<template #complete>
				<div>没有更多数据了</div>
			</template>
			<template #error>
				<div>出错了</div>
			</template>
		</InfiniteLoading>
	</div>
</template>

<script lang="ts" setup>
import _ from 'lodash'
import type { Database } from '~/types/database'

const itemGroups = ref({})
const page = ref(1)
const pageSize = 10

const supabase = useSupabaseClient<Database>()
const { toastError } = useAppToast()

async function getImages() {
	const { data, error } = await supabase
		.from('image_details')
		.select('*')
		.order('id', { ascending: false })
		.range((page.value - 1) * pageSize, page.value * pageSize - 1)

	if (error) {
		throw error
	}

	return data
}

async function load(state?: any) {
	try {
		const data = await getImages()

		const publicUrls = data.map((item) => {
			const { data } = supabase
				.storage
				.from('images')
				.getPublicUrl(item.name, {
					// 缩略图
					// transform: {
					// 	width: 200,
					// 	height: 200,
					// }
				})
			return data.publicUrl
		})

		const newItemGroups = _(data)
			.zip(publicUrls)
			.map(([item, url]) => {
				return {
					...item,
					url,
				}
			})
			.groupBy('updated_at')
			.value()

		console.log('newItemGroups', newItemGroups)
		if (_.isEmpty(newItemGroups)) {
			state?.complete()
		} else {
			itemGroups.value = _.merge(itemGroups.value, newItemGroups)
			page.value++
			state?.loaded()
		}
	} catch (error) {
		toastError({
			title: '加载失败',
			description: error.message,
		})
	}
}
</script>
