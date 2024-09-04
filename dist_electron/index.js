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
let mainWindow = null;
let devToolsWindow = null;
async function createWindow() {
    const isDev = process.env.IS_DEV === "true";
    console.log("isDEV", isDev);
    mainWindow = new electron_1.BrowserWindow(getWindowOptions(isDev));
    setupIpcHandlers();
    mainWindow.on('closed', () => {
        removeIpcHandlers();
        closeDevToolsWindow();
        mainWindow = null;
    });
    // createDevToolsWindow();
    await loadAppContent(isDev);
}
function getWindowOptions(isDev) {
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
            webSecurity: true,
            preload: path_1.default.join(__dirname, './preload.js')
        }
    };
}
function createDevToolsWindow() {
    devToolsWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 1000,
        show: false,
    });
    mainWindow.webContents.setDevToolsWebContents(devToolsWindow.webContents);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
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
async function loadAppContent(isDev) {
    if (isDev) {
        await mainWindow.loadURL("http://localhost:5173");
    }
    else {
        const htmlPath = path_1.default.resolve(__dirname, '../dist/index.html');
        console.log('Loading HTML from:', htmlPath);
        await mainWindow.loadURL(`file://${htmlPath}`);
    }
}
function setupIpcHandlers() {
    electron_1.ipcMain.handle("dialog:openDirectory", handleOpenDirectory);
    electron_1.ipcMain.handle("dialog:openFile", handleOpenFile);
    electron_1.ipcMain.handle("read-files", handleReadFiles);
    electron_1.ipcMain.handle("read-excel", handleReadExcel);
    electron_1.ipcMain.handle('get-files-in-directory', handleGetFilesInDirectory);
    electron_1.ipcMain.handle('show-item-in-folder', handleShowItemInFolder);
    electron_1.ipcMain.handle('join-paths', handleJoinPaths);
    electron_1.ipcMain.handle('write-file', handleWriteFile);
    electron_1.ipcMain.handle('close-app', handleCloseApp);
    electron_1.ipcMain.handle('get-app-version', handleGetAppVersion);
    electron_1.ipcMain.handle('read-file', handleReadFile);
}
function removeIpcHandlers() {
    electron_1.ipcMain.removeHandler("dialog:openDirectory");
    electron_1.ipcMain.removeHandler("dialog:openFile");
    electron_1.ipcMain.removeHandler("read-files");
    electron_1.ipcMain.removeHandler("read-excel");
    electron_1.ipcMain.removeHandler('get-files-in-directory');
    electron_1.ipcMain.removeHandler('show-item-in-folder');
    electron_1.ipcMain.removeHandler('join-paths');
    electron_1.ipcMain.removeHandler('write-file');
    electron_1.ipcMain.removeHandler('close-app');
    electron_1.ipcMain.removeHandler('get-app-version');
    electron_1.ipcMain.removeHandler('read-file');
}
// 新的处理函数
function handleOpenDirectory() {
    return electron_1.dialog.showOpenDialog(mainWindow, { properties: ['openDirectory'] }).then(result => result.filePaths);
}
function handleOpenFile() {
    return electron_1.dialog.showOpenDialog(mainWindow, { properties: ['openFile'] }).then(result => result.filePaths);
}
function handleShowItemInFolder(event, filePath) {
    return filePath && electron_1.shell.showItemInFolder(path_1.default.normalize(filePath));
}
function handleJoinPaths(event, ...paths) {
    return path_1.default.join(...paths);
}
function handleGetAppVersion() {
    return electron_1.app.getVersion();
}
function handleReadFile(event, filePath) {
    return fs.readFile(filePath, 'utf8');
}
function handleCloseApp() {
    electron_1.app.quit();
}
async function handleReadFiles(event, dirPath, suffix = ".json") {
    try {
        const files = await fs.readdir(dirPath);
        const combinedData = {};
        for (const file of files) {
            if (path_1.default.extname(file) !== suffix)
                continue;
            const filePath = path_1.default.join(dirPath, file);
            const fileContent = await fs.readFile(filePath, 'utf8');
            try {
                combinedData[file] = JSON.parse(fileContent);
            }
            catch (parseError) {
                console.error(`解析文件 ${file} 失败:`, parseError);
                combinedData[file] = null;
            }
        }
        return combinedData;
    }
    catch (error) {
        console.error('读取文件失败:', error);
        throw error;
    }
}
async function handleReadExcel(event, filePath) {
    try {
        return xlsx.readFile(filePath);
    }
    catch (e) {
        console.error(e);
        throw e;
    }
}
async function handleGetFilesInDirectory(event, dirPath) {
    try {
        return await fs.readdir(dirPath);
    }
    catch (error) {
        console.error('读取目录失败:', error);
        throw error;
    }
}
async function handleWriteFile(event, filePath, content, format) {
    try {
        if (content instanceof Uint8Array) {
            await fs.writeFile(filePath, Buffer.from(content));
        }
        else if (typeof content === 'string') {
            await fs.writeFile(filePath, content, format ? { encoding: format } : undefined);
        }
        else {
            throw new Error('Unsupported content type');
        }
        return true;
    }
    catch (error) {
        console.error('写入文件失败:', error);
        throw error;
    }
}
function setupAppEventListeners() {
    electron_1.app.on('window-all-closed', handleWindowAllClosed);
    electron_1.app.on('activate', handleActivate);
    electron_1.app.on('before-quit', handleBeforeQuit);
}
function handleWindowAllClosed() {
    closeDevToolsWindow();
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
}
function handleActivate() {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
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
    await electron_1.app.whenReady();
    await createWindow();
    electron_updater_1.autoUpdater.checkForUpdatesAndNotify();
    setupAppEventListeners();
}
initApp().catch(console.error);
//# sourceMappingURL=index.js.map