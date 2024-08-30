<script setup lang="ts">
import { useXlsxStore } from "@/stores/xlsxStore";
import { processAndExportData } from "@/utils/excelUtil";

import { showNotification } from "@/utils/notification";
import { ref } from "vue";
import FileSelect from "../FileList/FileSelect.vue";

const store = useXlsxStore();
const exportPath = ref<string>(store.exportPath);

const handleExport = async (type: number) => {
	if (!exportPath.value) {
		showNotification("请选择导出路径", "warning");
		return;
	}

	try {
		await processAndExportData(type, exportPath.value);
		showNotification("导出成功", "success");
	} catch (error) {
		showNotification((error as Error).message, "error");
	}
};
</script>

<template>
	<el-card class="card-container">

		<FileSelect v-model="exportPath" :type="1" />

		<div class="set-info">
			<div class="switch">
				<el-switch v-model="store.exportType" active-text="导出JSON" />
				<el-switch v-model="store.exportType" active-text="导出AMF" />
			</div>

			<div class="grp-button">
				<el-button class="summit-button" type="primary" @click="handleExport(0)">
					导出选中
				</el-button>
				<el-button class="summit-button" type="warning" @click="handleExport(1)">
					导出全部
				</el-button>
			</div>
		</div>
	</el-card>
</template>

<style scoped>
.card-container {
	height: 100%;
	display: flex;
	flex-direction: column;
}

.switch {
	display: flex;
	gap: 20px;
}

.set-info {
	padding-top: 10px;
	display: flex;
	flex-direction: column;
	gap: 5px;
}

.grp-button {
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 80px;
}

.summit-button {
	width: 150px;
}
</style>
