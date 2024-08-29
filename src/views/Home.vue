<template>
	<MainLayout>
		<div class="container">
			<el-row>
				<el-col :span="12" class="left-col">
					<div class="file-select-container">
						<FileSelect v-model="importPath" :type="0" />
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
import ExportSettings from "@/components/ExportSettings/ExportSettings.vue";
import FileList from "@/components/FileList/FileList.vue";
import MainLayout from "@/components/Layout/MainLayout.vue";
import { useXlsxStore } from "@/stores/xlsxStore";
import { computed, watchEffect } from "vue";
import FileSelect from "@/components/FileList/FileSelect.vue";
import { useLocalStorage } from "@/stores/xlsxStore";
import { ref } from "vue";

const store = useXlsxStore();
const importPath = ref<string>(store.xlsPath);
watchEffect(async () => {
	if (importPath.value) {
		await store.getXlsxList();
	}
});
computed({
	get: () => store.xlsPath,
	set: (value) => {
		importPath.value = value;
	},
});
</script>

<style scoped>
.container {
	width: 100%;
	height: 100%;
}

.el-row {
	height: 100%;
	background-color: beige;
}

.file-select-container {
	width: 98%;
}
</style>
