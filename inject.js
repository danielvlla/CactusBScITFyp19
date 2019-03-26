const { ipcRenderer }                = require('electron')
const { createCursor, followCursor } = require('./js/cursor.js')
const { Link, Rectangle, QuadTree }  = require('./js/quadtree')
const { debounce }                   = require('underscore')

var c

document.addEventListener('DOMContentLoaded', () => {

  // Instantiate Cursor
  createCursor('cursor')
  c = document.querySelector('#cursor')
  followCursor('cursor')

  // Instantiate Quad Tree
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

    if (!links[i].href ) {
      continue
    }

    const linkTitle = links[i].title ? links[i].title : links[i].text.trim()

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
      linkTitle
    )
    qTree.insert(link)
  }

  var getLinksFromQuadTree = debounce(function queryTree() {
    cursorLoc = c.getBoundingClientRect()
    let range = new Rectangle(cursorLoc.x, cursorLoc.y, 200, 200)
    let points = qTree.query(range)

    ipcRenderer.send('getLinks', points)
  }, 250)

  document.addEventListener('mousemove', getLinksFromQuadTree)
})
