<script setup lang="ts">
import { computed } from "vue";
import { useXlsxStore } from "@/stores/xlsxStore";
import { processAndExportData } from "@/utils/xlsxUtil";
import { showNotification } from "@/utils/notification";

const store = useXlsxStore();
const exportPath = computed(() => store.exportPath);

const handleExportPathClick = () => store.setXlsPath(1);

const handleExport = async (type: number) => {
	if (!store.exportPath) {
		showNotification("请选择导出路径", "warning");
		return;
	}

	try {
		await processAndExportData(type, store.exportPath);
		showNotification("导出成功", "success");
	} catch (error) {
		showNotification((error as Error).message, "error");
	}
};
</script>

<template>
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
</template>

<style scoped>
/* ... 保留原有样式 ... */
</style>
