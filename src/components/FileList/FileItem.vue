<script lang="ts" setup>
import { type XlsItem } from "@/stores/xlsxStore";
import { computed } from "vue";

const props = defineProps<{
	modelValue: XlsItem;
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: XlsItem): void;
}>();

const isSelected = computed({
	get: () => props.modelValue.isSelected,
	set: (value) => {
		const updatedItem = { ...props.modelValue, isSelected: value };
		emit("update:modelValue", updatedItem);
	},
});
</script>

<template>
	<div :class="[{ selected: modelValue.isSelected }, 'list-item']">
		<el-checkbox v-model="isSelected" class="full-width">
			<slot></slot>
		</el-checkbox>
	</div>
</template>

<style scoped>
.list-item {
	width: 98%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	font-size: 16px;
	text-align: left;
	border-bottom: 1px dashed #000;
	transition: background-color 0.2s ease;
	cursor: pointer;
	box-sizing: border-box;
}

.list-item:hover {
	background-color: #f5f5f5;
}

.list-item.selected {
	background-color: #c6e2ff;
}

.full-width {
	width: 100%;
}
</style>
