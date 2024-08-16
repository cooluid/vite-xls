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
	</div>
</template>
<script setup lang="ts">
import { ref } from "vue";

let pathValue = ref("");

const btnClick = async () => {
	console.log(`请求选择文件路径`);
	let template = await window.electronAPI.invoke("dialog:openDirectory", {
		data: "hello",
	});

	pathValue.value = template[0];
	console.log(`pathValue`, pathValue);
};
</script>
<style scoped></style>
