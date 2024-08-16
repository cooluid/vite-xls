"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    invoke: async (channel, ...args) => {
        console.log(`获取异步操作`, channel, ...args);
        return await electron_1.ipcRenderer.invoke(channel, ...args);
    },
    send: (channel, data) => {
        electron_1.ipcRenderer.send(channel, data);
        console.log(`发送消息给主进程`, channel, data);
    },
    receive: (channel, func) => {
        electron_1.ipcRenderer.on(channel, (event, ...args) => {
            func?.(...args);
            console.log(`收到主进程消息`);
        });
    },
    receiveOnce: (channel, func) => {
        electron_1.ipcRenderer.once(channel, (event, ...args) => {
            func?.(...args);
            console.log(`收到主进程一次性消息`);
        });
    }
});
//# sourceMappingURL=preload.js.map