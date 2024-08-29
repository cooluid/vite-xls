<script setup lang="ts">
import { computed } from "vue";
import { useXlsxStore, XlsItem } from "@/stores/xlsxStore";
import FileItem from "./FileItem.vue";

const props = defineProps<{
	modelValue: XlsItem[];
}>();

const store = useXlsxStore();

const xlsFileItemList = computed({
	get: () => props.modelValue,
	set: (itemList: XlsItem[]) => store.xlsFileList = itemList,
});
</script>

<template>
	<div class="m-list">
		<FileItem v-for="(item, index) in xlsFileItemList" :key="item.name" v-model="xlsFileItemList[index]">
			{{ item.name }}
		</FileItem>
	</div>
</template>

<style scoped>
.m-list {
	width: 100%;
	flex-grow: 1;
	overflow-y: auto;
	margin-left: 5px;
}
</style>
