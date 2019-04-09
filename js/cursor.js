var mouse = { x: 0, y: 0 }

window.onload = init;
function init() {
	if (window.Event) {
	document.captureEvents(Event.MOUSEMOVE);
	}
	document.onmousemove = getMouseXY;
}

function getMouseXY(e) {
	mouse.x = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	mouse.y = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}

exports.createCursor = (id) => {
  var cursor = document.createElement('div')
  // cursor.innerHTML = '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="mouse-pointer" class="svg-inline--fa fa-mouse-pointer fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M302.189 329.126H196.105l55.831 135.993c3.889 9.428-.555 19.999-9.444 23.999l-49.165 21.427c-9.165 4-19.443-.571-23.332-9.714l-53.053-129.136-86.664 89.138C18.729 472.71 0 463.554 0 447.977V18.299C0 1.899 19.921-6.096 30.277 5.443l284.412 292.542c11.472 11.179 3.007 31.141-12.5 31.141z"></path></svg>'
  cursor.innerHTML = `
  <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="eye" class="svg-inline--fa fa-eye fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M288 144a110.94 110.94 0 0 0-31.24 5 55.4 55.4 0 0 1 7.24 27 56 56 0 0 1-56 56 55.4 55.4 0 0 1-27-7.24A111.71 111.71 0 1 0 288 144zm284.52 97.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400c-98.65 0-189.09-55-237.93-144C98.91 167 189.34 112 288 112s189.09 55 237.93 144C477.1 345 386.66 400 288 400z"></path></svg>`
  cursor.setAttribute('id', id)
  cursor.style.width = '3%'
  cursor.style.height = '3%'
  cursor.style.color = "#545359"
  cursor.style.opacity = '0.3'
  cursor.style.zIndex = '1000'
  cursor.style.position = 'absolute'

  // if (!id.localeCompare('hiddenCursor')) {
  //   cursor.style.opacity = 0
  // }

  document.body.appendChild(cursor);
}

exports.followCursor = (id) => {
  var cursor = document.getElementById(id)
  document.addEventListener('mousemove', getMouseXY, true)

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
