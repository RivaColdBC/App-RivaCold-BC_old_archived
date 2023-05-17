export function newWindow(url) {
  const { ipcRenderer } = require('electron')
  ipcRenderer.send('newWindow', url)
}
