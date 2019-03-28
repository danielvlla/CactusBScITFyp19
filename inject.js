const { ipcRenderer }                = require('electron')
const { createCursor, followCursor } = require('./js/cursor.js')
const { Link, Rectangle, QuadTree }  = require('./js/quadtree')
const { debounce }                   = require('lodash')
const { genId }                      = require('./js/utils')

var c

let linksVisited = []

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
    links[i].classList.add('linkMark')
    links[i].id = genId()

    let linkBounds = links[i].getBoundingClientRect()
    if (linkBounds.x === 0 && linkBounds.y === 0 && linkBounds.width === 0 && linkBounds.height === 0) {
      continue
    }

    if (!links[i].href ) {
      continue
    }

    // If title is set, set to title, if not get text from anchor tag
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
      linkTitle,
      links[i].id
    )
    qTree.insert(link)
  }

  var getLinksFromQuadTree = debounce(function queryTree() {
    let cursorLoc = c.getBoundingClientRect()
    let range = new Rectangle(cursorLoc.x, cursorLoc.y, 200, 200)
    let points = qTree.query(range)

    for (var i=0; i<points.length;i++) {
      document.getElementById(points[i].id).classList.add('linkVisualise')
      linksVisited.push(points[i].id)
    }

    if (Array.isArray(points) && points.length) {
      ipcRenderer.send('getLinks', points)
    }

  }, 250)

  document.addEventListener('mousemove', getLinksFromQuadTree)

  for (var i=0; i<linksVisited.length;i++) {
    document.getElementById(linksVisited[i].id).classList.remove('linkVisualise')
    linksVisited.pop(linksVisited[i])
  }
})

// ipcRenderer.on('highlightLinks', (event, message) => {
//   console.log('FROM INJECT')
//   for (var i=0; i < message.length; i++) {
//     document.getElementById(message[i]).classList.add('linkVisualise')
//   }
// })
