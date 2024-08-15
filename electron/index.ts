import { app, BrowserWindow } from 'electron'
import path from 'path'

function createWindow() {
    const isDev = process.env.IS_DEV === "true";
    let win: BrowserWindow | null = null;

    if (isDev) {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                webSecurity: false,
                allowRunningInsecureContent: true
            }
        });

        win.webContents.openDevTools();

    } else {
        win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                webSecurity: true,
                allowRunningInsecureContent: false
            }
        });
    }

    win.loadURL(isDev ? 'http://localhost:5173' : `file://${path.join(__dirname, '../dist/index.html')}`);
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
        app.quit();
    }
})