// 导入Electron的contextBridge和ipcRenderer模块
import {contextBridge, ipcRenderer} from 'electron'

// 在主世界中暴露electronAPI对象，用于Electron的IPC通信
contextBridge.exposeInMainWorld('electronAPI', {
	// 定义一个异步调用方法，用于执行跨进程调用
	invoke: async (channel: string, ...args: any[]) => {
		console.log(`获取异步操作`, channel, ...args);
		// 通过IPC渲染器发起异步调用，并返回结果
		return await ipcRenderer.invoke(channel, ...args);
	},

	// 定义一个发送消息的方法，用于向主进程发送数据
	send: (channel: string, data: any) => {
		// 使用IPC渲染器发送数据到主进程
		ipcRenderer.send(channel, data);
		console.log(`发送消息给主进程`, channel, data);
	},

	// 定义一个接收消息的方法，用于监听主进程发送的数据
	receive: (channel: string, func: (...args: any[]) => void) => {
		// 监听指定通道的消息，每当收到消息时，执行回调函数
		ipcRenderer.on(channel, (event, ...args: any[]) => {
			func?.(...args);
			console.log(`收到主进程消息`, ...args);
		});

	},

	// 定义一个接收一次性消息的方法，用于监听主进程的一次性数据发送
	receiveOnce: (channel: string, func: (...args: any[]) => void) => {
		// 监听指定通道的一次性消息，收到后执行回调函数
		ipcRenderer.once(channel, (event, ...args: any[]) => {
			func?.(...args);
			console.log(`收到主进程一次性消息`, ...args);
		});
	}
});
