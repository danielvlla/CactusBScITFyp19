const { ipcRenderer }               = require('electron')
const { byId, dwell }               = require('./js/utils')

ipcRenderer.on('getBookmarks', (event, message) => {
  let bookmarksJson = JSON.parse(message)
  let bookmarksArray = Array.from(bookmarksJson.bookmarks)
  let bookmarkContainer = byId('bookmarksBoxes')

  const markup = `${bookmarksArray.map(bookmark => `
    <div class="bookmarkBox">
      <span class="bookmarkTitle">${bookmark.name}</span>
      <span class="bookmarkLink">${bookmark.url}</span>
    </div>`).join('')}`

  bookmarkContainer.insertAdjacentHTML('beforeend', markup)
  
  let bookmarks = document.querySelectorAll('.bookmarkBox')

  if(bookmarks.length) {
    for (var i = 0; i < bookmarks.length; i++) {
      bookmarks[i].addEventListener('mouseover', loadLink)
    }
  }

  function loadLink() {
    dwell(this, () => {
      ipcRenderer.send('loadBookmark', this.lastElementChild.innerHTML)
    })
  }
})