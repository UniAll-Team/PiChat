<template>
	<div>
		<div class="images-groups-container">
			<div v-for="(imageGroup, lastModifiedDate) in imageGroups" :key="lastModifiedDate" class="images-group-container">
				<!-- 你的列表项内容 -->
				<h3 class="">{{ lastModifiedDate }}</h3>
				<div class="images-container">
					<img v-for="image in imageGroup" :key="image.id" :src="image.url" alt="图片" class="" />
				</div>
			</div>
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

const imageGroups = ref({})
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
			.map(([image, url]) => {
				console.debug('image', image)

				const lastModifiedDate = formatUnixDate((image.user_metadata as any)?.lastModified, 'zhCN')

				console.debug('lastModifiedDate', lastModifiedDate)
				return {
					...image,
					lastModifiedDate,
					url,
				}
			})
			.groupBy('lastModifiedDate')
			.value()

		console.debug('newItemGroups', newItemGroups)
		if (_.isEmpty(newItemGroups)) {
			state?.complete()
		} else {
			imageGroups.value = _.merge(imageGroups.value, newItemGroups)
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
<style lang="scss" scoped>
.images-groups-container {
	display: grid;
	grid-template-rows: repeat(auto-fill, auto);
	gap: 1.5rem;
}

.images-group-container {
	display: grid;
	grid-template-rows: repeat(2, auto);
}

.images-container {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
	gap: 10px;
}

img {
	width: 100%;
	height: auto;
}

@media (width>=640px) {
	.images-container {
		grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
	}
}
</style>
