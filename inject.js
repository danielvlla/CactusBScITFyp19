const { ipcRenderer } = require('electron')
const cursor          = require('./js/cursor.js')
const magneticPattern = require('./js/magnetic-pattern')

var c

document.addEventListener('DOMContentLoaded', () => {
  cursor.createCursor('cursor')
  c = document.querySelector('#cursor')
  cursor.followCursor('cursor')
})

document.addEventListener('scroll', (e) => {
  cursor.followCursor('cursor')
})

ipcRenderer.on('listenLinks', () => {
  ipcRenderer.sendToHost(magneticPattern.getLinkOnDwell(c))
})
