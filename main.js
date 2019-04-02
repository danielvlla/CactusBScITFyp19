const { app, BrowserWindow, BrowserView, webContents, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow
let view
// const iconPath = path.join(__dirname, 'logo.png')

function createWindow () {
  mainWindow = new BrowserWindow({ 
    nodeIntegration: false, 
    nodeIntegrationInWorker: false,
    contextIsolation: true,
    webviewTag: true,
    preload: path.join(__dirname, 'preload.js'),
    icon: __dirname + '/AppIcon.icns'
  })

  mainWindow.maximize();
  mainWindow.loadURL('file://' + __dirname + '/index.html')

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('web-contents-created', (event, contents) => {
  contents.on('will-attach-webview', (event, webPreferences, params) => {
    webPreferences.nodeIntegration = false
  })
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipcMain.on('getLinks', (event, message) => {
  mainWindow.webContents.send('getLinks', message)
})

ipcMain.on('getNavLinks', (event, message) => {
  mainWindow.webContents.send('getNavLinks', message)
})

// ipcMain.on('highlightLinks', (event, message) => {
//   console.log('FROM MAIN')
//   event.sender.send('highlightLinks', message)
// })
