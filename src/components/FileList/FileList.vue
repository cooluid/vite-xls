<script setup lang="ts">
import { computed } from "vue";
import { useXlsxStore, XlsItem } from "@/stores/xlsxStore";
import FileItem from "./FileItem.vue";
import { pinyin } from 'pinyin-pro';
const props = defineProps<{
	modelValue: XlsItem[];
}>();

const store = useXlsxStore();
const emit = defineEmits<{
	(e: "update:modelValue", value: XlsItem[]): void;
}>();

const xlsFileItemList = computed(() => {
	return props.modelValue.map(item => ({
		...item,
		firstLetter: getFirstLetter(item.name)
	})).sort((a, b) => a.firstLetter.localeCompare(b.firstLetter));
});

const updateXlsFileItemList = (changedItem: XlsItem): void => {
	const updatedList = store.xlsFileList.map((item: XlsItem) => {
		if (item.name === changedItem.name) {
			item.isSelected = changedItem.isSelected;
		}
		return item;
	});
	emit("update:modelValue", updatedList);
}

const getFirstLetter = (str: string) => pinyin(str, { pattern: 'first', toneType: 'none' }).charAt(0).toUpperCase();

</script>

<template>
	<div class="m-list">
		<FileItem v-for="(item, index) in xlsFileItemList" :key="index" :modelValue="item"
			@update:modelValue="(changedItem: XlsItem) => updateXlsFileItemList(changedItem)">
			<span class="first-letter">{{ item.firstLetter }}-</span>
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

.first-letter {
	text-align: center;
	font-weight: bold;
}
</style>
