<template>
	<div class="m-title">
		<div class="m-title-text">表格转换工具</div>
	</div>
	<div class="container">
		<el-row>
			<el-col :span="12" class="col">
				<div class="m-left-section">
					<div class="m-path-select">
						<el-input @click="btnClick" v-model="pathValue" readonly placeholder="请选择表格路径"></el-input>
					</div>
					<div class="m-button">
						<el-button type="primary" @click="btnClick">选择</el-button>
					</div>
				</div>
				<div class="m-list">
					<XlsFileItem v-for="(name, index) in xlsFileNames" :key="index">
						<div>{{ name }}</div>
					</XlsFileItem>
				</div>
			</el-col>

			<el-col :span="12" class="col">
				<div class="m-right-section">
					<el-card class="card-container">
						<div slot="header">导出设置</div>
						<div class="m-path-select">
							<el-input v-model="exportPath" placeholder="导出路径"></el-input>
							<el-button class="m-button" type="primary" @click="exportPathClick">选择</el-button>
						</div>

						<div class="set-info">
							<div class="m-switch">
								<el-switch class="m-switch-item" v-model="exportJson" active-text="导出JSON"></el-switch>
								<el-switch class="m-switch-item" v-model="exportAmf" active-text="导出AMF"></el-switch>
							</div>
							<div class="grp-button">
								<el-button class="summit-button" type="primary">导出选中</el-button>
								<el-button class="summit-button" type="danger">导出全部</el-button>
							</div>
						</div>

					</el-card>
				</div>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import XlsFileItem from "./XlsFileItem.vue";
import {useFileStore} from "../stores/FileStore.ts";

let pathValue = ref("");
let xlsFileNames = ref([] as string[]);

const fileStore = useFileStore();
const filesNames = fileStore.getNames();

const exportJson = ref(0);
const exportAmf = ref(0);
const exportPath = ref("");
const theme = ref("");

if (filesNames?.length > 0) {
	xlsFileNames = JSON.parse(filesNames);
}

const exportPathClick = async () => {
	const selectPath = await window.electronAPI.invoke("dialog:openDirectory", {
		data: "hello",
	});

	if (selectPath?.length > 0) {
		exportPath.value = selectPath[0];
	}
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
<style scoped>
.container {
	width: 800px;
	height: 600px;
	border-radius: 3px;
	display: flex;
	justify-content: space-between;
}

.col {
	background-color: #dcdfe6;
	height: 450px;
}

.m-left-section {
	display: flex;
	flex-direction: row;
	width: 400px;
	margin: 5px;
}

.m-right-section {
	width: 400px;
	height: 600px;
}

.m-button {
	width: 20%;
}

.m-list {
	width: 400px;
	height: 400px;
}

.m-list-item {
	//margin-left: 5px;
	width: 100%;
	//display: inline-block;
	//border-bottom: 1px dashed #c0c4cc;
}

.m-title {
	border-radius: 10px 10px 0 0;
	background-color: #409eff;
	width: 800px;
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
}

.m-switch {
	display: flex;
	padding-top: 5px;
}

.m-switch-item {
	margin: 10px 10px 20px 10px;
}

.summit-button {
	width: 150px;
}

.card-container {
	height: 440px;
}

.set-info {
	margin-top: 200px;
}

.m-path-select {
	width: 370px;
	display: flex;
	justify-content: center;
}
</style>
