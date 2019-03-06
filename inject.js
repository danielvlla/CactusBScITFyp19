const { ipcRenderer } = require('electron')

let dwellTime = 1000;

ipcRenderer.on('listenLinks', (event, message) => {
  ipcRenderer.sendToHost(getLinkOnDwell())
})

function getLinkOnDwell() {
  var anchorTags = document.getElementsByTagName('a')

  for (var i=0; i < anchorTags.length; i++) {
    var timeout;

    anchorTags[i].addEventListener('mouseover', (e) => {
      e.target.classList.add('linkDwell')
      timeout = setTimeout(() => {
        if (e.target.tagName.toLowerCase() === 'a') {
          return ipcRenderer.send('getLink', e.target.href)
        } else if (e.target.parentNode.tagName.toLowerCase() === 'a') {
          return ipcRenderer.send('getLink', e.target.parentNode.href)
        } else {
          console.log(e)
        }
      }, dwellTime)
    })

    anchorTags[i].addEventListener('mouseout', () => {
      clearTimeout(timeout);
    })
  }
}
