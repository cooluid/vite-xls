<template>
	<div class="container">
		<header class="m-title">
			<h1>表格转换工具</h1>
		</header>
		<el-row>
			<el-col :span="12" class="left-col">
				<div class="left-path-container" @click="handleImportClick">
					<el-input
						v-model="xlsPath"
						placeholder="请选择表格路径"
						readonly
						class="m-path-select1"
					/>
					<el-button type="primary" class="m-button">选择</el-button>
				</div>
				<div class="m-list">
					<XlsFileItem
						v-for="(item, index) in xlsFileItemList"
						:key="item.name"
						v-model="xlsFileItemList[index]"
					>
						{{ item.name }}
					</XlsFileItem>
				</div>
			</el-col>
			<el-col :span="12" class="right-col">
				<el-card class="card-container">
					<template #header>导出设置</template>
					<div class="m-path-select2">
						<el-input
							v-model="exportPath"
							placeholder="导出路径"
							style="width: 80%"
						/>
						<el-button type="primary" @click="handleExportPathClick">
							选择
						</el-button>
					</div>
					<div class="set-info">
						<div class="m-switch">
							<el-switch v-model="store.exportType" active-text="导出JSON" />
							<el-switch v-model="store.exportType" active-text="导出AMF" />
						</div>
						<div class="grp-button">
							<el-button
								class="summit-button"
								type="primary"
								@click="handleExport(0)"
							>
								导出选中
							</el-button>
							<el-button
								class="summit-button"
								type="warning"
								@click="handleExport(1)"
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
import { computed, watchEffect } from "vue";
import { ElNotification } from "element-plus";
import { useXlsxOptionsStore } from "../stores/XlsxOptionsStore";
import { processAndExportData } from "../utils/XlsxUtil";
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

const handleImportClick = () => store.setXlsPath(0);
const handleExportPathClick = () => store.setXlsPath(1);

const handleExport = async (type: number) => {
	if (!store.exportPath) {
		ElNotification({
			title: "提示",
			message: "请选择导出路径",
			type: "warning",
			duration: 2000,
		});
		return;
	}

	try {
		await processAndExportData(type, store.exportPath);
		ElNotification({
			title: "成功",
			message: "导出成功",
			type: "success",
			duration: 2000,
		});
	} catch (error) {
		ElNotification({
			title: "错误",
			message: (error as Error).message,
			type: "error",
			duration: 2000,
		});
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
	color: white;
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
	padding: 10px 0;
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
	margin: 0 20px;
}
</style>
