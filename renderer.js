var jsonfile      = require('jsonfile');
var path          = require('path');
var uuid          = require('uuid');
var bookmarks     = path.join(__dirname, 'bookmarks.json');

var byId = (id) => {
  return document.getElementById(id);
}

var back = byId('backBtn'),
    forward = byId('forwardBtn'),
    backOrForward = byId('backOrForwardBtn'),
    omni = byId('url'),
    list = byId('menuBtn'),
    webView = byId('webview');

// =================================
// URL Omnibox
// =================================
function updateURL (event) {  
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
// BOOKMARKS
// =================================

function addBookmark () {  
  let url = webView.src;
  let title = webView.getTitle();
  let bookmark = { id: uuid.v1(), url: url, title: title };
  jsonfile.writeFile(bookmarks, bookmark, { flag: 'a'}, function(err) {
    if (err) console.error(err)
  }) 
};

function openPopUp (event) {  
  let state = popup.getAttribute('data-state');
  if (state === 'closed') {
      popup.innerHTML = '';
      jsonfile.readFile(bookmarks, function(err, obj) {
          if(obj.length !== 0) {
              for (var i = 0; i < obj.length; i++) {
                  let url = obj[i].url;
                  let icon = obj[i].icon;
                  let id = obj[i].id;
                  let title = obj[i].title;
                  let bookmark = new Bookmark(id, url, icon, title);
                  let el = bookmark.ELEMENT();
                  popup.appendChild(el);
              }
          }
              popup.style.display = 'block';
              popup.setAttribute('data-state', 'open');
      });
  } else {
      popup.style.display = 'none';
      popup.setAttribute('data-state', 'closed');
  }
}

// Loads Bookmarked URL in the webview
function handleUrl (event) {  
  if (event.target.className === 'link') {
      event.preventDefault();
      webView.loadURL(event.target.href);
  } else if (event.target.className === 'favicon') {
      event.preventDefault();
      webView.loadURL(event.target.parentElement.href);
  }
}

// =================================
// BASIC BROWSER FUNCTIONALITY 
// =================================

function reloadView() {
  webView.reload();
}

function goBack() {
  webView.goBack();
}

function goForward() {
  webView.goForward();
}

function updateOmnibox (event) {    
  var loader = byId('loader');
  var favicon = byId('favicon');

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

back.addEventListener('click', goBack);  
forward.addEventListener('click', goForward);  
omni.addEventListener('keydown', updateURL);  
list.addEventListener('click', openPopUp);  
webView.addEventListener('did-start-loading', updateOmnibox);

// =================================
// DWELL 
// =================================

var dwell = function (elem, callback) {
  var timeout = null;
  elem.onmouseover = function () {
    timeout = setTimeout(callback, 1000);
  };

  elem.onmouseout = function() {
    clearTimeout(timeout);
  }
};

dwell(backOrForward, function() {
  back.click();
})