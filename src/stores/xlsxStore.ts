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
  selectedXls: XlsItem[];
  xlsxList: XlsItem[];
}

const useLocalStorage = (key: string) => ({
  get: () => localStorage.getItem(key),
  set: (value: string) => localStorage.setItem(key, value),
});

export const useXlsxStore = defineStore("xlsxOptions", {
  state: (): XlsxOptionsState => ({
    xlsPath: useLocalStorage("importXlsPath").get() || "",
    exportPath: useLocalStorage("exportXlsPath").get() || "",
    exportType: 0,
    exportDataType: Number(useLocalStorage("exportDataType").get()) || 0,
    selectedXls: [],
    xlsxList: [],
  }),
  actions: {
    async setXlsPath(type: number): Promise<void> {
      const [path] = await window.electronAPI.invoke("dialog:openDirectory");
      const storageKey = type === 0 ? "importXlsPath" : "exportXlsPath";
      const stateProp = type === 0 ? "xlsPath" : "exportPath";

      this[stateProp] = path;
      useLocalStorage(storageKey).set(path);
    },

    async getXlsxList(): Promise<XlsItem[]> {
      try {
        const allFiles: string[] = await window.electronAPI.invoke("get-files-in-directory", this.xlsPath);
        this.xlsxList = allFiles
          .filter(file => /\.(xlsx|xls)$/.test(file))
          .map((name, index) => ({ path: this.xlsPath, index, name, isSelected: false }));
        return this.xlsxList;

      } catch (e: any) {
        console.error(e);
        ElNotification({
          title: "错误",
          message: `获取目录文件失败: ${e.message}`,
          type: "error",
        });
        return [];
      }
    },

    updateSelectedXls(index: number, isSelected: boolean) {
      const item = this.xlsxList[index];
      if (isSelected) {
        this.selectedXls.push({ ...item, isSelected: true });

      } else {
        this.selectedXls = this.selectedXls.filter(item => item.index !== index);
      }
    },

    setExportDataType(exportDataType: number) {
      this.exportDataType = exportDataType;
      useLocalStorage("exportDataType").set(exportDataType.toString());
    },
  },
});