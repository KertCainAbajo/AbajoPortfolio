import Lenis from 'lenis'
import 'lenis/dist/lenis.css'

let lenis = null

// Extra offset on top of the CSS scroll-padding/scroll-margin (which Lenis already applies): clears the fixed mobile header
const scrollOffset = () => (window.matchMedia("(max-width: 760px)").matches ? -30 : 0)

// Lenis eases wheel/trackpad scrolling and in-page "#section" links.
// Skipped for visitors who ask for reduced motion: they keep native scrolling.
export function initSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {}
  lenis = new Lenis({
    autoRaf: true,
    lerp: 0.1,
    wheelMultiplier: 1,
    anchors: { offset: scrollOffset(), duration: 1.2 },
    // Let inner scroll areas (sidebar nav, GitHub year list, textarea) scroll natively
    allowNestedScroll: true,
  })
  return () => {
    lenis?.destroy()
    lenis = null
  }
}

// Freeze/unfreeze page scrolling (e.g. while a dialog is open); native scrolling inside the dialog still works
export function setSmoothScrollPaused(paused) {
  if (!lenis) return
  if (paused) lenis.stop()
  else lenis.start()
}

// Gentle start and finish (Lenis' default curve launches at full speed and crawls to a stop)
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

// Smoothly scroll to a page position in px (falls back to native smooth scrolling without Lenis)
export function scrollToY(y, duration = 1.1) {
  if (lenis) lenis.scrollTo(y, { duration, easing: easeInOutCubic, force: true })
  else window.scrollTo({ top: y, behavior: 'smooth' })
}

// Smoothly scroll to a section by id (falls back to native scrolling without Lenis)
export function scrollToSection(id) {
  const target = document.getElementById(id)
  if (!target) return
  if (lenis) lenis.scrollTo(target, { offset: scrollOffset(), duration: 1.2 })
  else target.scrollIntoView({ behavior: 'smooth' })
}
