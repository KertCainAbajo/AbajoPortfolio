import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

const THEME_COLORS = { light: '#f3f2ed', dark: '#0f0f0f' }
const readTheme = () => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'

// Read-only view of the current theme for components that react to switches.
export function useCurrentTheme() {
  const [theme, setTheme] = useState(readTheme)
  useEffect(() => {
    const observer = new MutationObserver(() => setTheme(readTheme()))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])
  return theme
}

// Theme lives on <html data-theme>; index.html sets it before first paint.
export default function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light')

  // `origin` is the viewport point the new theme grows out of (the switch).
  const applyTheme = (next, origin) => {
    if (next === theme) return
    const root = document.documentElement
    const commit = () => {
      root.dataset.theme = next
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[next])
      try { window.localStorage.setItem('theme', next) } catch { /* storage unavailable */ }
      flushSync(() => setTheme(next))
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduceMotion || !origin) {
      root.classList.add('theme-switching')
      commit()
      window.setTimeout(() => root.classList.remove('theme-switching'), 350)
      return
    }

    const { x, y } = origin
    const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y))
    const transition = document.startViewTransition(commit)
    transition.ready.then(() => {
      root.animate(
        { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
        { duration: 700, easing: 'cubic-bezier(.65, 0, .35, 1)', pseudoElement: '::view-transition-new(root)' },
      )
    }).catch(() => {})
  }

  return [theme, applyTheme]
}
