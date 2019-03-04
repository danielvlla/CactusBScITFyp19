var fs = require('fs')

var back, forward, backOrForward, omni, omnibox, webView;
var cancelNavBtn, backNavBtn, forwardNavBtn, overlayNav;
var overlayOmnibox, refreshOmniBtn, searchOmniBtn, bookmarkOmniBtn, newUrlOmniBtn, tabsOmniBtn, closeOmniBtn, cancelOmniBtn;
var overlayOptions, bookmarksBtn, zoomLevel, zoomInBtn, zoomOutBtn, aboutBtn, cancelOptionsBtn;
var overlaySearchBox, cancelSearchBtn, submitSearchBtn, inputSearchBox;
var scrollUpBtn, scrollDownBtn;
var dialog, dialogMessage, dialogErrorIcon, dialogSuccessIcon;

var byId = (id) => {
  return document.getElementById(id);
}

back = byId('backBtn')
forward = byId('forwardBtn')
omni = byId('url')
webView = byId('webview')
dialog = byId('dialog')
dialogMessage = byId('dialogMessage')
dialogErrorIcon = byId('dialogError')
dialogSuccessIcon = byId('dialogSuccess')
scrollUpBtn = byId('scroll-up')
scrollDownBtn = byId('scroll-down')

webView.addEventListener('dom-ready', () => {
  webView.openDevTools();
})

back.onclick = goBack
forward.onclick = goForward
omni.addEventListener('keydown', sanitiseUrl)
omni.onclick = displayUrl
webView.addEventListener('did-start-loading', loadingOmnibox)
webView.addEventListener('dom-ready', scroller())

// Sanitises URL
function sanitiseUrl (event) {
  if (event.keyCode === 13) {
      omni.blur();
      let val = omni.value;
      let https = val.slice(0, 8).toLowerCase();
      let http = val.slice(0, 7).toLowerCase();
      if (https === 'https://') {
        webView.loadURL(val);
      } else if (http === 'http://') {
        webView.loadURL(val);
      } else {
        webView.loadURL('http://'+ val);
      }
  }
}

// =================================
// BROWSER FUNCTIONALITY
// =================================
function reload() {
  hideAllOverlays()
  webView.reload();
}

function goBack() {
  hideAllOverlays()
  webView.goBack();
}

function goForward() {
  hideAllOverlays()
  webView.goForward();
}

function loadingOmnibox() {
  let loader = byId('loader');
  let favicon = byId('favicon');

  const loadStart = () => {
    favicon.style.display="none";
    loader.style.display = "block";
    omni.value = 'Loading..';
  }

  const loadStop = () => {
    favicon.style.display="block"
    loader.style.display = "none"
    omni.value = webView.getTitle()
    // omni.value = webView.src;
  }

  webView.addEventListener('did-start-loading', loadStart)
  webView.addEventListener('did-stop-loading', loadStop)
}

function displayUrl() {
  omni.value = webView.src;
}

function scroller() {
  var timeoutSroll;
  scrollUpBtn.onmouseover = () => {
    timeoutScroll = setInterval(() => {
      webView.executeJavaScript('document.documentElement.scrollBy(0, -10)');
    }, 20)
  }

  scrollUpBtn.onmouseout = () => {
    if (timeoutScroll) {
      clearInterval(timeoutScroll)
    }
  }

  scrollDownBtn.onmouseover = () => {
    timeoutScroll = setInterval(() => {
      webView.executeJavaScript('document.documentElement.scrollBy(0, 10)');
    }, 20)
  }

  scrollDownBtn.onmouseout = () => {
    if (timeoutScroll) {
      clearInterval(timeoutScroll)
    }
  }
}

// ============= DWELL =============
let dwellTime = 1000;

var dwell = (elem, callback) => {
  let timeout = null
  elem.onmouseover = () => {
    timeout = setTimeout(callback, dwellTime)
  };

  elem.onmouseout = () => {
    clearTimeout(timeout)
  }
};

// ======== HIDE ALL OVERLAYS ========

function hideAllOverlays() {
  overlayNav.style.display = 'none'
  overlayOmnibox = byId('overlay-omnibox')
  overlayOmnibox.style.display = 'none'
  overlayOptions = byId('overlay-options')
  overlayOptions.style.display = 'none'
}

// ======== NAVIGATION OVERLAY ========
backOrForward = byId('backOrForwardBtn')
cancelNavBtn = byId('cancel-nav')
backNavBtn = byId('goBackBtn')
forwardNavBtn = byId('goForwardBtn')
overlayNav = byId('overlay-nav')

