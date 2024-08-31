import { defineStore } from "pinia";
import { useLocalStorage } from "../utils/commonUtil";
import { StorageKey } from "../utils/commonUtil";

export interface XlsItem {
	path: string;
	index: number;
	name: string;
	isSelected: boolean;
	firstLetter: string
}

interface XlsxOptionsState {
	importPath: string;
	exportPath: string;
	exportFormat: string;
	exportDataType: number;
	xlsFileList: XlsItem[];
}

export const useXlsxStore = defineStore("xlsxOptions", {
	state: (): XlsxOptionsState => ({
		importPath: useLocalStorage(StorageKey.ImportPath).get(),
		exportPath: useLocalStorage(StorageKey.ExportPath).get(),
		exportFormat: useLocalStorage(StorageKey.ExportFormat).get() as 'JSON',
		exportDataType: Number(useLocalStorage(StorageKey.ExportDataType).get()) || 0,
		xlsFileList: [] as XlsItem[]
	}),
	actions: {
		setPath(type: number, path: string): void {
			const storageKey = type === 0 ? StorageKey.ImportPath : StorageKey.ExportPath;
			const stateProp = type === 0 ? "importPath" : "exportPath";

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
						path: this.importPath,
						index,
						name,
						isSelected: false,
						firstLetter: ""
					}));

			} catch (error) {
				console.error("获取 Excel 文件列表时出错:", error);
				return [];
			}
		},

		setExportFormat(exportFormat: string) {
			this.exportFormat = exportFormat;
			useLocalStorage(StorageKey.ExportFormat).set(exportFormat);
		},
	},
});