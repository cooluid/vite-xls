/**
 * 储存KEY枚举
 */
export enum StorageKey {
    ImportPath = "importXlsPath",
    ExportPath = "exportXlsPath",
    ExportFormat = "exportFormat",
    ExportDataType = "exportDataType",
    XlsFileList = "xlsFileList",
}

/**
 * 使用localStorage
 * @param key 
 * @returns 
 */
export const useLocalStorage = (key: StorageKey) => ({
    get: () => localStorage.getItem(key) || "",
    set: (value: string) => localStorage.setItem(key, value),
});

export const clearLocalStorage = () => {
    localStorage.clear();
};

export const clearLocalStorageByKey = (key: StorageKey) => {
    localStorage.removeItem(key);
};