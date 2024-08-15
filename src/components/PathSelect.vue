<template>
	<div>
		<input
			type="text"
			v-model="pathValue"
			@click="btnClick"
			readonly
			placeholder="请选择表格配置路径"
		/>
		<button @click="btnClick">选择</button>
		<input
			type="file"
			ref="fileInput"
			style="display: none"
			@change="valueChange"
		/>
	</div>
</template>
<script setup lang="ts">
import { ref } from "vue";

const fileInput = ref<HTMLInputElement | null>(null);
const pathValue = ref("");

const btnClick = () => {
	if (fileInput.value) {
		fileInput.value.click();
	}
};

const valueChange = () => {
	console.log(fileInput.value?.files);
	pathValue.value = fileInput.value?.files?.[0].name + "";
};
</script>
<style scoped></style>
