const { ipcRenderer } = require('electron')

ipcRenderer.on('getLinks', () => {
  ipcRenderer.sendToHost(getLinks())
})

function getLinks(){
    var links = [];

    for(var i = 0;i < document.links.length;i++){
        links.push(document.links[i].href);
    }

    return links;
}
