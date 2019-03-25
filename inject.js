const { ipcRenderer }               = require('electron')
const cursor                        = require('./js/cursor.js')
const { Link, Rectangle, QuadTree } = require('./js/quadtree')
const { debounce }                  = require('./js/utils')

var c

document.addEventListener('DOMContentLoaded', () => {
  cursor.createCursor('cursor')
  c = document.querySelector('#cursor')
  cursor.followCursor('cursor')

  let clientWidth = document.documentElement.clientWidth
  let clientHeight = document.documentElement.clientHeight

  let boundary = new Rectangle(clientWidth/2, clientHeight/2, clientWidth, clientHeight)
  let qTree = new QuadTree(boundary, 1)
  let links = document.getElementsByTagName('a')

  for (var i = 0; i < links.length; i++) {
    let linkBounds = links[i].getBoundingClientRect()
    if (linkBounds.x === 0 && linkBounds.y === 0 && linkBounds.width === 0 && linkBounds.height === 0) {
      continue
    }
    let link = new Link(
      linkBounds.x,
      linkBounds.y,
      linkBounds.top,
      linkBounds.left,
      linkBounds.bottom,
      linkBounds.right,
      linkBounds.width,
      linkBounds.height,
      linkBounds.x + linkBounds.width/2,
      linkBounds.y + linkBounds.height/2,
      links[i].href,
      links[i].title
    )
    qTree.insert(link)
  }

  var queryTree = debounce(function queryTree() {
    cursorLoc = c.getBoundingClientRect()
    let range = new Rectangle(cursorLoc.x, cursorLoc.y, 200, 200)
    let points = qTree.query(range)
    for (let p of points ) {
      console.log(p.url)
    }
  }, 250)

  document.addEventListener('mousemove', queryTree)

  console.log(qTree)
})

document.addEventListener('scroll', (e) => {
  // Cursor does not work when scrolling
})

// ipcRenderer.on('listenLinks', () => {
//   ipcRenderer.sendToHost(magneticPattern.getLinkOnDwell(c))
// })

