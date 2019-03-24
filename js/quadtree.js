let linksArray = []

function getLinks() {
  const links = document.querySelectorAll('a')
  for (var i=0; i<links.length; i++) {
    const linkBounds = links[i].getBoundingClientRect()
    linksArray.push(linkBounds)
  }
}

class Link {
  constructor(x, y, top, left, bottom, right, width, height, centerX, centerY) {
    this.x = x
    this.y = y
    this.top = top
    this.left = left
    this.bottom = bottom
    this.right = right
    this.width = width
    this.height = height
    this.centerX = centerX
    this.centerY = centerY
  }
}

class Rectangle {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  contains(link) {
    return (link.centerX > this.x - this.width/2 &&
      link.centerX < this.x + this.width/2 &&
      link.centerY > this.y - this.height/2 &&
      link.centerY < this.y +this.height/2)
  }
}

class QuadTree {
  constructor(boundary, capacity) {
    this.boundary = boundary
    this.capacity = capacity
    this.links = []
    this.divided = false
  }

  subdivide() {
    let x = this.boundary.x
    let y = this.boundary.y
    let w = this.boundary.width
    let h = this.boundary.height

    let ne = new Rectangle(x+w/4, y-h/4, w/2, h/2)
    this.northeast = new QuadTree(ne, this.capacity)
    let nw = new Rectangle(x-w/4, y-h/4, w/2, h/2)
    this.northwest = new QuadTree(nw, this.capacity)
    let se = new Rectangle(x+w/4, y+h/4, w/2, h/2)
    this.southeast = new QuadTree(se, this.capacity)
    let sw = new Rectangle(x-w/4, y+h/4, w/2, h/2)
    this.southwest = new QuadTree(sw, this.capacity)
    this.divided = true
  }

  insert(link) {
    if (!this.boundary.contains(link)) {
      return
    }

    if (this.links.length < this.capacity) {
      this.links.push(link)
    } else {
      if (!this.divided) {
        this.subdivide()
        this.divided = true
      }

      this.northeast.insert(link)
      this.northwest.insert(link)
      this.southeast.insert(link)
      this.southwest.insert(link)
    }
  }
}

module.exports = {
  Link,
  Rectangle,
  QuadTree 
}
