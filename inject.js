const { ipcRenderer } = require('electron')
const cursor          = require('./js/cursor.js')

const dwellTime = 2000;
var linkTimeout

document.addEventListener('DOMContentLoaded', () => {
  cursor.createCursor()
  cursor.followCursor()
})

ipcRenderer.on('listenLinks', (event, message) => {
  ipcRenderer.sendToHost(getLinkOnDwell())
})

function getLinkOnDwell() {
  var anchorTags = document.getElementsByTagName('a')

  for (var i=0; i < anchorTags.length; i++) {
    var box

    anchorTags[i].classList.add('linkMarker')

    anchorTags[i].addEventListener('mouseover', (e) => {
      e.target.classList.add('linkDwell')
      linkTimeout = setTimeout(() => {
        if (e.target.tagName.toLowerCase() === 'a') {
          return ipcRenderer.send('getLink', e.target.href)
        } else if (e.target.parentNode.tagName.toLowerCase() === 'a') {
          return ipcRenderer.send('getLink', e.target.parentNode.href)
        } else {
          console.log(e)
        }
      }, dwellTime)

    })

    anchorTags[i].addEventListener('mouseout', (e) => {
      box = e.target.getBoundingClientRect();
      isMouseNearLink(box, (bool) => {
        if (!bool) {
          // Stop selection
          e.target.classList.remove('linkDwell')
          clearTimeout(linkTimeout)
        }
      })
      // if mouse is on another element, remove link dwell and clear timeout
    })
  }
}

function isMouseNearLink(box, callback) {
  const distance = 30
  let bool = true;

  const { bottom, left, right, top } = box

  document.addEventListener('mousemove', checkDistance, true)

  function checkDistance(e) {
    if ( ((e.clientX > right) && (e.clientX - right) > distance) ||
    ((left > e.clientX) && (left - e.clientX) > distance) ||
    ((e.clientY > bottom) && (e.clientY - bottom) > distance) ||
    ((top > e.clientY) && (top - e.clientY) > distance) ) {

      bool = false;
      document.removeEventListener('mousemove', checkDistance, true)
      callback(bool)

    }
  }
}


// TEST
//
// const ui = {
//   btn: document.querySelector('.c-magnetic-btn'),
//   label: document.querySelector('.t-btn-label')
// };
//
//
// const state = {
//   bounds: ui.btn.getBoundingClientRect(),
//   threshold: parseInt(ui.btn.dataset.threshold),
//   ratio: parseInt(ui.btn.dataset.ratio),
//   isMagnetic: false,
//   mouse: {
//     x: 0,
//     y: 0 },
//
//   ease: {
//     x: 0,
//     y: 0,
//     scale: 1,
//     value: ui.btn.dataset.ease },
//
//   transform: {
//     x: 0,
//     y: 0,
//     scale: 1,
//     max: ui.btn.dataset.max },
//
//   width: window.innerWidth,
//   height: window.innerHeight,
//   history: false,
//   scale: ui.btn.dataset.scale
// };
//
//
// const mouseMove = ({ pageX, pageY }) => {
//   Object.assign(state, {
//     mouse: {
//       x: pageX,
//       y: pageY },
//
//     isMagnetic: isMagnetic(pageX, pageY) });
//
// };
//
// const resize = () => {
//   Object.assign(state, {
//     bounds: ui.btn.getBoundingClientRect(),
//     width: window.innerWidth,
//     height: window.innerHeight });
//
// };
//
// const isMagnetic = (x, y) => {
//   const { bounds } = state;
//
//   const centerX = bounds.left + bounds.width / 2;
//   const centerY = bounds.top + bounds.height / 2;
//
//   // use pythagorean theorem to calculate
//   // cursor distance from center of btn
//   // a^2 + b^2 = c^2
//   const a = Math.abs(centerX - x);
//   const b = Math.abs(centerY - y);
//   const c = Math.sqrt(a * a + b * b);
//
//   // true if cursor distance from center of btn is
//   // equal to btn radius + threshold
//   const isHover = c < bounds.width / 2 + state.threshold;
//
//   if (!state.history && isHover) {
//     ui.btn.classList.add('is-hover');
//     Object.assign(state, {
//       threshold: state.threshold * state.ratio,
//       history: true });
//
//   } else if (state.history && !isHover) {
//     ui.btn.classList.remove('is-hover');
//     Object.assign(state, {
//       threshold: state.threshold / state.ratio,
//       history: false });
//
//   }
//
//   return isHover;
// };
//
// const run = () => {
//   requestAnimationFrame(run);
//
//   const { isMagnetic, transform, mouse, width, height, ease, max, scale } = state;
//
//   transform.x = isMagnetic ? (mouse.x - width / 2) / width * transform.max : 0;
//   transform.y = isMagnetic ? (mouse.y - height / 2) / height * transform.max : 0;
//   transform.scale = isMagnetic ? scale : 1;
//
//   // basic linear interpolation
//   // https://www.youtube.com/watch?v=yWhgniVHROw
//   ease.x += (transform.x - ease.x) * ease.value;
//   ease.y += (transform.y - ease.y) * ease.value;
//   ease.scale += (transform.scale - ease.scale) * ease.value;
//
//   Object.assign(ui.btn.style, {
//     transform: `
// 			translate(
// 				${ease.x.toFixed(2)}px,
// 				${ease.y.toFixed(2)}px
// 			)
// 			translateZ(0)
// 			scale(
// 				${ease.scale.toFixed(2)}
// 			)` });
//
//
//   Object.assign(ui.label.style, {
//     transform: `
// 			translate(
// 				${(-ease.x / state.ratio).toFixed(2)}px,
// 				${(-ease.y / state.ratio).toFixed(2)}px
// 			)
// 			translateZ(0)
// 			scale(
// 				${(1 / ease.scale).toFixed(2)}
// 			)` });
//
// };
//
// const init = () => {
//   document.addEventListener('mousemove', mouseMove);
//   window.addEventListener('resize', resize);
//   run();
// };
//
// init();
