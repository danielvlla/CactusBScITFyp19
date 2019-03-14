const { ipcRenderer } = require('electron')
const cursor          = require('./js/cursor.js')
const config          = require('./js/config.js')

const dwellTime = config.dwellTime
var c 

// const state = {
//   bounds: c.getBoundingClientRect(),
//   threshold: 50,
//   ratio: 3.5,
//   isMagnetic: false,
//   mouse: {
//     x: 0,
//     y: 0
//   },
//   ease: {
//     x: 0,
//     y: 0,
//     scale: 1,
//     value: 0.2
//   },
//   transform: {
//     x: 0,
//     y: 0,
//     scale: 1,
//     max: 50
//   },
//   width: window.innerWidth,
//   height: window.innerHeight,
//   history: false
// }

// const mouseMove = ({ clientX, clientY }) => {
//   Object.assign(state, {
//     mouse: {
//       x: clientX,
//       y: clientY
//     },
//     isMagnetic: isMagnetic(clientX, clientY)
//   })
// }

// const isMagnetic = (x, y) => {
//   const { bounds } = state
//   const centerX = bounds.left 
// }

document.addEventListener('DOMContentLoaded', () => {
  cursor.createCursor('cursor')
  c = document.querySelector('#cursor')
  cursor.followCursor('cursor')
})

ipcRenderer.on('listenLinks', (event, message) => {
  ipcRenderer.sendToHost(getLinkOnDwell())
})

const getLinkOnDwell = () => {
  const distance = 50
  var cursorLoc
  var hiddenCursor
  var hiddenCursorLoc
  var dwellTimer = 0
  var enteredLink
  var elBounds
  var stoppedCursor = 0
  var enteredBounds = {
    top: null,
    bottom: null,
    right: null,
    left: null,
  }
  var anchorTags

  anchorTags = document.querySelectorAll('a')
  for (var i=0; i<anchorTags.length; i++) {
    anchorTags[i].classList.add('linkMarker')
  }

  document.addEventListener('mousemove', (e) => {
    cursorLoc = c.getBoundingClientRect()
    var el = null

    var elements = document.elementsFromPoint(cursorLoc.x, cursorLoc.y)

    if (elements) {
      el = Array.from(elements).find(e => { 
        return e.tagName === 'A'
      })
      if (el) {
        if (!hiddenCursor) {
          cursor.createCursor('hiddenCursor')
          hiddenCursor = document.getElementById('hiddenCursor')
        }

        el.classList.add('linkDwell')
        elBounds = el.getBoundingClientRect()
        enteredLink = el
        enteredBounds = setDistance(elBounds)
        
        stopAtY = elBounds.top + (elBounds.height / 2)
        stopAtX = elBounds.left + (elBounds.width / 2)
        cursor.stopCursor('cursor', stopAtX, stopAtY)
        stoppedCursor = 1
        cursor.followCursor('hiddenCursor')

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
          clearDwell()
      }
    }

    if (stoppedCursor) {
      hiddenCursorLoc = hiddenCursor.getBoundingClientRect()
      if (hiddenCursorLoc.x > enteredBounds.right || hiddenCursorLoc.x < enteredBounds.left 
        || hiddenCursorLoc.y < enteredBounds.top || hiddenCursorLoc.y > enteredBounds.bottom) {
          cursor.destroyCursor('hiddenCursor')
          cursor.continueCursor('cursor', e.clientX, e.clientY)
          stoppedCursor = 0
        }
    }
  })

  document.addEventListener('mouseleave', () => {
    clearDwell()
    // Insert Inactivate Mouse Function
  })

  const setDistance = (bounds) => {
    enteredBounds.top = bounds.top - distance
    enteredBounds.right = bounds.right + distance
    enteredBounds.bottom = bounds.bottom + distance
    enteredBounds.left = bounds.left - distance
    return enteredBounds
  }

  const clearDwell = () => {
    if (enteredLink) {
      enteredLink.classList.remove('linkDwell')
      enteredLink = null
    }
    clearTimeout(dwellTimer)
    dwellTimer = 0
  }
}
