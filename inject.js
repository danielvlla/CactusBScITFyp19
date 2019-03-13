const { ipcRenderer } = require('electron')
const cursor          = require('./js/cursor.js')

const dwellTime = 2000;
var c

document.addEventListener('DOMContentLoaded', () => {
  cursor.createCursor()
  cursor.followCursor()
  c = document.querySelector('#cursor')
})

ipcRenderer.on('listenLinks', (event, message) => {
  ipcRenderer.sendToHost(getLinkOnDwell())
})

function getLinkOnDwell() {
  var cursorLoc
  var dwellTimer = 0
  var enteredLink
  var enteredBounds
  var distance = 20

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
        const elBounds = el.getBoundingClientRect()
        enteredLink = el
        enteredBounds = elBounds
        console.log(enteredBounds)
        el.classList.add('linkDwell')
        if (!dwellTimer) {
          dwellTimer = setTimeout(() => {
            return ipcRenderer.send('getLink', el.href)
          }, dwellTime)
        }
      }
    }

    if (enteredLink) {
      if (cursorLoc.x > enteredBounds.right 
        || cursorLoc.x < enteredBounds.left 
        || cursorLoc.y < enteredBounds.top 
        || cursorLoc.y > enteredBounds.bottom) {
          enteredLink.classList.remove('linkDwell')
          clearTimeout(dwellTimer)
          dwellTimer = 0
      }
    }
  })
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