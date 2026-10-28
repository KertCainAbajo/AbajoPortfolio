import { useEffect, useState } from 'react'

const COUNT_MS = 1900
const EXIT_MS = 1500
const SHUTTERS = 8
const NAME = 'Kert Cain Abajo'
const RING_R = 92
const RING_LEN = 2 * Math.PI * RING_R

// Rolling odometer digit
function Digit({ value }) {
  return (
    <span className="odo">
      <span className="odo-strip" style={{ transform: `translateY(${-value * 10}%)` }}>
        {Array.from({ length: 10 }, (_, d) => <span key={d}>{d}</span>)}
      </span>
    </span>
  )
}

// 3D intro: glass cube inside orbiting rings over a moving perspective grid. Exit: the camera
// dives through the cube while 3D shutters swing open to reveal the page. Follows the current theme.
export default function Preloader({ onReveal }) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const [phase, setPhase] = useState(reduced ? 'done' : 'count')
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (reduced) { onReveal(); return undefined }
    let frame = 0
    let timer = 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / COUNT_MS)
      const eased = t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      setValue(Math.round(eased * 100))
      if (t < 1) { frame = requestAnimationFrame(tick); return }
      setPhase('exit')
      onReveal()
      timer = window.setTimeout(() => setPhase('done'), EXIT_MS)
    }
    frame = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(frame); window.clearTimeout(timer) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (phase === 'done') return null
  const digits = String(value).padStart(3, '0').split('').map(Number)
  return (
    <div className={`preloader ${phase === 'exit' ? 'is-exit' : ''}`} aria-hidden="true">
      <div className="pre-shutters">{Array.from({ length: SHUTTERS }, (_, i) => <i key={i} style={{ '--s': i }} />)}</div>
      <div className="pre-floor" />
      <div className="pre-sun" />

      <div className="pre-scene">
        <div className="pre-stage">
          <span className="pre-ring ring-1"><b /></span>
          <span className="pre-ring ring-2"><b /></span>
          <span className="pre-ring ring-3"><b /></span>
          <svg className="pre-progress" viewBox="0 0 200 200">
            <defs>
              <linearGradient id="pre-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" className="pre-stop-a" /><stop offset="1" className="pre-stop-b" />
              </linearGradient>
            </defs>
            <circle className="pre-track" cx="100" cy="100" r={RING_R} />
            <circle className="pre-fill" cx="100" cy="100" r={RING_R} style={{ strokeDasharray: RING_LEN, strokeDashoffset: RING_LEN * (1 - value / 100) }} />
          </svg>
          <div className="pre-cube">
            {['front', 'back', 'right', 'left', 'top', 'bottom'].map((face) => <span className={`face face-${face}`} key={face}>{face === 'front' || face === 'back' ? 'KA' : ''}</span>)}
          </div>
        </div>

        <div className="pre-title">
          <span className="pre-name">{[...NAME].map((char, i) => <span key={i} style={{ '--i': i }}>{char === ' ' ? ' ' : char}</span>)}</span>
          <span className="pre-role">Web &amp; Mobile Developer</span>
        </div>
      </div>

      <div className="pre-foot">
        <span className="pre-status"><i /> Loading portfolio</span>
        <span className="pre-count">{digits.map((d, i) => <Digit value={d} key={i} />)}<em>%</em></span>
      </div>
      <div className="pre-bar"><i style={{ transform: `scaleX(${value / 100})` }} /></div>
    </div>
  )
}
