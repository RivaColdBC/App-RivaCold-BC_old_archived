const { ipcRenderer } = require("electron");
function newWindow(url) {
    ipcRenderer.send('newWindow', url)
}