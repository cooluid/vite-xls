<template>
	<div class="file-select" @click="handleSelectClick">
		<el-input v-model="selPath" readonly placeholder="请选择"> </el-input>
		<el-button type="primary">选择</el-button>
	</div>
</template>

<script setup lang="ts">
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
const selPath = computed(() => props.modelValue || "");

const handleSelectClick = async () => {
	const [path] = await window.electronAPI.invoke("dialog:openDirectory");
	if (path) {
		emit("update:modelValue", path);
	}
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
