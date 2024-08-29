import { ElNotification } from "element-plus";
import { defineStore } from "pinia";

export interface XlsItem {
	path: string;
	index: number;
	name: string;
	isSelected: boolean;
}

interface XlsxOptionsState {
	xlsPath: string;
	exportPath: string;
	exportType: number;
	exportDataType: number;
	xlsFileList: XlsItem[];
}

const useLocalStorage = (key: string) => ({
	get: () => localStorage.getItem(key) || "",
	set: (value: string) => localStorage.setItem(key, value),
});

export const useXlsxStore = defineStore("xlsxOptions", {
	state: (): XlsxOptionsState => ({
		xlsPath: useLocalStorage("importXlsPath").get(),
		exportPath: useLocalStorage("exportXlsPath").get(),
		exportType: 0,
		exportDataType: Number(useLocalStorage("exportDataType").get()) || 0,
		xlsFileList: [] as XlsItem[]
	}),
	actions: {
		setXlsPath(type: number, path: string): void {
			const storageKey = type === 0 ? "importXlsPath" : "exportXlsPath";
			const stateProp = type === 0 ? "xlsPath" : "exportPath";

			this[stateProp] = path;
			useLocalStorage(storageKey).set(path);
		},

		async getXlsxList(path: string): Promise<XlsItem[]> {
			if (!path) {
				return [];
			}

			try {
				const allFiles: string[] = await window.electronAPI.invoke("get-files-in-directory", path);
				return allFiles
					.filter(file => /\.(xlsx|xls)$/i.test(file))
					.map((name, index) => ({
						path: this.xlsPath,
						index,
						name,
						isSelected: false
					}));

			} catch (error) {
				console.error("获取 Excel 文件列表时出错:", error);
				return [];
			}
		},

		setExportDataType(exportDataType: number) {
			this.exportDataType = exportDataType;
			useLocalStorage("exportDataType").set(exportDataType.toString());
		},
	},
});