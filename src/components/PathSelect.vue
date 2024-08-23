<template>
	<div class="container">
		<div class="m-title">
			<div>表格转换工具</div>
		</div>
		<el-row>
			<el-col :span="12" class="left-col">
				<div class="left-path-container">
					<div class="m-path-select1">
						<el-input v-model="importPathValue" placeholder="请选择表格路径" readonly
						          @click="btnClickImport"></el-input>
					</div>
					<div class="m-button">
						<el-button type="primary" @click="btnClickImport">选择</el-button>
					</div>
				</div>

				<div class="m-list">
					<XlsFileItem v-for="(name, index) in xlsFileNames" :key="index" v-model="selectItems[index]"
					             :label-name="name">
						<div>{{ name }}</div>
					</XlsFileItem>
				</div>
			</el-col>

			<el-col :span="12" class="right-col">
				<el-card class="card-container">
					<div slot="header">导出设置</div>
					<div class="m-path-select2">
						<el-input v-model="exportPath" placeholder="导出路径"></el-input>
						<el-button style="margin-left: 5px" type="primary" @click="exportPathClick">选择</el-button>
					</div>

					<div class="set-info">
						<div class="m-switch">
							<el-switch class="m-switch-item" v-model="exportJson" active-text="导出JSON"></el-switch>
							<el-switch class="m-switch-item" v-model="exportAmf" active-text="导出AMF"></el-switch>
						</div>
						<div class="grp-button">
							<el-button class="summit-button" type="primary" @click="btnClickExportSel">导出选中</el-button>
							<el-button class="summit-button" type="warning" @click="btnClickExportAll">导出全部</el-button>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts">
import {ref} from "vue";
import XlsFileItem from "./XlsFileItem.vue";
import {useFileStore} from "../stores/FileStore.ts";

const fileStore = useFileStore();
let importPathValue = ref(fileStore.getImportPath() || "");
const exportPath = ref("");
let xlsFileNames = ref([] as string[]);

const exportJson = ref(0);
const exportAmf = ref(0);

const selectItems = ref(xlsFileNames.value.map(() => false));

const exportPathClick = async () => {
	const selectPath = await window.electronAPI.invoke("dialog:openDirectory", {
		data: "hello",
	});

	if (selectPath?.length > 0) {
		exportPath.value = selectPath[0];
		fileStore.setExportPath(exportPath.value);
	}
}

const btnClickExportSel = async () => {

};

const btnClickExportAll = async () => {

};

const btnClickImport = async () => {
	fileStore.clearAllNames();

	let importPath = await window.electronAPI.invoke("dialog:openDirectory", {
		data: "hello",
	});

	if (importPath?.length > 0) {
		const fileNames = await window.electronAPI.invoke("get-files-in-directory", importPath[0]);
		xlsFileNames = fileNames;
		fileStore.setFileList(JSON.stringify(fileNames));
		importPathValue.value = importPath[0];
	}
};
</script>
<style scoped>
.container {
	width: 100%;
	height: 100%;
}

.el-row {
	width: 100%;
	height: 100%;
}

.left-col {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	width: 100%;
	height: calc(100% - 50px);
	background-color: #eeeff3;
}

.m-title {
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: black;
	background-color: #337ecc;
}

.left-path-container {
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.right-col {
	display: flex;
	flex-direction: row;
	align-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
}

.card-container {
	width: 90%;
	margin: 0 auto;
}

.m-list {
	width: 100%;
	flex-grow: 1;
	overflow-y: auto;
	margin-left: 5px;
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

.set-info {
	margin-top: auto;
}

.m-path-select1 {
	width: 100%;
	padding-right: 3px;
}

.m-path-select2 {
	padding-top: 5px;
	width: 100%;
	display: flex;
	flex-direction: row;
	justify-content: space-between;
}

.grp-button {
	display: flex;
	justify-content: space-between;
	margin-left: 20px;
	margin-right: 20px;
}

</style>
