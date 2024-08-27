<template>
	<MainLayout>
		<div class="container">
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
					<FileList />
				</el-col>
				<el-col :span="12" class="right-col">
					<ExportSettings />
				</el-col>
			</el-row>
		</div>
	</MainLayout>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue";
import { useXlsxStore } from "@/stores/xlsxStore";
import Header from "@/components/Layout/Header.vue";
import FileList from "@/components/FileList/FileList.vue";
import ExportSettings from "@/components/ExportSettings/ExportSettings.vue";
import MainLayout from "@/components/Layout/MainLayout.vue";

const store = useXlsxStore();
const xlsPath = computed(() => store.xlsPath);

watchEffect(async () => {
	if (xlsPath.value) {
		await store.getXlsxList();
	}
});

const handleImportClick = () => store.setXlsPath(0);
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
