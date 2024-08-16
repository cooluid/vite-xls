"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const main_1 = require("electron/main");
const path_1 = __importDefault(require("path"));
function createWindow() {
    const isDev = process.env.IS_DEV === "true";
    console.log("isDEV", isDev);
    let win;
    if (isDev) {
        win = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                allowRunningInsecureContent: true,
                preload: path_1.default.join(__dirname, './preload.js')
            }
        });
        electron_1.ipcMain.removeHandler('dialog:openDirectory');
        electron_1.ipcMain.handle("dialog:openDirectory", async (event, ...args) => {
            console.log(`收到主进程异步操作消息`);
            console.log(`win`, win);
            const result = await main_1.dialog.showOpenDialog(win, { properties: ['openDirectory'] });
            console.log(`获取异步操作结果：`, result);
            return result.filePaths;
        });
        win.webContents.closeDevTools();
        win.webContents.openDevTools();
        win.loadURL("http://localhost:5173");
    }
    else {
        win = new electron_1.BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                allowRunningInsecureContent: false,
                preload: path_1.default.join(__dirname, './preload.js')
            }
        });
        win.loadURL(`file://${path_1.default.resolve(__dirname, '../')}/dist/index.html`);
    }
}
electron_1.app.whenReady().then(() => {
    // 创建windows应用
    createWindow();
    // 延迟3s 等待应用激活
    setTimeout(() => {
        console.log('已经过了3s了');
        electron_1.app.on('activate', function () {
            // 如果应用激活后,窗口依然为0,则重新创建windows应用
            if (electron_1.BrowserWindow.getAllWindows().length === 0)
                createWindow();
        });
    }, 3000);
});
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== "darwin") {
        console.log(`退出APP`);
        electron_1.app.quit();
    }
});
//# sourceMappingURL=index.js.map