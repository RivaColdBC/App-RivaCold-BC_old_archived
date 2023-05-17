import { app, ipcMain, BrowserWindow } from 'electron';
import serve from 'electron-serve';
import os from 'os'

const isProd = process.env.NODE_ENV === 'production';
isProd ? serve({ directory: 'app' }) : app.setPath('userData', `${app.getPath('userData')} (development)`)

function createWindow(url) {
  const mainWindow = new BrowserWindow({
    height: 600, width: 1200, center: true, show: true,
    webPreferences: {
      plugins: true, nodeIntegration: true,
      enableRemoteModule: true, contextIsolation: false,
      backgroundThrottling: false, webSecurity: false
    },
  });
  !isProd && os.userInfo().username != "YYZ" ? mainWindow.removeMenu() : null
  mainWindow.maximize();
  mainWindow.setTitle("App-RivaCold-BC");
  if (isProd) {
    mainWindow.loadURL(`app://./${url}.html`);
  } else {
    const port = process.argv[2];
    mainWindow.loadURL(`http://localhost:${port}/${url}`);
  }
}


ipcMain.on('newWindow', (event, data) => createWindow(data))
app.on('ready', () => createWindow("home"));
app.on('window-all-closed', () => app.quit());