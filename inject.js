const { ipcRenderer, webFrame }               = require('electron')
const { createCursor, followCursor }          = require('./js/cursor.js')
const { Link, Rectangle, QuadTree }           = require('./js/quadtree')
const { throttle, isEqual }                   = require('lodash')
const { genId, isElementANavElement }         = require('./js/utils')
const { markNavbars, passNavElementOnDwell }  = require('./js/navbar-pattern')

var _browser_zoomLevel = 0
var _browser_maxZoom = 9
var _browser_minZoom = -8

ipcRenderer.on("zoomIn", function () {
  if (_browser_maxZoom > _browser_zoomLevel) {
    _browser_zoomLevel += 0.5
  }
  webFrame.setZoomLevel(_browser_zoomLevel)
});

ipcRenderer.on("zoomOut", function () {
  if (_browser_minZoom < _browser_zoomLevel) {
    _browser_zoomLevel -= 0.5
  }
  webFrame.setZoomLevel(_browser_zoomLevel)
});

ipcRenderer.on("zoomReset", function () {
  _browser_zoomLevel = 0
  webFrame.setZoomLevel(_browser_zoomLevel)
})

var c

document.addEventListener('DOMContentLoaded', () => {

  let linksVisited = []

  // Instantiate Cursor
  createCursor('cursor')
  c = document.querySelector('#cursor')
  followCursor('cursor')

  // Instantiate Quad Tree
  let clientWidth = document.documentElement.clientWidth
  let clientHeight = document.documentElement.clientHeight
  let boundary = new Rectangle(clientWidth/2, clientHeight/2, clientWidth, clientHeight)
  let qTree = new QuadTree(boundary, 1)

  // Populate Quad Tree
  let links = document.getElementsByTagName('a')
  for (var i = 0; i < links.length; i++) {
    // Filtering through unneeded links
    if (isElementANavElement(links[i])) {
      continue
    }
    let linkBounds = links[i].getBoundingClientRect()
    if (linkBounds.x === 0 && linkBounds.y === 0 && linkBounds.width === 0 && linkBounds.height === 0) {
      continue
    }
    if (!links[i].href ) {
      continue
    }

    links[i].classList.add('linkMark')
    links[i].id = genId()

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

  // Get Links which fall within the cursor's range from Quad Tree
  var getLinksFromQuadTree = function queryTree(cursorLocation) {
    let range = new Rectangle(cursorLocation.x, cursorLocation.y, 200, 200)
    let points = qTree.query(range)

    if (Array.isArray(points) && points.length) {
      if (!isEqual(points, linksVisited)) {
        
        if (linksVisited.length) {
          for (let i=0; i < linksVisited.length; i++) {
            document.getElementById(linksVisited[i]).classList.remove('linkVisualise')
          }
          linksVisited = []
        }

        for (let i=0; i < points.length; i++) {
          document.getElementById(points[i].id).classList.add('linkVisualise')
          linksVisited.push(points[i].id)
        }
      }
      ipcRenderer.send('getLinks', points)
    }
  }

  var getLinksFromCursorRange =  throttle(() => {
    let cursorLoc = c.getBoundingClientRect()
    getLinksFromQuadTree(cursorLoc)
  }, 2000, { 'leading': false })

  document.addEventListener('mousemove', getLinksFromCursorRange)

  document.addEventListener('mouseleave', () => {
    document.removeEventListener('mousemove', getLinksFromCursorRange)
    getLinksFromCursorRange.cancel()
  })

  document.addEventListener('mouseenter', () => {
    document.addEventListener('mousemove', getLinksFromCursorRange)
  })

  // ---------- END HYPERLINK NAVIGATION PATTERN

  //  NAVIGATION BAR INTERACTION PATTERN
  let navElements = markNavbars()
  if (navElements) {
    for (i=0; i < navElements.length; i++) {
      navElements[i].addEventListener('mouseover', passNavElementOnDwell)
    }
  }
  // ---------- END NAVBAR NAVIGATION PATTERN

})