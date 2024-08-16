"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
function createWindow() {
    const isDev = process.env.IS_DEV === "true";
    console.log("isDEV", isDev);
    let win = null;
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
        win.webContents.openDevTools();
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
    }
    win.loadURL(isDev ? 'http://localhost:5173' : `file://${path_1.default.join(__dirname, '../dist/index.html')}`);
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
        electron_1.app.quit();
    }
});
//# sourceMappingURL=index.js.map