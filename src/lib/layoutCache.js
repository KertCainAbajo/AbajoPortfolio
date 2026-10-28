// Document-space geometry, measured once and refreshed only when the page changes size.
// Scroll handlers derive on-screen positions from window.scrollY with arithmetic, so scrolling
// never forces the browser to recalculate style and layout mid-frame.
const listeners = new Set()
let queued = false
let observer = null

function notify() {
  queued = false
  listeners.forEach((fn) => fn())
}

function schedule() {
  if (!queued) { queued = true; requestAnimationFrame(notify) }
}

// Calls fn now and whenever the layout may have moved (content resize, window resize, fonts, load)
export function onLayoutChange(fn) {
  if (!observer) {
    observer = new ResizeObserver(schedule)
    observer.observe(document.body)
    window.addEventListener('resize', schedule)
    window.addEventListener('load', schedule)
    document.fonts?.ready.then(schedule)
  }
  listeners.add(fn)
  fn()
  return () => listeners.delete(fn)
}

// Top of an element in document coordinates, ignoring transforms (so reveal/tilt motion doesn't skew it)
export function docTop(el) {
  let y = 0
  for (let node = el; node; node = node.offsetParent) y += node.offsetTop
  return y
}
