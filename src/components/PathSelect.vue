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
		<XlsFileItem v-for="(name, index) in xlsFileName" :key="index" :index="index" :name="name"/>
	</div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import XlsFileItem from "./XlsFileItem.vue";

let pathValue = ref("");
let xlsFileName = ref("");

const btnClick = async () => {
	let selectPath = await window.electronAPI.invoke("dialog:openDirectory", {
		data: "hello",
	});

	if (selectPath?.length > 0) {
		const fileNames = await window.electronAPI.invoke("get-files-in-directory", selectPath[0]);
		xlsFileName = fileNames;
		console.log("fileNames", fileNames);

		pathValue.value = selectPath[0];
	}
};
</script>
<style scoped></style>
