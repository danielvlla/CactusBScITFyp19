const { concat } = require('lodash')
const { dwell } = require('./utils')

let navElements = []

function getNavElements() {
  var nav = {
    navTags: Array.from(document.querySelectorAll('nav')),
    navDivs: Array.from(document.querySelectorAll('div[role="navigation"]'))
  }
  return nav 
}

var markNavbars = function() {
  var { navDivs, navTags } = getNavElements()

  if (navDivs && navTags) {
    for (var i = 0; i < navTags.length; i++) {
      // If the nav tag is found in a nav div (parent),
      // remove it so we don't have a double marker
      if (navTags[i].closest('div[role="navigation"]')) {
        navTags.splice(i, 1)
      }
    }
    navElements = concat(navDivs, navTags)
  }

  for (i=0; i < navElements.length; i++) {
    navElements[i].classList.add('navMarker')
  }

  return navElements
}

class navItem {
  constructor(id, title, href, parent, children) {
    this.id = id
    this.title = title
    this.href = href
    this.parent = parent
    this.children = children
  }
}

let navItems = [
  
]

let navId = 1;

var buildNavJson = function(element) {
  if (element.tagName == "UL") {
    let listItemsOfRoot = element.children
    var root = new navItem(navId, "", "", 0, listItemsOfRoot)
    navItems.push(root)

    for (var i=0; i < listItemsOfRoot.length; i++) {
      addItemToNavArray(listItemsOfRoot[i], root.id)
    }

    console.log(navItems)
  }
}

function addItemToNavArray(listElement, parentId) {
  let id = navId++
  let title = listElement.innerText
  let parent = parentId
  let children = listElement.children
  let href = listElement.children[0].href

  let ulTag = listElement.getElementsByTagName('ul')
  if(!ulTag) {
    href = listElement.querySelector('a').href
  } else {
    for (var i=0; i < ulTag.length; i++) {
      let nestedLinks = ulTag[i].children
      for (var j=0; j < nestedLinks.length; j++) {
        addItemToNavArray(nestedLinks[j], id)
      }
    }
  }

  let n = new navItem(id, title, href, parent, children)
  navItems.push(n)
  return n
}

function passNavElementOnDwell() {
  dwell(this, () => {
    console.log(this)
    let parentUlTag = this.getElementsByTagName('ul')[0]
    buildNavJson(parentUlTag)
  })
}

module.exports = {
  markNavbars,
  buildNavJson,
  passNavElementOnDwell
}
