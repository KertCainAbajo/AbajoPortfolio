import useTheme from '../hooks/useTheme.js'

// Sun that morphs into a crescent: the rays retract and a masking circle slides over the core.
function SunMoonIcon() {
  return (
    <svg className="sun-moon" viewBox="0 0 24 24" aria-hidden="true">
      <mask id="theme-moon-mask">
        <rect width="24" height="24" fill="#fff" />
        <circle className="sun-moon-bite" cx="16.8" cy="7.6" r="4.8" fill="#000" />
      </mask>
      <circle className="sun-moon-core" cx="12" cy="12" r="6.6" mask="url(#theme-moon-mask)" />
      <g className="sun-moon-rays">
        <path d="M12 1.5v2.2M12 20.3v2.2M1.5 12h2.2M20.3 12h2.2M4.6 4.6l1.5 1.5M17.9 17.9l1.5 1.5M4.6 19.4l1.5-1.5M17.9 6.1l1.5-1.5" />
      </g>
    </svg>
  )
}

export default function ThemeSwitch() {
  const [theme, applyTheme] = useTheme()
  const isDark = theme === 'dark'

  const toggle = (event) => {
    const bounds = event.currentTarget.getBoundingClientRect()
    applyTheme(isDark ? 'light' : 'dark', { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 })
  }

  return (
    <button type="button" role="switch" aria-checked={isDark} aria-label="Dark mode" title={isDark ? 'Switch to light mode' : 'Switch to dark mode'} className={`theme-toggle ${isDark ? 'is-dark' : ''}`} onClick={toggle}>
      <span className="theme-toggle-knob"><SunMoonIcon /></span>
    </button>
  )
}
