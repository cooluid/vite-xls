import { app, BrowserWindow, dialog, ipcMain, shell } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as fs from "node:fs/promises";
import path from 'path';
import * as xlsx from 'xlsx';

let mainWindow: BrowserWindow | null = null;
let devToolsWindow: BrowserWindow | null = null;

async function createWindow() {
	const isDev = process.env.IS_DEV === "true";
	console.log("isDEV", isDev);

	mainWindow = new BrowserWindow(getWindowOptions(isDev));
	setupIpcHandlers();

	mainWindow.on('closed', () => {
		removeIpcHandlers();
		closeDevToolsWindow();
		mainWindow = null;
	});

	if (process.env.DEBUG === "true") {
		createDevToolsWindow();
	}

	await loadAppContent(isDev);
}

function getWindowOptions(isDev: boolean): Electron.BrowserWindowConstructorOptions {
	return {
		width: 800,
		height: 600,
		resizable: false,
		fullscreenable: true,
		maximizable: false,
		movable: true,
		webPreferences: {
			contextIsolation: true,
			nodeIntegration: false,
			allowRunningInsecureContent: isDev,
			preload: path.join(__dirname, './preload.js')
		}
	};
}

function createDevToolsWindow() {
	devToolsWindow = new BrowserWindow({
		width: 1200,
		height: 1000,
		show: false,
	});

	mainWindow!.webContents.setDevToolsWebContents(devToolsWindow.webContents);
	mainWindow!.webContents.openDevTools({ mode: 'detach' });

	devToolsWindow.setPosition(1000, 100);
	devToolsWindow.show();

	devToolsWindow.on('closed', () => {
		devToolsWindow = null;
	});
}

function closeDevToolsWindow() {
	if (devToolsWindow && !devToolsWindow.isDestroyed()) {
		devToolsWindow.close();
	}
	devToolsWindow = null;
}

async function loadAppContent(isDev: boolean) {
	if (isDev) {
		await mainWindow!.loadURL("http://localhost:5173");
	} else {
		await mainWindow!.loadURL(`file://${path.resolve(__dirname, '../')}/dist/index.html`);
	}
}

function setupIpcHandlers() {
	ipcMain.handle("dialog:openDirectory", handleOpenDirectory);
	ipcMain.handle("dialog:openFile", handleOpenFile);
	ipcMain.handle("read-files", handleReadFiles);
	ipcMain.handle("read-excel", handleReadExcel);
	ipcMain.handle('get-files-in-directory', handleGetFilesInDirectory);
	ipcMain.handle('show-item-in-folder', handleShowItemInFolder);
	ipcMain.handle('join-paths', handleJoinPaths);
	ipcMain.handle('write-file', handleWriteFile);
	ipcMain.handle('close-app', handleCloseApp);
}

function removeIpcHandlers() {
	ipcMain.removeHandler("dialog:openDirectory");
	ipcMain.removeHandler("dialog:openFile");
	ipcMain.removeHandler("read-files");
	ipcMain.removeHandler("read-excel");
	ipcMain.removeHandler('get-files-in-directory');
	ipcMain.removeHandler('show-item-in-folder');
	ipcMain.removeHandler('join-paths');
	ipcMain.removeHandler('write-file');
	ipcMain.removeHandler('close-app');
}

// 新的处理函数
function handleOpenDirectory() {
	return dialog.showOpenDialog(mainWindow!, { properties: ['openDirectory'] }).then(result => result.filePaths);
}

function handleOpenFile() {
	return dialog.showOpenDialog(mainWindow!, { properties: ['openFile'] }).then(result => result.filePaths);
}

function handleShowItemInFolder(event: Electron.IpcMainInvokeEvent, filePath: string) {
	return filePath && shell.showItemInFolder(path.normalize(filePath));
}

function handleJoinPaths(event: Electron.IpcMainInvokeEvent, ...paths: string[]) {
	return path.join(...paths);
}

function handleCloseApp() {
	app.quit();
}

async function handleReadFiles(event: Electron.IpcMainInvokeEvent, dirPath: string, suffix = ".json") {
	try {
		const files = await fs.readdir(dirPath);
		const combinedData: { [key: string]: any } = {};

		for (const file of files) {
			if (path.extname(file) !== suffix) continue;

			const filePath = path.join(dirPath, file);
			const fileContent = await fs.readFile(filePath, 'utf8');

			try {
				combinedData[file] = JSON.parse(fileContent);
			} catch (parseError) {
				console.error(`解析文件 ${file} 失败:`, parseError);
				combinedData[file] = null;
			}
		}

		return combinedData;
	} catch (error) {
		console.error('读取文件失败:', error);
		throw error;
	}
}

async function handleReadExcel(event: Electron.IpcMainInvokeEvent, filePath: string) {
	try {
		return xlsx.readFile(filePath);
	} catch (e) {
		console.error(e);
		throw e;
	}
}

async function handleGetFilesInDirectory(event: Electron.IpcMainInvokeEvent, dirPath: string) {
	try {
		return await fs.readdir(dirPath);
	} catch (error) {
		console.error('读取目录失败:', error);
		throw error;
	}
}

async function handleWriteFile(event: Electron.IpcMainInvokeEvent, filePath: string, content: string | Uint8Array, format?: string) {
	try {
		if (content instanceof Uint8Array) {
			await fs.writeFile(filePath, Buffer.from(content));
		} else if (typeof content === 'string') {
			await fs.writeFile(filePath, content, format ? { encoding: format as BufferEncoding } : undefined);
		} else {
			throw new Error('Unsupported content type');
		}
		return true;
	} catch (error) {
		console.error('写入文件失败:', error);
		throw error;
	}
}

function setupAppEventListeners() {
	app.on('window-all-closed', handleWindowAllClosed);
	app.on('activate', handleActivate);
	app.on('before-quit', handleBeforeQuit);
}

function handleWindowAllClosed() {
	closeDevToolsWindow();
	if (process.platform !== 'darwin') {
		app.quit();
	}
}

function handleActivate() {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
}

function handleBeforeQuit() {
	if (mainWindow && !mainWindow.isDestroyed()) {
		mainWindow.removeAllListeners('closed');
		mainWindow.close();
	}
	mainWindow = null;

	closeDevToolsWindow();
}

async function initApp() {
	await app.whenReady();
	await createWindow();
	autoUpdater.checkForUpdatesAndNotify();
	setupAppEventListeners();
}

initApp().catch(console.error);