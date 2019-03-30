const { concat } = require('lodash')
const { dwell } = require('./utils')

let navElements = []

class navItem {
  constructor(name, hasChildren, children) {
    this.name = name
    this.hasChildren = hasChildren
    this.children = children
  }
}

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

let navJson = {}

var buildNavJson = function(parentUlTag) {
    
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
