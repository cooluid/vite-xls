import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import * as fs from "node:fs/promises";
import path from 'path';
import * as xlsx from 'xlsx';
import { shell } from 'electron';


async function createWindow() {
	const isDev = process.env.IS_DEV === "true";
	console.log("isDEV", isDev);

	if (process.env.VSCODE_DEBUG === "true") {
		await new Promise(resolve => setTimeout(resolve, 2000));
	}

	const win = new BrowserWindow(getWindowOptions(isDev));
	setupIpcHandlers(win);

	if (isDev) {
		await loadDevServer(win);
	} else {
		await win.loadURL(`file://${path.resolve(__dirname, '../')}/dist/index.html`);
	}
}

function getWindowOptions(isDev: boolean): Electron.BrowserWindowConstructorOptions {
	return {
		// fullscreen: true,
		resizable: false,
		fullscreenable: true,
		maximizable: false,
		movable: true,
		webPreferences: {
			devTools: isDev,
			contextIsolation: true,
			nodeIntegration: false,
			allowRunningInsecureContent: isDev,
			preload: path.join(__dirname, './preload.js')
		}
	};
}

async function loadDevServer(win: BrowserWindow, retryCount = 0) {
	try {
		await win.loadURL("http://localhost:5173");
		win.webContents.openDevTools();
	} catch (error) {
		console.error(`加载开发服务器失败，尝试重试 (${retryCount + 1}/5)`);
		if (retryCount < 4) {
			setTimeout(() => loadDevServer(win, retryCount + 1), 1000);
		} else {
			console.error("无法连接到开发服务器，请确保开发服务器已启动");
		}
	}
}

function setupIpcHandlers(win: BrowserWindow) {
	ipcMain.handle("dialog:openDirectory", async () => {
		const result = await dialog.showOpenDialog(win, { properties: ['openDirectory'] });
		return result.filePaths;
	});

	ipcMain.handle("dialog:openFile", async () => {
		const result = await dialog.showOpenDialog(win, { properties: ['openFile'] });
		return result.filePaths;
	});

	ipcMain.handle("read-files", async (event, dirPath: string, suffix = ".json") => {
		try {
			const files = await fs.readdir(dirPath);
			const combinedData: { [key: string]: any } = {};

			for (const file of files) {
				if (path.extname(file) !== suffix) {
					continue;
				}

				const filePath = path.join(dirPath, file);
				const fileContent = await fs.readFile(filePath, 'utf8');
				
				try {
					combinedData[file] = JSON.parse(fileContent);
				} catch (parseError) {
					console.error(`解析文件 ${file} 失败:`, parseError);
					combinedData[file] = null; // 或者您可以选择跳过这个文件
				}
			}

			return combinedData;

		} catch (error) {
			console.error('读取文件失败:', error);
			throw error;
		}
	});

	ipcMain.handle("read-excel", async (event, filePath) => {
		try {
			return xlsx.readFile(filePath);
		} catch (e) {
			console.error(e);
			throw e;
		}
	});

	ipcMain.handle('get-files-in-directory', async (event, dirPath) => {
		try {
			const files = await fs.readdir(dirPath);
			return files;

		} catch (error) {
			console.error('读取目录失败:', error);
			throw error;
		}
	});

	ipcMain.handle('show-item-in-folder', async (event, filePath) => {
		if (filePath) {
			await shell.showItemInFolder(path.normalize(filePath));
		}
	});

	ipcMain.handle('join-paths', (event, ...paths: string[]) => {
		return path.join(...paths);
	});

	ipcMain.handle('write-file', async (event, filePath: string, content: string | Uint8Array, format?: string) => {
		try {
			if (content instanceof Uint8Array) {
				await fs.writeFile(filePath, Buffer.from(content));

			} else if (typeof content === 'string') {
				if (format) {
					await fs.writeFile(filePath, content, { encoding: format as BufferEncoding });
				} else {
					await fs.writeFile(filePath, content);
				}

			} else {
				throw new Error('Unsupported content type');
			}

			return true;

		} catch (error) {
			console.error('写入文件失败:', error);
			throw error;
		}
	});

	ipcMain.handle('close-app', () => {
		app.quit();
	});
}

app.whenReady().then(async () => {
	await createWindow();
	autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
	app.quit();
})