import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    send: (channel: string, data: any) => {
        const validChannels = ['toMain'];

        if (validChannels.includes(channel)) {
            ipcRenderer.send(channel, data);
            console.log(`发送给主进程`, data);
        }
    },

    receive: (channel: string, func: (...args: any[]) => void) => {
        const validChannels = ["fromMain"];

        if (validChannels.includes(channel)) {
            ipcRenderer.on(channel, (event, ...args: any[]) => func(...args));
            console.log(`收到主进程信息`);
        }
    },

    receiveOnce: (channel: string, func: (...args: any[]) => void) => {
        const validChannels = ["fromMain"];

        if (validChannels.includes(channel)) {
            ipcRenderer.once(channel, (event, ...args: any[]) => func(...args));
            console.log(`收到主进程一次性信息`);
        }
    }
});