"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
// 创建 ElectronAPI 对象
const electronAPI = {
    invoke: async (channel, ...args) => {
        console.log(`调用异步操作: ${channel}`, ...args);
        return await electron_1.ipcRenderer.invoke(channel, ...args);
    },
};
// 在主世界中暴露 electronAPI 对象
electron_1.contextBridge.exposeInMainWorld('electronAPI', electronAPI);
//# sourceMappingURL=preload.js.map