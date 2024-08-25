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
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("node:fs"));
const xlsx_1 = __importDefault(require("xlsx"));
function createWindow() {
    const isDev = process.env.IS_DEV === "true";
    console.log("isDEV", isDev);
    let win;
    if (isDev) {
        win = new electron_1.BrowserWindow({
            width: 1000,
            height: 800,
            resizable: false,
            fullscreenable: false,
            maximizable: false,
            movable: true,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                allowRunningInsecureContent: true,
                preload: path_1.default.join(__dirname, './preload.js')
            }
        });
        win.loadURL("http://localhost:5173").then();
        win.webContents.openDevTools();
    }
    else {
        win = new electron_1.BrowserWindow({
            width: 1000,
            height: 800,
            resizable: false,
            fullscreenable: false,
            maximizable: false,
            movable: true,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                allowRunningInsecureContent: false,
                preload: path_1.default.join(__dirname, './preload.js')
            }
        });
        win.loadURL(`file://${path_1.default.resolve(__dirname, '../')}/dist/index.html`).then();
    }
    electron_1.ipcMain.handle("dialog:openDirectory", async (evt, ...args) => {
        const result = await electron_1.dialog.showOpenDialog(win, { properties: ['openDirectory'] });
        return result.filePaths;
    });
    electron_1.ipcMain.handle("dialog:openFile", async (evt, ...args) => {
        const result = await electron_1.dialog.showOpenDialog(win, { properties: ['openFile'] });
        return result.filePaths;
    });
    electron_1.ipcMain.on("read-file", (event, filePath) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            event.reply("file-data", data);
        });
    });
    electron_1.ipcMain.on("read-excel", (event, filePath) => {
        try {
            const workbook = xlsx_1.default.readFile(filePath);
            event.reply("excel-data", workbook);
        }
        catch (e) {
            console.error(e);
        }
    });
    electron_1.ipcMain.handle("get-files-in-directory", async (evt, dirPath) => {
        try {
            return fs.readdirSync(dirPath);
        }
        catch (e) {
            console.error(e);
            return [];
        }
    });
}
electron_1.app.whenReady().then(() => {
    // 创建windows应用
    createWindow();
    // 延迟3s 等待应用激活
    setTimeout(() => {
        electron_1.app.on('activate', function () {
            // 如果应用激活后,窗口依然为0,则重新创建windows应用
            if (electron_1.BrowserWindow.getAllWindows().length === 0)
                createWindow();
        });
    }, 3000);
});
electron_1.app.on('window-all-closed', () => {
    electron_1.app.quit();
});
//# sourceMappingURL=index.js.map