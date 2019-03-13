const { ipcRenderer } = require('electron')
const cursor          = require('./js/cursor.js')

const dwellTime = 2000
var c

document.addEventListener('DOMContentLoaded', () => {
  cursor.createCursor()
  cursor.followCursor()
  c = document.getElementById('cursor')
})

ipcRenderer.on('listenLinks', (event, message) => {
  ipcRenderer.sendToHost(getLinkOnDwell())
})

function getLinkOnDwell() {
  var distance = 50
  var cursorLoc
  var dwellTimer = 0
  var enteredLink
  var enteredBounds = {
    top: null,
    bottom: null,
    right: null,
    left: null,
  }

  var anchorTags = document.querySelectorAll('a')

  for (var i=0; i<anchorTags.length; i++) {
    anchorTags[i].classList.add('linkMarker')
  }

  document.addEventListener('mousemove', () => {
    cursorLoc = c.getBoundingClientRect()
    var el = null

    var elements = document.elementsFromPoint(cursorLoc.x, cursorLoc.y)

    if (elements) {
      el = Array.from(elements).find(e => { 
        return e.tagName === 'A'
      })
      if (el) {
        el.classList.add('linkDwell')
        const elBounds = el.getBoundingClientRect()
        enteredLink = el
        enteredBounds = setDistance(elBounds)
        stopAtY = elBounds.top + (elBounds.height / 2)
        stopAtX = elBounds.left + (elBounds.width / 2)
        cursor.stopCursor(stopAtX, stopAtY)
        if (!dwellTimer) {
          dwellTimer = setTimeout(() => {
            return ipcRenderer.send('getLink', el.href)
          }, dwellTime)
        }
      }
    }

    if (enteredLink) {
      if (cursorLoc.x > enteredBounds.right || cursorLoc.x < enteredBounds.left 
        || cursorLoc.y < enteredBounds.top || cursorLoc.y > enteredBounds.bottom) {
          enteredLink.classList.remove('linkDwell')
          enteredLink = null
          clearTimeout(dwellTimer)
          dwellTimer = 0
          cursor.followCursor()
      }
    }
  })

  function setDistance(bounds) {
    enteredBounds.top = bounds.top - distance
    enteredBounds.right = bounds.right + distance
    enteredBounds.bottom = bounds.bottom + distance
    enteredBounds.left = bounds.left - distance
    return enteredBounds
  }
}

// function getLinkOnDwell() {
//   var anchorTags = document.getElementsByTagName('a')

//   for (var i=0; i < anchorTags.length; i++) {
//     var box

//     anchorTags[i].classList.add('linkMarker')

//     anchorTags[i].addEventListener('mouseover', (e) => {
//       e.target.classList.add('linkDwell')
//       linkTimeout = setTimeout(() => {
//         if (e.target.tagName.toLowerCase() === 'a') {
//           return ipcRenderer.send('getLink', e.target.href)
//         } else if (e.target.parentNode.tagName.toLowerCase() === 'a') {
//           return ipcRenderer.send('getLink', e.target.parentNode.href)
//         } else {
//           console.log(e)
//         }
//       }, dwellTime)

//     })

//     anchorTags[i].addEventListener('mouseout', (e) => {
//       box = e.target.getBoundingClientRect();
//       isMouseNearLink(box, (bool) => {
//         if (!bool) {
//           // Stop selection
//           e.target.classList.remove('linkDwell')
//           clearTimeout(linkTimeout)
//         }
//       })
//       // if mouse is on another element, remove link dwell and clear timeout
//     })
//   }
// }

// function isMouseNearLink(box, callback) {
//   const distance = 30
//   let bool = true;

//   const { bottom, left, right, top } = box

//   document.addEventListener('mousemove', checkDistance, true)

//   function checkDistance(e) {
//     if ( ((e.clientX > right) && (e.clientX - right) > distance) ||
//     ((left > e.clientX) && (left - e.clientX) > distance) ||
//     ((e.clientY > bottom) && (e.clientY - bottom) > distance) ||
//     ((top > e.clientY) && (top - e.clientY) > distance) ) {

//       bool = false;
//       document.removeEventListener('mousemove', checkDistance, true)
//       callback(bool)

//     }
//   }
// }