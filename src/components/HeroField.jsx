import { useEffect, useRef } from 'react'

const GAP = 30
const RADIUS = 190

// Interactive dot field behind the hero: a slow wave plus a ripple that pushes dots away from the pointer.
export default function HeroField() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let width = 0
    let height = 0
    let points = []
    let frame = 0
    let visible = true
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 }
    let color = '#fafafa'
    const readColor = () => { color = getComputedStyle(document.documentElement).getPropertyValue('--field').trim() || '#fafafa' }

    const resize = () => {
      const box = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = box.width
      height = box.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      points = []
      for (let y = GAP / 2; y < height; y += GAP) for (let x = GAP / 2; x < width; x += GAP) points.push([x, y])
    }

    const draw = (time) => {
      mouse.x += (mouse.tx - mouse.x) * 0.12
      mouse.y += (mouse.ty - mouse.y) * 0.12
      ctx.clearRect(0, 0, width, height)
      ctx.fillStyle = color
      for (const [px, py] of points) {
        const dx = px - mouse.x
        const dy = py - mouse.y
        const dist = Math.hypot(dx, dy) || 1
        const force = Math.max(0, 1 - dist / RADIUS)
        const wave = Math.sin(px * 0.011 + time * 0.0011) * Math.cos(py * 0.013 + time * 0.0009)
        const x = px + (dx / dist) * force * 18
        const y = py + (dy / dist) * force * 18 + wave * 2
        const size = 1.2 + force * 2.2
        ctx.globalAlpha = Math.min(1, 0.13 + wave * 0.07 + force * 0.75)
        ctx.fillRect(x - size / 2, y - size / 2, size, size)
      }
      ctx.globalAlpha = 1
    }

    const loop = (time) => {
      if (visible) draw(time)
      frame = requestAnimationFrame(loop)
    }

    const onMove = (event) => {
      const box = canvas.getBoundingClientRect()
      mouse.tx = event.clientX - box.left
      mouse.ty = event.clientY - box.top
    }
    const onLeave = () => { mouse.tx = -9999; mouse.ty = -9999 }

    readColor()
    resize()
    const themeWatch = new MutationObserver(readColor)
    themeWatch.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    const sizeWatch = new ResizeObserver(resize)
    sizeWatch.observe(canvas)
    const viewWatch = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting })
    viewWatch.observe(canvas)

    if (reduced) {
      draw(0)
    } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onLeave)
      frame = requestAnimationFrame(loop)
    }
    return () => {
      cancelAnimationFrame(frame)
      themeWatch.disconnect(); sizeWatch.disconnect(); viewWatch.disconnect()
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return <canvas className="hero-field" ref={ref} aria-hidden="true" />
}
