import {defineStore} from "pinia";

export const useFileStore = defineStore('file', {
	state: () => ({
		importPath: "",
		exportPath: "",
		fileList: ""
	}),

	actions: {
		setFileList(fileList: string) {
			this.fileList = fileList;
			localStorage.setItem("fileList", fileList);
		},
		getFileList() {
			this.fileList = localStorage.getItem("fileList") || "";
			return this.fileList;
		},
		setImportPath(importPath: string) {
			this.importPath = importPath;
			localStorage.setItem("names", importPath);
		},
		getImportPath() {
			this.importPath = localStorage.getItem("importPath") || "";
			return this.importPath;
		},

		setExportPath(exportPath: string) {
			this.exportPath = exportPath;
			localStorage.setItem("exportPath", exportPath);
		},

		getExportPath() {
			this.exportPath = localStorage.getItem("exportPath") || "";
			return this.exportPath;
		},

		clearAllNames() {
			this.fileList = "";
			this.importPath = "";
			this.exportPath = "";
			localStorage.clear();
			console.log("clearAllNames");
		}
	},
})