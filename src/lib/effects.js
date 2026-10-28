// Motion layer: custom cursor, magnetic buttons, 3D tilt, depth parallax, stat counters,
// scroll progress and the velocity-driven statement band. Everything is skipped for reduced motion.
export function initEffects() {
  const root = document.documentElement
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const cleanups = []
  const on = (target, type, fn, opts) => { target.addEventListener(type, fn, opts); cleanups.push(() => target.removeEventListener(type, fn, opts)) }

  // Scroll progress bar
  const bar = document.querySelector('.scroll-progress')
  const onScroll = () => {
    const max = root.scrollHeight - window.innerHeight
    if (bar) bar.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`
  }
  on(window, 'scroll', onScroll, { passive: true })
  onScroll()

  // Stat counters count up the first time they scroll into view
  const counters = document.querySelectorAll('[data-count]')
  if (reduced) {
    counters.forEach((el) => { el.textContent = el.dataset.count })
  } else {
    counters.forEach((el) => { el.textContent = '00' })
    const io = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      io.unobserve(entry.target)
      const el = entry.target
      const target = Number(el.dataset.count)
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 1600)
        el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 4)))).padStart(2, '0')
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }), { threshold: 0.6 })
    counters.forEach((el) => io.observe(el))
    cleanups.push(() => io.disconnect())
  }

  // Scroll-scrubbed text: words light up as the block passes through the viewport (applied in scrollPass)
  const scrubs = [...document.querySelectorAll('[data-scrub]')]
  if (reduced) scrubs.forEach((el) => el.style.setProperty('--p', String(Number(el.dataset.scrub) + 2)))

  // Section labels decode from random glyphs the first time they appear
  const glyphs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+/<>'
  const scramble = (el) => {
    const text = el.dataset.text
    let frame = 0
    const total = text.length * 2 + 10
    const tick = () => {
      frame += 1
      el.textContent = [...text].map((c, i) => (c === ' ' || frame > i * 2 + 8 ? c : glyphs[(Math.random() * glyphs.length) | 0])).join('')
      if (frame < total) window.setTimeout(tick, 32)
    }
    tick()
  }
  if (!reduced) {
    const scrambleIo = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      scrambleIo.unobserve(entry.target)
      scramble(entry.target)
    }), { threshold: 1 })
    document.querySelectorAll('.scramble').forEach((el) => scrambleIo.observe(el))
    cleanups.push(() => scrambleIo.disconnect())
  }

  // Stacked project cards: as the next card slides over, the pinned one recedes (--stack 0 → 1)
  const stackItems = reduced ? [] : [...document.querySelectorAll('[data-stack] .showcase-item')]
  const stackOn = window.matchMedia('(min-width: 761px)')
  const relayout = () => queueScroll()
  on(window, 'resize', relayout)

  // One scroll-synced pass per frame: read every measurement first, then write every style,
  // so the browser never has to recalculate layout in between.
  const parallaxEls = reduced ? [] : [...document.querySelectorAll('[data-parallax]')]
  let scrollQueued = false
  function scrollPass() {
    scrollQueued = false
    const vh = window.innerHeight
    // read
    const scrubVals = scrubs.map((el) => {
      if (reduced) return null
      const box = el.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (vh * 0.95 - box.top) / (vh * 0.45)))
      return (progress * (Number(el.dataset.scrub) + 2)).toFixed(2)
    })
    const stackBoxes = stackOn.matches ? stackItems.map((el) => el.getBoundingClientRect()) : []
    const paraVals = parallaxEls.map((el) => {
      const box = el.parentElement.getBoundingClientRect()
      if (box.bottom < -200 || box.top > vh + 200) return null
      return ((box.top + box.height / 2 - vh / 2) * Number(el.dataset.parallax)).toFixed(1)
    })
    // write (only when a value actually changed)
    scrubs.forEach((el, i) => { const v = scrubVals[i]; if (v !== null && el.dataset.p !== v) { el.dataset.p = v; el.style.setProperty('--p', v) } })
    stackItems.forEach((el, i) => {
      const box = stackBoxes[i]
      const next = stackBoxes[i + 1]
      // 0 while the next card is still a full card-height below, 1 once it has slid all the way over
      const p = !box || !next ? 0 : Math.min(1, Math.max(0, 1 - (next.top - box.top - 14) / box.height))
      const v = p.toFixed(3)
      if (el.dataset.s !== v) { el.dataset.s = v; el.style.setProperty('--stack', v) }
    })
    parallaxEls.forEach((el, i) => { const v = paraVals[i]; if (v !== null && el.dataset.y !== v) { el.dataset.y = v; el.style.transform = `translate3d(0, ${v}px, 0)` } })
  }
  function queueScroll() { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(scrollPass) } }
  on(window, 'scroll', queueScroll, { passive: true })
  scrollPass()

  if (reduced) return () => cleanups.forEach((fn) => fn())

  // Pause looping CSS animations in sections that are off-screen; they resume as the section scrolls back in
  const sectionIo = new IntersectionObserver((entries) => entries.forEach((entry) => {
    entry.target.classList.toggle('anim-paused', !entry.isIntersecting)
  }), { rootMargin: '150px 0px' })
  document.querySelectorAll('.hero-section, .section-shell, .statement, .quote-section, .contact-section').forEach((el) => sectionIo.observe(el))
  cleanups.push(() => { sectionIo.disconnect(); document.querySelectorAll('.anim-paused').forEach((el) => el.classList.remove('anim-paused')) })

  // Statement band: constant drift, faster and skewed with scroll velocity
  const track = document.querySelector('.statement-track')
  let bandX = 0
  let lastY = window.scrollY
  let velocity = 0
  let half = track ? track.scrollWidth / 2 : 0
  const measureBand = () => { if (track) half = track.scrollWidth / 2 }
  on(window, 'resize', measureBand)

  // Cursor
  const dot = document.querySelector('.cursor-dot')
  const ring = document.querySelector('.cursor-ring')
  const cursor = { x: -100, y: -100, rx: -100, ry: -100 }
  if (finePointer && dot && ring) {
    root.classList.add('has-cursor')
    on(window, 'pointermove', (event) => {
      cursor.x = event.clientX
      cursor.y = event.clientY
      dot.style.transform = `translate3d(${cursor.x}px, ${cursor.y}px, 0)`
      const target = event.target instanceof Element ? event.target : null
      const text = target?.closest('input, textarea')
      const interactive = !text && target?.closest('a, button, [data-magnetic], label')
      ring.classList.toggle('is-hover', Boolean(interactive))
      ring.classList.toggle('is-text', Boolean(text))
      dot.classList.toggle('is-text', Boolean(text))
      root.classList.remove('cursor-away')
    }, { passive: true })
    on(root, 'pointerleave', () => root.classList.add('cursor-away'))
    on(window, 'pointerdown', () => ring.classList.add('is-down'))
    on(window, 'pointerup', () => ring.classList.remove('is-down'))
    cleanups.push(() => root.classList.remove('has-cursor', 'cursor-away'))
  }

  // Depth parallax for floating elements
  const depthEls = [...document.querySelectorAll('[data-depth]')]
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 }
  on(window, 'pointermove', (event) => {
    pointer.x = event.clientX / window.innerWidth - 0.5
    pointer.y = event.clientY / window.innerHeight - 0.5
  }, { passive: true })

  // The band only animates while it is on screen
  let bandVisible = false
  if (track) {
    const bandIo = new IntersectionObserver(([entry]) => { bandVisible = entry.isIntersecting })
    bandIo.observe(track)
    cleanups.push(() => bandIo.disconnect())
  }

  // Per-frame loop: only writes transforms (never reads layout) and skips anything that has settled
  let frame = 0
  const loop = () => {
    if (ring && (Math.abs(cursor.x - cursor.rx) > 0.1 || Math.abs(cursor.y - cursor.ry) > 0.1)) {
      cursor.rx += (cursor.x - cursor.rx) * 0.2
      cursor.ry += (cursor.y - cursor.ry) * 0.2
      ring.style.transform = `translate3d(${cursor.rx.toFixed(1)}px, ${cursor.ry.toFixed(1)}px, 0)`
    }
    if (depthEls.length && (Math.abs(pointer.x - pointer.sx) > 0.0005 || Math.abs(pointer.y - pointer.sy) > 0.0005)) {
      pointer.sx += (pointer.x - pointer.sx) * 0.06
      pointer.sy += (pointer.y - pointer.sy) * 0.06
      for (const el of depthEls) {
        const depth = Number(el.dataset.depth)
        el.style.transform = `translate3d(${(pointer.sx * depth).toFixed(1)}px, ${(pointer.sy * depth).toFixed(1)}px, 0)`
      }
    }
    if (track && half && bandVisible) {
      const y = window.scrollY
      velocity += ((y - lastY) - velocity) * 0.12
      lastY = y
      bandX -= 0.7 + Math.min(Math.abs(velocity), 60) * 0.35
      if (-bandX >= half) bandX += half
      const skew = Math.max(-10, Math.min(10, -velocity * 0.35))
      track.style.transform = `translate3d(${bandX.toFixed(1)}px, 0, 0) skewX(${skew.toFixed(2)}deg)`
    }
    frame = requestAnimationFrame(loop)
  }
  frame = requestAnimationFrame(loop)
  cleanups.push(() => cancelAnimationFrame(frame))

  if (!finePointer) return () => cleanups.forEach((fn) => fn())

  // Magnetic buttons
  document.querySelectorAll('[data-magnetic]').forEach((el) => {
    on(el, 'pointermove', (event) => {
      const box = el.getBoundingClientRect()
      const x = event.clientX - box.left - box.width / 2
      const y = event.clientY - box.top - box.height / 2
      el.style.transform = `translate3d(${x * 0.28}px, ${y * 0.38}px, 0)`
    })
    on(el, 'pointerleave', () => { el.style.transform = '' })
  })

  // 3D tilt
  document.querySelectorAll('[data-tilt]').forEach((el) => {
    const max = Number(el.dataset.tilt) || 8
    on(el, 'pointermove', (event) => {
      const box = el.getBoundingClientRect()
      const px = (event.clientX - box.left) / box.width - 0.5
      const py = (event.clientY - box.top) / box.height - 0.5
      el.style.transform = `perspective(1000px) rotateX(${-py * max}deg) rotateY(${px * max}deg) translateY(-4px)`
    })
    on(el, 'pointerleave', () => { el.style.transform = '' })
  })

  return () => cleanups.forEach((fn) => fn())
}
