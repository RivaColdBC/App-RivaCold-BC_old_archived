const { app, BrowserWindow, ipcMain, dialog } = require("electron");
const os = require("os");

function createWindow(url) {
  win = new BrowserWindow({
    height: 600,
    width: 1200,
    center: true,
    show: true,
    webPreferences: {
      plugins: true,
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
      backgroundThrottling: false,
      webSecurity: false,
      sandbox: false,
    },
  });
  !process.defaultApp && os.userInfo().username != "YYZ"
    ? win.removeMenu()
    : null;
  win.maximize();
  win.setTitle("App-RivaCold-BC");
  url ? win.loadFile(url) : win.loadFile("./app/index.html");
}

ipcMain.on("newWindow", (event, data) => createWindow(data));
app.on("window-all-closed", () => app.quit());
app.on("ready", () => {
  // if (process.env.NODE_ENV === "production") {    autoUpdater.checkForUpdates();  }
  createWindow();
});

/*const { autoUpdater } = require("electron-updater");
autoUpdater.logger = require("electron-log");
autoUpdater.logger.transports.file.level = "info";
autoUpdater.on("update-downloaded", () => {
  dialog.showMessageBox(
    {
      type: "info",
      title: "Found Updates",
      message: "Found updates, do you want update now?",
      buttons: ["Sure", "No"],
    },
    (buttonIndex) => {
      if (buttonIndex === 0) {
        const isSilent = true;
        const isForceRunAfter = true;
        autoUpdater.quitAndInstall(isSilent, isForceRunAfter);
      } else {
        updater.enabled = true;
        updater = null;
      }
    }
  );
});
*/
