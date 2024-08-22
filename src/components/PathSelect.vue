<template>
	<div class="container">
		<div class="m-title">
			<div>表格转换工具</div>
		</div>
		<el-row>
			<el-col :span="12">
				<div class="left-container">
					<div class="m-path-select1">
						<el-input v-model="importPathValue" placeholder="请选择表格路径" readonly @click="btnClick"></el-input>
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

			<el-col :span="12" class="right-col">
				<el-card class="card-container">
					<div slot="header">导出设置</div>
					<div class="m-path-select2">
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

const exportPathClick = async () => {
	const selectPath = await window.electronAPI.invoke("dialog:openDirectory", {
		data: "hello",
	});

	if (selectPath?.length > 0) {
		exportPath.value = selectPath[0];
		fileStore.setExportPath(exportPath.value);
	}
}

const btnClick = async () => {
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

.m-title {
	height: 50px;
	display: flex;
	justify-content: center;
	align-items: center;
	color: white;
}

.left-container {
	height: 100%;
	display: flex;
}

.el-row {
	width: 100%;
	height: calc(100% - 50px); /* 减去标题的高度 */
}

.el-col {
	display: flex;
	//flex-direction: row;
	align-items: start;
	width: 100%;
	height: 100%;
	background-color: #79bbff;
}

.right-col{
	display: flex;
	flex-direction: row;
	align-items: center;
	width: 100%;
	height: 100%;
	background-color: #79bbff;
}

.m-list {
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

.m-button {

}

.m-path-select1 {
	width: 100%;
	padding-right: 3px;
}


</style>
