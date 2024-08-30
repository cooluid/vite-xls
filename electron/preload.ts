import { contextBridge, ipcRenderer } from 'electron'

// 定义 IPC 通道类型，提高类型安全性
type IpcChannel = string;

// 定义 ElectronAPI 接口
interface ElectronAPI {
	invoke: (channel: IpcChannel, ...args: any[]) => Promise<any>;
}

// 创建 ElectronAPI 对象
const electronAPI: ElectronAPI = {
	invoke: async (channel, ...args) => {
		// console.log(`调用异步操作: ${channel}`, ...args);
		return await ipcRenderer.invoke(channel, ...args);
	},
};

// 在主世界中暴露 electronAPI 对象
contextBridge.exposeInMainWorld('electronAPI', electronAPI);