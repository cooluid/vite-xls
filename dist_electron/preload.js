"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel, data) => {
        const validChannels = ['toMain'];
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.send(channel, data);
            console.log(`发送给主进程`, data);
        }
    },
    receive: (channel, func) => {
        const validChannels = ["fromMain"];
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.on(channel, (event, ...args) => func(...args));
            console.log(`收到主进程信息`);
        }
    },
    receiveOnce: (channel, func) => {
        const validChannels = ["fromMain"];
        if (validChannels.includes(channel)) {
            electron_1.ipcRenderer.once(channel, (event, ...args) => func(...args));
            console.log(`收到主进程一次性信息`);
        }
    }
});
//# sourceMappingURL=preload.js.map