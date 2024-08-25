import {app, BrowserWindow, dialog, ipcMain} from 'electron'
import path from 'path'
import * as fs from "node:fs";
import xlsx from 'xlsx'
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

function createWindow() {
	const isDev = process.env.IS_DEV === "true";
	console.log("isDEV", isDev);

	let win: BrowserWindow | null;

	if (isDev) {
		win = new BrowserWindow({
			width: 1000,
			height: 800,
			resizable: false,
			fullscreenable: false,
			maximizable: false,
			frame: false,
			movable: true,
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				allowRunningInsecureContent: true,
				preload: path.join(__dirname, './preload.js')
			}
		});

		win.loadURL("http://localhost:5173").then();
		win.webContents.openDevTools();

	} else {
		win = new BrowserWindow({
			width: 1000,
			height: 800,
			resizable: false,
			fullscreenable: false,
			maximizable: false,
			frame: false,
			movable: true,
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				allowRunningInsecureContent: false,
				preload: path.join(__dirname, './preload.js')
			}
		});

		win.loadURL(`file://${path.resolve(__dirname, '../')}/dist/index.html`).then();
	}

	ipcMain.handle("dialog:openDirectory", async (evt: IpcMainInvokeEvent, ...args: any[]) => {
		const result = await dialog.showOpenDialog(win as BrowserWindow, {properties: ['openDirectory']});

		return result.filePaths;
	});

	ipcMain.handle("dialog:openFile", async (evt: IpcMainInvokeEvent, ...args: any[]) => {
		const result = await dialog.showOpenDialog(win as BrowserWindow, {properties: ['openFile']});

		return result.filePaths;
	});

	ipcMain.on("read-file", (event, filePath) => {
		fs.readFile(filePath, 'utf8', (err, data) => {
			if (err) {
				console.error(err);
				return;
			}

			event.reply("file-data", data);
		});
	});

	ipcMain.on("read-excel", (event, filePath) => {
		try {
			const workbook = xlsx.readFile(filePath);
			event.reply("excel-data", workbook);

		} catch (e) {
			console.error(e);
		}
	});

	ipcMain.handle("get-files-in-directory", async (evt: IpcMainInvokeEvent, dirPath: string) => {
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