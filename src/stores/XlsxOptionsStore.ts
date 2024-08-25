import {defineStore} from "pinia";
import {ElNotification} from "element-plus";

export interface XlsItem {
	index: number,
	name: string,
	isSelected: boolean,
}

export const useXlsxOptionsStore = defineStore("xlsxOptions", {
	state: () => ({
		xlsPath: "",
		exportPath: "",
		exportType: 0,
		exportDataType: 0,
		selectedXls: [] as XlsItem[],
		xlsxList: [] as XlsItem[],
	}),
	actions: {
		async setXlsPath(): Promise<string> {
			let xlsPath = await window.electronAPI.invoke("dialog:openDirectory");
			this.xlsPath = xlsPath[0];
			localStorage.setItem("xlsPath", this.xlsPath);

			return this.xlsPath;
		},
		async getXlsxList(): Promise<XlsItem[]> {
			try {
				let allFiles: string[] = await window.electronAPI.invoke("get-files-in-directory", this.xlsPath);
				let xlsxList = allFiles.filter(file => file.endsWith(".xlsx") || file.endsWith(".xls"));
				this.xlsxList = xlsxList.map((fileName, index) => ({index: index, name: fileName, isSelected: false}));
				return this.xlsxList;

			} catch (e) {
				console.log(e);
				ElNotification({
					title: "Error",
					message: "Failed to get files in directory",
					type: "error",
				});
				return [];
			}
		},
		updateSelectedXls(index: number, bool: boolean) {
			if (!this.selectedXls) {
				this.selectedXls = [];
			}

			let item = this.selectedXls.find(item => item.index === index);
			if (!item && bool) {
				this.selectedXls.push({index: index, name: this.xlsxList[index].name, isSelected: true});
			} else if (item && !bool) {
				this.selectedXls = this.selectedXls.filter(item => item.index !== index);
			}

			console.log(`this.selectedXls`, this.selectedXls)
		},
		getXlsPath() {
			this.xlsPath = localStorage.getItem("xlsPath") || "";
			return this.xlsPath;
		},
		setExportPath(exportPath: string) {
			this.exportPath = exportPath;
			localStorage.setItem("exportPath", exportPath);
		},
		getExportPath() {
			this.exportPath = localStorage.getItem("exportPath") || "";
			return this.exportPath;
		},
		setExportDataType(exportDataType: number) {
			this.exportDataType = exportDataType;
			localStorage.setItem("exportDataType", exportDataType.toString());
		},
		getExportDataType() {
			this.exportDataType = Number(localStorage.getItem("exportDataType")) || 0;
			return this.exportDataType;
		},
	}
})