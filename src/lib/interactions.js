// Page-wide micro-interactions:
// - `.reveal` elements fade up once they scroll into view (stagger with the --d custom property)
// - `.card` elements get a soft spotlight that follows the pointer (--mx / --my)
export function initInteractions() {
  const root = document.documentElement
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const targets = () => document.querySelectorAll('.reveal:not(.is-visible)')

  let observer = null
  if (reduced || !('IntersectionObserver' in window)) {
    targets().forEach((el) => el.classList.add('is-visible'))
  } else {
    root.classList.add('reveal-ready')
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 })
    targets().forEach((el) => observer.observe(el))
  }

  // Spotlight position, at most once per frame
  let pending = null
  let queued = false
  const applySpot = () => {
    queued = false
    if (!pending) return
    const { card, x, y } = pending
    const box = card.getBoundingClientRect()
    card.style.setProperty('--mx', `${Math.round(x - box.left)}px`)
    card.style.setProperty('--my', `${Math.round(y - box.top)}px`)
  }
  const onPointer = (event) => {
    const card = event.target.closest?.('.card')
    if (!card) return
    pending = { card, x: event.clientX, y: event.clientY }
    if (!queued) { queued = true; requestAnimationFrame(applySpot) }
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  return () => {
    observer?.disconnect()
    root.classList.remove('reveal-ready')
    window.removeEventListener('pointermove', onPointer)
  }
}
