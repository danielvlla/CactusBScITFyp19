const { ipcRenderer } = require('electron')
const cursor          = require('./js/cursor.js')
// const magneticPattern = require('./js/magnetic-pattern')
const qt              = require('./js/quadtree')

var c

document.addEventListener('DOMContentLoaded', () => {
  cursor.createCursor('cursor')
  c = document.querySelector('#cursor')
  cursor.followCursor('cursor')

  let clientWidth = document.documentElement.clientWidth
  let clientHeight = document.documentElement.clientHeight

  let boundary = new qt.Rectangle(clientWidth/2, clientHeight/2, clientWidth, clientHeight)
  let qTree = new qt.QuadTree(boundary, 1)
  
  let links = document.getElementsByTagName('a')

  for (var i = 0; i < links.length; i++) {
    let linkBounds = links[i].getBoundingClientRect()

    if (linkBounds.x === 0 && linkBounds.y === 0 && linkBounds.width === 0 && linkBounds.height === 0) {
      continue
    }

    let linkCoordinates = new qt.Link(
      linkBounds.x,
      linkBounds.y,
      linkBounds.top,
      linkBounds.left,
      linkBounds.bottom,
      linkBounds.right,
      linkBounds.width,
      linkBounds.height
    )
    qTree.insert(linkCoordinates)
  }

  console.log(qTree)
})

document.addEventListener('scroll', (e) => {
  // Cursor does not work when scrolling
})

// ipcRenderer.on('listenLinks', () => {
//   ipcRenderer.sendToHost(magneticPattern.getLinkOnDwell(c))
// })

