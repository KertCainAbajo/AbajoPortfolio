import { useEffect, useRef, useState } from 'react'
import useTheme from '../hooks/useTheme.js'

// A chibi face on the knob: awake in light mode, asleep in dark mode.
function Chibi() {
  return (
    <svg className="chibi" viewBox="0 0 32 32" aria-hidden="true">
      <circle className="chibi-face" cx="16" cy="18" r="10.5" />
      <path className="chibi-hair" d="M5.6 18.5C5 10.4 10 5 16 5s11 5.4 10.4 13.5l-2.6-4.6-1.6 3.1-2-5.2-2.4 4.1-1.9-4.7-2.1 4.7-2.4-4.1-1.8 5.2-1.8-3.1z" />
      <path className="chibi-tuft" d="M16 5.2c.4-2.2 2-3.4 3.8-3.2-1.6.7-2.4 1.8-2.6 3.4" />
      <g className="chibi-awake">
        <ellipse cx="12.3" cy="19.6" rx="1.7" ry="2.3" />
        <ellipse cx="19.7" cy="19.6" rx="1.7" ry="2.3" />
        <circle className="chibi-shine" cx="12.9" cy="18.7" r=".65" />
        <circle className="chibi-shine" cx="20.3" cy="18.7" r=".65" />
        <path className="chibi-line" d="M14.6 23.6q1.4 1.3 2.8 0" />
      </g>
      <g className="chibi-asleep">
        <path className="chibi-line" d="M10.4 19.8q1.9 1.6 3.8 0M17.8 19.8q1.9 1.6 3.8 0" />
        <circle className="chibi-mouth" cx="16" cy="23.9" r=".8" />
      </g>
      <ellipse className="chibi-blush" cx="10.3" cy="22.2" rx="1.6" ry=".9" />
      <ellipse className="chibi-blush" cx="21.7" cy="22.2" rx="1.6" ry=".9" />
    </svg>
  )
}

export default function ThemeSwitch() {
  const [theme, applyTheme] = useTheme()
  const [switching, setSwitching] = useState(false)
  const [bubble, setBubble] = useState(null)
  const timers = useRef([])
  const isDark = theme === 'dark'

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  const toggle = (event) => {
    const next = isDark ? 'light' : 'dark'
    const bounds = event.currentTarget.getBoundingClientRect()
    timers.current.forEach(window.clearTimeout)
    setSwitching(true)
    setBubble(next === 'dark' ? 'おやすみ…' : 'おはよう！')
    applyTheme(next, { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 })
    timers.current = [
      window.setTimeout(() => setSwitching(false), 700),
      window.setTimeout(() => setBubble(null), 1500),
    ]
  }

  return (
    <span className="chara-switch-wrap">
      <button type="button" role="switch" aria-checked={isDark} aria-label="Dark mode" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} className={`chara-switch ${isDark ? 'is-dark' : ''} ${switching ? 'is-switching' : ''}`} onClick={toggle}>
        <span className="switch-sky" aria-hidden="true"><i /><i /><i /></span>
        <span className="switch-sparkle" aria-hidden="true">✦</span>
        <span className="switch-thumb" aria-hidden="true">
          <Chibi />
          <span className="switch-zzz"><b>z</b><b>z</b></span>
        </span>
      </button>
      {bubble && <span className="switch-bubble" key={bubble} lang="ja" aria-hidden="true">{bubble}</span>}
    </span>
  )
}
