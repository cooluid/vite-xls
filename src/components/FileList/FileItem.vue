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
		<el-checkbox v-model="isSelected">
			<slot></slot>
		</el-checkbox>
	</div>
</template>

<style scoped>
.list-item {
	margin-right: 10px;
	border-bottom: 1px dashed var(--el-border-color-lighter);
}

.el-checkbox {
	width: 100%;
}
</style>
