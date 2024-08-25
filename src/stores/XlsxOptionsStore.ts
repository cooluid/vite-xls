import { defineStore } from "pinia";
import { ElNotification } from "element-plus";

export interface XlsItem {
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

export const useXlsxOptionsStore = defineStore("xlsxOptions", {
  state: (): XlsxOptionsState => ({
    xlsPath: "",
    exportPath: "",
    exportType: 0,
    exportDataType: 0,
    selectedXls: [],
    xlsxList: [],
  }),
  actions: {
    async setXlsPath(): Promise<string> {
      const paths = await window.electronAPI.invoke("dialog:openDirectory");
      this.xlsPath = paths[0];
      useLocalStorage("xlsPath").set(this.xlsPath);
      return this.xlsPath;
    },

    async getXlsxList(): Promise<XlsItem[]> {
      try {
        const allFiles: string[] = await window.electronAPI.invoke("get-files-in-directory", this.xlsPath);
        this.xlsxList = allFiles
          .filter(file => file.endsWith(".xlsx") || file.endsWith(".xls"))
          .map((fileName, index) => ({ index, name: fileName, isSelected: false }));
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
      console.log("this.selectedXls", this.selectedXls);
    },

    getXlsPath() {
      this.xlsPath = useLocalStorage("xlsPath").get() || "";
      return this.xlsPath;
    },

    setExportPath(exportPath: string) {
      this.exportPath = exportPath;
      useLocalStorage("exportPath").set(exportPath);
    },

    getExportPath() {
      this.exportPath = useLocalStorage("exportPath").get() || "";
      return this.exportPath;
    },

    setExportDataType(exportDataType: number) {
      this.exportDataType = exportDataType;
      useLocalStorage("exportDataType").set(exportDataType.toString());
    },

    getExportDataType() {
      this.exportDataType = Number(useLocalStorage("exportDataType").get()) || 0;
      return this.exportDataType;
    },
  },
});