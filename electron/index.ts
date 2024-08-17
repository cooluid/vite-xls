import {app, BrowserWindow, ipcMain} from 'electron'
import {dialog} from 'electron/main';
import path from 'path'
import IpcMainInvokeEvent = Electron.IpcMainInvokeEvent;

function createWindow() {
	const isDev = process.env.IS_DEV === "true";
	console.log("isDEV", isDev);

	let win: BrowserWindow | null;

	if (isDev) {
		win = new BrowserWindow({
			width: 800,
			height: 800,
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				allowRunningInsecureContent: true,
				preload: path.join(__dirname, './preload.js')
			}
		});

		win.loadURL("http://localhost:5173");

	} else {
		win = new BrowserWindow({
			width: 800,
			height: 800,
			webPreferences: {
				contextIsolation: true,
				nodeIntegration: false,
				allowRunningInsecureContent: false,
				preload: path.join(__dirname, './preload.js')
			}
		});

		win.loadURL(`file://${path.resolve(__dirname, '../')}/dist/index.html`);
	}

	win.webContents.openDevTools();

	ipcMain.handle("dialog:openDirectory", async (evt: IpcMainInvokeEvent, ...args: any[]) => {
		console.log(`收到渲染进程发来的消息dialog:openDirectory`, evt, ...args);
		const result = await dialog.showOpenDialog(win as BrowserWindow, {properties: ['openDirectory']});

		return result.filePaths;
	});
}

app.whenReady().then(() => {
	// 创建windows应用
	createWindow();

	// 延迟3s 等待应用激活
	setTimeout(() => {
		console.log('已经过了3s了');
		app.on('activate', function () {
			// 如果应用激活后,窗口依然为0,则重新创建windows应用
			if (BrowserWindow.getAllWindows().length === 0) createWindow();
		});
	}, 3000);
});

app.on('window-all-closed', () => {
	app.quit();
})