"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_updater_1 = require("electron-updater");
const fs = __importStar(require("node:fs/promises"));
const path_1 = __importDefault(require("path"));
const xlsx = __importStar(require("xlsx"));
const electron_2 = require("electron");
async function createWindow() {
    const isDev = process.env.IS_DEV === "true";
    console.log("isDEV", isDev);
    if (process.env.VSCODE_DEBUG === "true") {
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    const win = new electron_1.BrowserWindow(getWindowOptions(isDev));
    setupIpcHandlers(win);
    if (isDev) {
        await loadDevServer(win);
    }
    else {
        await win.loadURL(`file://${path_1.default.resolve(__dirname, '../')}/dist/index.html`);
    }
}
function getWindowOptions(isDev) {
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
            preload: path_1.default.join(__dirname, './preload.js')
        }
    };
}
async function loadDevServer(win, retryCount = 0) {
    try {
        await win.loadURL("http://localhost:5173");
        win.webContents.openDevTools();
    }
    catch (error) {
        console.error(`加载开发服务器失败，尝试重试 (${retryCount + 1}/5)`);
        if (retryCount < 4) {
            setTimeout(() => loadDevServer(win, retryCount + 1), 1000);
        }
        else {
            console.error("无法连接到开发服务器，请确保开发服务器已启动");
        }
    }
}
function setupIpcHandlers(win) {
    electron_1.ipcMain.handle("dialog:openDirectory", async () => {
        const result = await electron_1.dialog.showOpenDialog(win, { properties: ['openDirectory'] });
        return result.filePaths;
    });
    electron_1.ipcMain.handle("dialog:openFile", async () => {
        const result = await electron_1.dialog.showOpenDialog(win, { properties: ['openFile'] });
        return result.filePaths;
    });
    electron_1.ipcMain.handle("read-file", async (event, filePath) => {
        try {
            return await fs.readFile(filePath, 'utf8');
        }
        catch (err) {
            console.error(err);
            throw err;
        }
    });
    electron_1.ipcMain.handle("read-excel", async (event, filePath) => {
        try {
            return xlsx.readFile(filePath);
        }
        catch (e) {
            console.error(e);
            throw e;
        }
    });
    electron_1.ipcMain.handle('get-files-in-directory', async (event, dirPath) => {
        try {
            const files = await fs.readdir(dirPath);
            return files;
        }
        catch (error) {
            console.error('读取目录失败:', error);
            throw error;
        }
    });
    electron_1.ipcMain.handle('show-item-in-folder', async (event, filePath) => {
        if (filePath) {
            await electron_2.shell.showItemInFolder(path_1.default.normalize(filePath));
        }
    });
    electron_1.ipcMain.handle('join-paths', (event, ...paths) => {
        return path_1.default.join(...paths);
    });
    electron_1.ipcMain.handle('write-file', async (event, filePath, content) => {
        try {
            await fs.writeFile(filePath, content);
        }
        catch (error) {
            console.error('写入文件失败:', error);
            throw error;
        }
    });
    electron_1.ipcMain.handle('close-app', () => {
        electron_1.app.quit();
    });
}
electron_1.app.whenReady().then(async () => {
    await createWindow();
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
});
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
//# sourceMappingURL=index.js.map