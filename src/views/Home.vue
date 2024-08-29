<template>
	<MainLayout>
		<div class="container">
			<el-row>
				<el-col :span="12" class="left-col">
					<div class="file-select-container">
						<FileSelect v-model="importPath" :type="0" />
					</div>
					<FileList v-model="files" />
				</el-col>
				<el-col :span="12" class="right-col">
					<ExportSettings />
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

const store = useXlsxStore();
const files = computed({
	get: () => store.xlsFileList || [],
	set: (value) => store.xlsFileList = value,
});

const importPath = computed({
	get: () => store.xlsPath,
	set: (value) => store.setXlsPath(0, value),
});

watch(importPath, async () => {
	if (importPath.value) {
		files.value = await store.getXlsxList(importPath.value)
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
	height: 100%;
	background-color: beige;
}
</style>
