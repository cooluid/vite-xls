<template>
	<MainLayout>
		<div class="container">
			<el-row>
				<el-col :span="12" class="l-col">
					<div class="file-select-container">
						<FileSelect v-model="importPath" :type="0" />
					</div>
					<FileList v-model="files" />
				</el-col>
				<el-col :span="12" class="r-col">
					<div class="log-container">
						<LogView :list="logList" />
					</div>
					<div class="export-settings-container">
						<ExportSettings />
					</div>
				</el-col>
			</el-row>
		</div>
	</MainLayout>
</template>

<script setup lang="ts">
import ExportSettings from "@/components/ExportSettings/ExportSettings.vue";
import FileList from "@/components/FileList/FileList.vue";
import FileSelect from "@/components/FileList/FileSelect.vue";
import MainLayout from "@/components/Layout/MainLayout.vue";
import { useXlsxStore } from "@/stores/xlsxStore";
import { computed, watch } from "vue";
import LogView from "@/components/Log/LogView.vue";
import { useLogStore } from "@/stores/logStore";

const store = useXlsxStore();
const logStore = useLogStore();
const files = computed({
	get: () => store.xlsFileList || [],
	set: (value) => store.xlsFileList = value,
});

const logList = computed(() => logStore.logList);

const importPath = computed({
	get: () => store.importPath || "",
	set: (value) => store.setPath(0, value),
});

watch(importPath, async () => {
	if (importPath.value) {
		files.value = await store.getXlsxList(importPath.value);
	}
}, { immediate: true });


</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
}

.el-row {
	padding: 10px;
	width: 100%;
	height: 100%;
	background-color: var(--el-bg-color);
	gap: 10px;
}

.l-col,
.r-col {
	height: 100%;
	display: flex;
	flex-direction: column;
	flex: 1;
}

.l-col {
	border: 1px solid var(--el-border-color-lighter);
	border-radius: 3px;
	background-color: var(--el-bg-color-overlay);
}

.r-col {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.log-container {
	position: relative;
	flex: 1;
	overflow-y: auto;
	padding: 10px;
	border-radius: 3px;
	background-color: var(--el-border-color-light);
}

.export-settings-container {
	flex: 0 0 auto;
}
</style>