dwell(backOrForward, () => {

  hideAllOverlays()

  if(!webView.canGoBack() && webView.canGoForward()) {
    overlayNav.id = 'overlay-nav-forward-only'
    backNavBtn.style.display = 'none'
    forwardNavBtn.style.display = 'flex'
    overlayNav = byId('overlay-nav-forward-only')
    overlayNav.style.display = 'grid'
  } else if (!webView.canGoForward() && webView.canGoBack()) {
    overlayNav.id = 'overlay-nav-back-only'
    backNavBtn.style.display = 'flex'
    forwardNavBtn.style.display = 'none'
    overlayNav = byId('overlay-nav-back-only')
    overlayNav.style.display = 'grid'
  } else if (webView.canGoBack() && webView.canGoForward()) {
    overlayNav.id = 'overlay-nav'
    backNavBtn.style.display = 'flex'
    forwardNavBtn.style.display = 'flex'
    overlayNav = byId('overlay-nav')
    overlayNav.style.display = 'grid'
  } else {
    backOrForward.classList.add('shake')

    backOrForward.addEventListener('webkitAnimationEnd', () => {
      backOrForward.classList.remove('shake')
    })

    overlayNav.style.display = 'none'
  }
})

dwell(cancelNavBtn, () => {
  overlayNav.style.display = 'none'
})

dwell(backNavBtn, goBack)

dwell(forwardNavBtn, goForward)

// ======== OMNIBOX OVERLAY ========
omnibox = byId('omnibox')
refreshOmniBtn = byId('refreshPageBtn')
cancelOmniBtn = byId('cancel-omni')
searchOmniBtn = byId('searchBtn')

dwell(omnibox, () => {
  hideAllOverlays()
  overlayOmnibox = byId('overlay-omnibox')
  overlayOmnibox.style.display = 'grid'
})

// SEARCH
cancelSearchBtn = byId('cancel-search')
submitSearchBtn = byId('submit-search')

dwell(searchOmniBtn, () => {
  hideAllOverlays()
  overlaySearchBox = byId('overlay-search')
  overlaySearchBox.style.display="grid"
  inputSearchBox = byId('searchText')
  inputSearchBox.focus();
})

dwell(submitSearchBtn, () => {
  hideAllOverlays()
  inputSearchBox = byId('searchText')
  overlaySearchBox.style.display="none"
  webView.src = "https://www.google.com/search?q=" + inputSearchBox.value;
})

dwell(cancelSearchBtn, () => {
  overlaySearchBox.style.display = 'none'
})

dwell(refreshOmniBtn, reload)

dwell(cancelOmniBtn, () => {
  overlayOmnibox.style.display = 'none'
})

// ======== OPTIONS OVERLAY ========
options = byId('menuBtn')
cancelOptionsBtn = byId('cancel-options')

dwell(options, () => {
  hideAllOverlays()
  overlayOptions.style.display = 'none'
  overlayOptions = byId('overlay-options')
  overlayOptions.style.display = 'grid'
})

dwell(cancelOptionsBtn, () => {
  overlayOptions.style.display = 'none'
})

// ======== BOOKMARKS ========
bookmarkOmniBtn = byId('bookmarkPageBtn')

dwell(bookmarkOmniBtn, () => {
  fs.readFile('bookmarks.json', 'utf8', (err, data) => {
    var bookmark = { url: webView.src, name: webView.getTitle() };

    if (err) {
      console.log(err)
    } else {
      var bookmarks = JSON.parse(data)
      var exists = false;

      for(i=0; bookmarks.bookmarks.length > i; i++) {
        if (bookmarks.bookmarks[i].url === bookmark.url) {
          exists = true;
        }
      }

      if (!exists) {
        bookmarks.bookmarks.push(bookmark)
        bookmarksJson = JSON.stringify(bookmarks)
        fs.writeFile('bookmarks.json', bookmarksJson, 'utf8', (err) => {
          if (err) throw err
        })
        dialogMessage.innerHTML = 'Bookmark added succesfully!'
        dialogErrorIcon.style.display = 'none'
        dialogSuccessIcon.style.display = 'block'
      } else {
        dialogSuccessIcon.style.display = 'none'
        dialogMessage.innerHTML = 'Bookmark already exists!'
        dialogErrorIcon.style.display = 'block'
      }
    }
  })

  hideAllOverlays()
  dialog.style.display = 'flex'
  setTimeout(() => {
    dialog.classList.add('fadeOutDown')
  }, 3000);

  setTimeout(() => {
    dialog.style.display = 'none'
    dialog.classList.remove('fadeOutDown')
  }, 3600);
})

webview.addEventListener('dom-ready', () => {
  // webView.send('getLinks')
  webView.send('listenLinks')
  webView.addEventListener('ipc-message', (e) => {
    console.log(e.returnValue)
  })
})
