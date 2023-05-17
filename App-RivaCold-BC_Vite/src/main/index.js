const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { is } = require('@electron-toolkit/utils')
const os = require('os')

function createWindow(router) {
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    center: true,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      enableRemoteModule: true,
      contextIsolation: false,
      backgroundThrottling: false,
      webSecurity: false,
      sandbox: false,
    }
  })

  !process.defaultApp && os.userInfo().username != 'YYZ' ? mainWindow.removeMenu() : null
  mainWindow.maximize()
  mainWindow.setTitle('App-RivaCold-BC')
  is.dev && process.env['ELECTRON_RENDERER_URL']
    ? mainWindow.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/index.html/#/${router}`)
    : mainWindow.loadFile(path.join(__dirname, `../renderer/index.html/#/${router}`))
  is.dev ? mainWindow.webContents.openDevTools() : null
}

app.on('ready', () => createWindow())
app.on('window-all-closed', () => app.quit())
ipcMain.on('newWindow', (event, data) => createWindow(data))
