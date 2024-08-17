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
import {ref} from "vue";

let pathValue = ref("");

const btnClick = async () => {
	let selectPath = await window.electronAPI.invoke("dialog:openDirectory", {
		data: "hello",
	});

	if (selectPath?.length > 0) {
		const fileNames = await window.electronAPI.invoke("get-files-in-directory", selectPath[0]);
		console.log("fileNames", fileNames);
	}

	pathValue.value = selectPath[0];
};
</script>
<style scoped></style>
