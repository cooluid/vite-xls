<script setup lang="ts">
import { useXlsxStore } from "@/stores/xlsxStore";
import { processAndExportData } from "@/utils/excelUtil";

import { ElMessage } from "element-plus";
import { computed } from "vue";
import FileSelect from "../FileList/FileSelect.vue";
import { compressData } from "@/utils/excelUtil";

const store = useXlsxStore();
const exportPath = computed({
	get: () => store.exportPath || "",
	set: (value) => store.setPath(1, value)
});

const exportFormat = computed({
	get: () => store.exportFormat,
	set: (value: string) => store.setExportFormat(value)
});

const handleExport = async (type: number) => {
	if (!exportPath.value) {
		ElMessage.warning("请选择导出路径");
		return;
	}

	if (type === 2) {
		await compressData();
		return;
	}

	try {
		await processAndExportData(type, exportPath.value);
		ElMessage.success("导出成功");
	} catch (error) {
		ElMessage.error((error as Error).message);
	}
};
</script>

<template>
	<el-card class="card-container">

		<FileSelect v-model="exportPath" :type="1" />

		<div class="set-info">
			<el-radio-group v-model="exportFormat">
				<el-radio :value="'JSON'" label="导出JSON" />
				<el-radio :value="'AMF'" label="序列化压缩" />
			</el-radio-group>

			<div class="grp-button">
				<template v-if="exportFormat === 'JSON'">
					<el-button class="summit-button" type="primary" @click="handleExport(0)">
						导出选中
					</el-button>
					<el-button class="summit-button" type="warning" @click="handleExport(1)">
						导出全部
					</el-button>
				</template>
				<template v-else>
					<el-button class="summit-button" type="primary" @click="handleExport(2)">
						开始压缩
					</el-button>
				</template>
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

.set-info {
	margin-top: 10px;
	display: flex;
	flex-direction: column;
}

.el-radio-group {
	display: flex;
	justify-content: flex-start;
	align-items: center;
}

.grp-button {
	display: flex;
	justify-content: center;
	align-items: center;
}

.summit-button {
	width: 150px;
}
</style>
