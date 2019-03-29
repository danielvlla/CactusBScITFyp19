var mouse = { x: 0, y: 0 }

function getMouse(e) {
  mouse.x = e.clientX
  mouse.y = e.clientY
}

exports.createCursor = (id) => {
  var cursor = document.createElement('div')
  cursor.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="mouse-pointer" class="svg-inline--fa fa-mouse-pointer fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M302.189 329.126H196.105l55.831 135.993c3.889 9.428-.555 19.999-9.444 23.999l-49.165 21.427c-9.165 4-19.443-.571-23.332-9.714l-53.053-129.136-86.664 89.138C18.729 472.71 0 463.554 0 447.977V18.299C0 1.899 19.921-6.096 30.277 5.443l284.412 292.542c11.472 11.179 3.007 31.141-12.5 31.141z"></path></svg>'
  cursor.setAttribute('id', id)
  cursor.style.width = '1%'
  cursor.style.height = '1%'
  cursor.style.color = "#1a1a26"
  cursor.style.zIndex = '1000'
  cursor.style.position = 'absolute'

  if (!id.localeCompare('hiddenCursor')) {
    cursor.style.opacity = 0
  }

  document.body.appendChild(cursor);
}

exports.followCursor = (id) => {
  var cursor = document.getElementById(id)
  document.addEventListener('mousemove', getMouse, true)

  var cursorPos = { x: 0, y: 0 }

  // Increase interval to make it slower
  setInterval(followMouse, 30)

  function followMouse() {
    var distX = mouse.x - cursorPos.x
    var distY = mouse.y - cursorPos.y

    cursorPos.x += distX / 10
    cursorPos.y += distY / 10

    cursor.style.left = cursorPos.x + 'px'
    cursor.style.top = cursorPos.y + 'px'
  }
}

exports.stopCursor = (id, x, y) => {
  var cursor = document.getElementById(id)
  document.removeEventListener('mousemove', getMouse, true)
  cursor.style.left = x + 'px'
  cursor.style.top = y + 'px'
}

exports.continueCursor = (id, x, y) => {
  var cursor = document.getElementById(id)
  document.addEventListener('mousemove', getMouse, true)

  cursor.style.left = x + 'px'
  cursor.style.top = y + 'px'
}

exports.destroyCursor = (id) => {
  var cursor = document.getElementById(id)
  cursor.parentNode.removeChild(cursor)
}
