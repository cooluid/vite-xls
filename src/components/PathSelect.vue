<template>
	<div class="container">
		<div class="m-title">
			<div>表格转换工具</div>
		</div>
		<el-row>
			<el-col :span="12" class="left-col">
				<div class="left-path-container" @click="btnClickImport">
					<div class="m-path-select1">
						<el-input v-model="xlsPath" placeholder="请选择表格路径" readonly>
						</el-input>
					</div>

					<div class="m-button">
						<el-button type="primary">选择</el-button>
					</div>
				</div>

				<div class="m-list">
					<XlsFileItem
						v-for="(item, index) in xlsFileItemList"
						:key="index"
						v-model="xlsFileItemList[index]"
					>
						<div>{{ item.name }}</div>
					</XlsFileItem>
				</div>
			</el-col>

			<el-col :span="12" class="right-col">
				<el-card class="card-container">
					<div slot="header">导出设置</div>
					<div class="m-path-select2">
						<el-input
							v-model="exportPath"
							ref="inputBox"
							placeholder="导出路径"
							style="width: 80%"
						></el-input>
						<el-button type="primary" @click="btnClickExportPath"
							>选择</el-button
						>
					</div>

					<div class="set-info">
						<div class="m-switch">
							<el-switch
								v-model="store.exportType"
								active-text="导出JSON"
							></el-switch>
							<el-switch
								v-model="store.exportType"
								active-text="导出AMF"
							></el-switch>
						</div>
						<div class="grp-button">
							<el-button
								class="summit-button"
								type="primary"
								@click="btnExport(0)"
							>
								导出选中
							</el-button>
							<el-button
								class="summit-button"
								type="warning"
								@click="btnExport(1)"
							>
								导出全部
							</el-button>
						</div>
					</div>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>
<script setup lang="ts">
import * as elementPlus from "element-plus";
import { computed, ref, watchEffect } from "vue";
import { useXlsxOptionsStore } from "../stores/XlsxOptionsStore";
import { processAndExportData, showNotification } from "../utils/XlsxUtil";
import XlsFileItem from "./XlsFileItem.vue";

const store = useXlsxOptionsStore();
const xlsPath = computed(() => store.xlsPath);
const exportPath = computed(() => store.exportPath);
const xlsFileItemList = computed(() => store.xlsxList);

watchEffect(async () => {
	if (xlsPath.value) {
		await store.getXlsxList();
	}
});

const btnClickImport = async () => {
	await store.setXlsPath(0);
};

const btnClickExportPath = () => {
	store.setXlsPath(1);
};

const inputBox = ref<InstanceType<typeof elementPlus.ElInput> | null>(null);

const btnExport = async (type: number) => {
	const store = useXlsxOptionsStore();
	if (!store.exportPath) {
		showNotification("请选择导出路径", "error");
		return;
	}

	try {
		await processAndExportData(type, store.exportPath);
	} catch (e) {
		showNotification((e as Error).message, "error");
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
	padding-top: 5px;
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
	padding-top: 10px;
	padding-bottom: 10px;
}

.summit-button {
	width: 150px;
	transition: transform 0.05s ease-in-out;
}

.summit-button:hover {
	transform: scale(1.02);
}

.set-info {
	margin-top: auto;
}

.m-path-select1 {
	width: 90%;
	padding: 5px 10px;
}

.m-button {
	padding: 5px 10px;
}

.m-path-select2 {
	padding-top: 5px;
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
