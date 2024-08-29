<template>
	<div class="file-select" @click="handleSelectClick">
		<el-input v-model="modelValue" readonly placeholder="请选择"> </el-input>
		<el-button type="primary">选择</el-button>
	</div>
</template>

<script setup lang="ts">
import { useXlsxStore } from "@/stores/xlsxStore";
import { computed } from "vue";
const props = defineProps<{
	modelValue: string;
	type: number;
	label?: {
		type: String;
		default: "选择";
	};
}>();

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();
const modelValue = computed({
	get: () => props.modelValue || "",
	set: (value: string) => emit("update:modelValue", value),
});

const store = useXlsxStore();
const handleSelectClick = async () => {
	const path = await store.setXlsPath(props.type);
	modelValue.value = path;
};
</script>

<style scoped>
.file-select {
	padding: 5px;
	display: flex;
	align-items: flex-start;
	gap: 5px;
}

.el-input {
	flex: 1;
}

.el-button {
	flex-shrink: 0;
}
</style>
