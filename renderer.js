var jsonfile      = require('jsonfile');
var path          = require('path');
var uuid          = require('uuid');
var bookmarks     = path.join(__dirname, 'bookmarks.json');

var back, forward, backOrForward, omni, omnibox, webView;
var cancelNavBtn, backNavBtn, forwardNavBtn, overlayNav; 
var overlayOmnibox, refreshOmniBtn, searchOmniBtn, bookmarkOmniBtn, newUrlOmniBtn, 
tabsOmniBtn, closeOmniBtn, cancelOmniBtn;
var overlayOptions, bookmarksBtn, zoomInBtn, zoomOutBtn, aboutBtn, cancelOptionsBtn;

var byId = (id) => {
  return document.getElementById(id);
}

back = byId('backBtn')
forward = byId('forwardBtn')
omni = byId('url')
webView = byId('webview')

back.addEventListener('click', goBack);  
forward.addEventListener('click', goForward);
omni.addEventListener('keydown', sanitiseUrl);  
webView.addEventListener('did-start-loading', updateOmnibox);

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

function updateOmnibox (event) {    
  let loader = byId('loader');
  let favicon = byId('favicon');

  const loadStart = () => {
    favicon.style.display="none";
    loader.style.display = "block";
    omni.value = 'Loading..';
  }

  const loadStop = () => {
    favicon.style.display="block"
    loader.style.display = "none";
    omni.value = webView.getTitle();
    // omni.value = webView.src;
  }

  webView.addEventListener('did-start-loading', loadStart)
  webView.addEventListener('did-stop-loading', loadStop)
}

// ============= DWELL =============

var dwell = (elem, callback) => {
  let timeout = null
  elem.onmouseover = () => {
    timeout = setTimeout(callback, 800)
  };

  elem.onmouseout = () => {
    clearTimeout(timeout)
  }
};

// ======== HIDE ALL OVERLAYS ========

function hideAllOverlays() {
  overlayNav = byId('overlay-nav')
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

dwell(backOrForward, () => {
  hideAllOverlays()
  overlayNav = byId('overlay-nav')
  overlayNav.style.display = 'grid'
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

dwell(omnibox, () => {
  hideAllOverlays()
  overlayOmnibox = byId('overlay-omnibox')
  overlayOmnibox.style.display = 'grid'
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
  overlayOptions = byId('overlay-options')
  overlayOptions.style.display = 'grid'
})

dwell(cancelOptionsBtn, () => {
  overlayOptions.style.display = 'none'
})

// overlayOptions, bookmarksBtn, zoomInBtn, zoomOutBtn, aboutBtn, cancelOptionsBtn