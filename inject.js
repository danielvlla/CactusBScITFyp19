const { ipcRenderer } = require('electron')

ipcRenderer.on('getLinks', () => {
  ipcRenderer.sendToHost(getLinks())
})

ipcRenderer.on('listenLinks', () => {
  ipcRenderer.send(addListeners())
})

function getLinks(){
    var links = [];

    for(var i = 0;i < document.links.length;i++){
        links.push(document.links[i].href);
    }

    return links;
}

function addListeners() {
  var anchors = document.getElementsByTagName('a');
  return getLink(anchors)
}

var getLink = (elements, callback) => {
  for (var i=0; i< elements.length; i++) {
    var timeout;

    elements[i].addEventListener('mouseover', (e) => {
      timeout = setTimeout(() => {
        if (e.target.tagName.toLowerCase() === 'a') {
          console.log(e.target.href)
          return e.target.href
        } else if (e.target.parentNode.tagName.toLowerCase() === 'a') {
          return e.target.parentNode.href
        } else {
          console.log(e)
        }
      }, 1000)
    })

  elements[i].addEventListener('mouseout', () => {
    clearTimeout(timeout);
  })
}
}
