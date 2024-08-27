<script setup lang="ts">
import { computed } from "vue";
import { useXlsxStore } from "@/stores/xlsxStore";
import FileItem from "./FileItem.vue";

const store = useXlsxStore();
const xlsFileItemList = computed(() => store.xlsxList);
</script>

<template>
	<div class="m-list">
		<FileItem
			v-for="(item, index) in xlsFileItemList"
			:key="item.name"
			v-model="xlsFileItemList[index]"
		>
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
