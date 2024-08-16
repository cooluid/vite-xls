import { app, BrowserWindow, ipcMain } from 'electron'
import { dialog } from 'electron/main';
import path from 'path'

function createWindow() {
    const isDev = process.env.IS_DEV === "true";
    console.log("isDEV", isDev);

    let win: BrowserWindow | null;

    if (isDev) {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                allowRunningInsecureContent: true,
                preload: path.join(__dirname, './preload.js')
            }
        });

        ipcMain.removeHandler('dialog:openDirectory');
        ipcMain.handle("dialog:openDirectory", async (event, ...args: any) => {
            console.log(`收到主进程异步操作消息`);
            console.log(`win`, win);
            const result = await dialog.showOpenDialog(win as BrowserWindow, { properties: ['openDirectory'] });
            console.log(`获取异步操作结果：`, result);
            return result.filePaths;
        });

        win.webContents.closeDevTools();
        win.webContents.openDevTools();

        win.loadURL("http://localhost:5173");

    } else {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                allowRunningInsecureContent: false,
                preload: path.join(__dirname, './preload.js')
            }
        });

        win.loadFile(`file://${path.join(__dirname, '../dist/index.html')}`);
    }
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
    if (process.platform !== "darwin") {
        console.log(`退出APP`);
        app.quit();
    }
})