import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    invoke: async (channel: string, ...args: any[]) => {
        console.log(`获取异步操作`, channel, ...args);
        return await ipcRenderer.invoke(channel, ...args);
    },

    send: (channel: string, data: any) => {
        ipcRenderer.send(channel, data);
        console.log(`发送消息给主进程`, channel, data);
    },

    receive: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.on(channel, (event, ...args: any[]) => {
            func?.(...args);
            console.log(`收到主进程消息`);
        });

    },

    receiveOnce: (channel: string, func: (...args: any[]) => void) => {
        ipcRenderer.once(channel, (event, ...args: any[]) => {
            func?.(...args);
            console.log(`收到主进程一次性消息`);
        });
    }
});