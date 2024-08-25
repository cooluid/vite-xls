<script lang="ts" setup>
import {useXlsxOptionsStore, XlsItem} from "../stores/XlsxOptionsStore.ts";
import {ref} from "vue";

const props = defineProps({
	modelValue: {
		type: Object as () => XlsItem,
		required: true
	}
});

let isSelected = ref(props.modelValue.isSelected);
const emit = defineEmits(['update:modelValue']);
const store = useXlsxOptionsStore();

const itemClick = () => {
	let item = {...props.modelValue, isSelected: !props.modelValue.isSelected};
	emit("update:modelValue", item);
	store.updateSelectedXls(item.index, item.isSelected);
}

</script>

<template>
	<div :class="{selected: modelValue.isSelected}" class="list-item">
		<el-checkbox v-model="isSelected" style="width: 100%" @click="itemClick">
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
	border-bottom: 1px dashed rgb(0, 0, 0);
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

</style>