import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import path from 'path'
import * as fs from "node:fs";
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

function createWindow() {
	const isDev = process.env.IS_DEV === "true";
	console.log("isDEV", isDev);

	let win: BrowserWindow | null;

	if (isDev) {
		win = new BrowserWindow({
			width: 1000,
			height: 800,
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				allowRunningInsecureContent: true,
				preload: path.join(__dirname, './preload.js')
			}
		});

		win.loadURL("http://localhost:5173").then();

	} else {
		win = new BrowserWindow({
			width: 1000,
			height: 800,
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				allowRunningInsecureContent: false,
				preload: path.join(__dirname, './preload.js')
			}
		});

		win.loadURL(`file://${path.resolve(__dirname, '../')}/dist/index.html`).then();
	}

	// win.webContents.openDevTools();

	ipcMain.handle("dialog:openDirectory", async (evt: IpcMainInvokeEvent, ...args: any[]) => {
		console.log(`收到渲染进程发来的消息dialog:openDirectory`, evt, ...args);
		const result = await dialog.showOpenDialog(win as BrowserWindow, {properties: ['openDirectory']});

		return result.filePaths;
	});

	ipcMain.handle("dialog:openFile", async (evt: IpcMainInvokeEvent, ...args: any[]) => {
		console.log(`收到渲染进程发来的消息dialog:openFile`, evt, ...args);
		const result = await dialog.showOpenDialog(win as BrowserWindow, {properties: ['openFile']});

		return result.filePaths;
	});

	ipcMain.handle("get-files-in-directory", async (evt: IpcMainInvokeEvent, dirPath: string) => {
		console.log(`收到渲染进程发来的消息get-files-in-directory`, evt, dirPath);
		try {
			return fs.readdirSync(dirPath);

		} catch (e) {
			console.error(e);
			return [];
		}
	})
}

app.whenReady().then(() => {
	// 创建windows应用
	createWindow();

	// 延迟3s 等待应用激活
	setTimeout(() => {
		app.on('activate', function () {
			// 如果应用激活后,窗口依然为0,则重新创建windows应用
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
		});
	}, 3000);
});

app.on('window-all-closed', () => {
	app.quit();
})