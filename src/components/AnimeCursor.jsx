import { useEffect, useRef } from 'react'

export default function AnimeCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)')
    if (!finePointer.matches) return undefined

    const cursor = cursorRef.current
    let frame = 0
    let visible = false
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    document.body.classList.add('anime-cursor-enabled')

    const animate = () => {
      currentX += (targetX - currentX) * 0.34
      currentY += (targetY - currentY) * 0.34
      cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
      if (Math.abs(targetX - currentX) + Math.abs(targetY - currentY) > 0.2) {
        frame = window.requestAnimationFrame(animate)
      } else {
        currentX = targetX
        currentY = targetY
        cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`
        frame = 0
      }
    }

    const onMove = (event) => {
      targetX = event.clientX
      targetY = event.clientY
      if (!visible) {
        visible = true
        currentX = targetX
        currentY = targetY
        cursor.classList.add('anime-cursor-visible')
      }
      cursor.classList.toggle('anime-cursor-hover', Boolean(event.target.closest('a, button, input, textarea')))
      if (!frame) frame = window.requestAnimationFrame(animate)
    }
    const onLeave = () => {
      visible = false
      cursor.classList.remove('anime-cursor-visible', 'anime-cursor-hover', 'anime-cursor-pressed')
    }
    const onDown = () => cursor.classList.add('anime-cursor-pressed')
    const onUp = () => cursor.classList.remove('anime-cursor-pressed')

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)

    return () => {
      window.cancelAnimationFrame(frame)
      document.body.classList.remove('anime-cursor-enabled')
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  return (
    <div className="anime-cursor" ref={cursorRef} aria-hidden="true">
      <svg className="cursor-arrow" viewBox="0 0 38 48" aria-hidden="true">
        <path className="cursor-arrow-outline" d="M3 2.5v34l9-8 7.5 16 7.5-3.7-7.5-15.8 12-1.2L3 2.5Z" />
        <path className="cursor-arrow-fill" d="M5.5 7.2v23.6l6-5.3 8.2 17.1 4-2-8.1-17 8-.8L5.5 7.2Z" />
        <path className="cursor-arrow-detail" d="m9 15 8 8" />
      </svg>
      <span className="cursor-spark">✦</span>
    </div>
  )
}
