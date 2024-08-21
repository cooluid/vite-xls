<template>
	<div>
		<el-card title="导表工具" style="width: 600px">
					<el-input
							type="text"
							v-model="pathValue"
							:prefix-icon="Search"
							@click="btnClick"
							style="width: 480px"
							readonly
							placeholder="请选择表格配置路径"
					/>
			<el-button type="primary" @click="btnClick">选择路径...</el-button>
			<XlsFileItem v-for="(name, index) in xlsFileNames" :key="index" :index="index" :name="name"/>
		</el-card>
	</div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import XlsFileItem from "./XlsFileItem.vue";
import {useFileStore} from "../stores/FileStore.ts";
import {Search} from "@element-plus/icons-vue"

let pathValue = ref("");
let xlsFileNames = ref([] as string[]);

const fileStore = useFileStore();
const filesNames = fileStore.getNames();

if (filesNames?.length > 0) {
	xlsFileNames = JSON.parse(filesNames);
}

const btnClick = async () => {
	fileStore.clearAllNames();
	let selectPath = await window.electronAPI.invoke("dialog:openDirectory", {
		data: "hello",
	});

	if (selectPath?.length > 0) {
		const fileNames = await window.electronAPI.invoke("get-files-in-directory", selectPath[0]);
		xlsFileNames = fileNames;

		fileStore.setNames(JSON.stringify(fileNames));
		console.log("fileNames", fileNames);

		pathValue.value = selectPath[0];
	}
};
</script>
<style scoped></style>
