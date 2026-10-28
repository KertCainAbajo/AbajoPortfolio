import { useEffect, useRef } from 'react'
import { Code2, GraduationCap, MapPin, Rocket, Smartphone, Sparkles, UserRound } from 'lucide-react'
import { ScrubText } from './SplitText.jsx'

const FACTS = [
  [MapPin, 'Davao City, Philippines'],
  [GraduationCap, 'BS Information Technology'],
  [Smartphone, 'Web & mobile developer'],
  [Sparkles, 'Open to work'],
]

// Education journey, using the dates from the Education and Leadership sections
const STEPS = [
  ['2023', 'Started BS IT at UIC'],
  ['2023 – 24', 'SITES legislative officer'],
  ['2024 – 25', 'CCS auditor'],
  ['2026', 'Finished my degree'],
]

const STRAP = 92 // resting lanyard length in px (matches .me-strap / .me-hang in CSS)
const clamp = (v, min, max) => Math.min(max, Math.max(min, v))

// Developer pass on a lanyard. Drag it and the strap stretches toward the pointer while the card turns;
// let go and it springs back. A tap (or a fast sideways fling, or Enter/Space) flips it over.
// The physics loop only runs while it's being handled or settling, and only writes transforms.
function DeveloperPass() {
  const rig = useRef(null)
  const strap = useRef(null)
  const hang = useRef(null)
  const flip = useRef(null)
  const api = useRef(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const s = { x: 0, y: 0, vx: 0, vy: 0, ry: 0, vry: 0, side: 0, drag: null, frame: 0 }

    const render = () => {
      const len = Math.hypot(s.x, STRAP + s.y)
      const angle = (-Math.atan2(s.x, STRAP + s.y) * 180) / Math.PI
      strap.current.style.transform = `rotate(${angle.toFixed(2)}deg) scaleY(${(len / STRAP).toFixed(3)})`
      hang.current.style.transform = `translate3d(${s.x.toFixed(1)}px, ${s.y.toFixed(1)}px, 0) rotate(${(angle * 0.85).toFixed(2)}deg)`
      flip.current.style.transform = `rotateY(${s.ry.toFixed(1)}deg) rotateX(${clamp(-s.vy * 0.8, -18, 18).toFixed(1)}deg)`
    }

    const step = () => {
      if (s.drag) {
        // Glide after the pointer (closes 15% of the gap per frame, ~0.3s to catch up) so the
        // stretch builds softly; velocity is the per-frame movement (used for the fling)
        s.vx = (s.drag.tx - s.x) * 0.15
        s.vy = (s.drag.ty - s.y) * 0.15
        s.x += s.vx
        s.y += s.vy
      } else {
        // Soft damped spring back to rest: ~16% overshoot, settles in about 1.5s
        s.vx = (s.vx - s.x * 0.02) * 0.87
        s.vy = (s.vy - s.y * 0.02) * 0.87
        s.x += s.vx
        s.y += s.vy
      }
      // Turn with sideways movement while held; settle on the front (0) or back (180) when free
      const target = s.side * 180 + (s.drag ? clamp(s.x * 0.3, -45, 45) : clamp(s.vx * 2, -30, 30))
      // Gentle turn: a flip takes ~0.4s and overshoots by only a few degrees
      s.vry = (s.vry + (target - s.ry) * 0.022) * 0.8
      s.ry += s.vry
      render()
      const settled = !s.drag && Math.abs(s.x) < 0.3 && Math.abs(s.y) < 0.3 && Math.abs(s.vx) < 0.05 && Math.abs(s.vy) < 0.05 && Math.abs(s.ry - s.side * 180) < 0.3 && Math.abs(s.vry) < 0.05
      if (settled) {
        s.x = s.y = s.vx = s.vy = s.vry = 0
        s.ry = s.side * 180
        render()
        s.frame = 0
        rig.current.removeAttribute('data-live')
        return
      }
      s.frame = requestAnimationFrame(step)
    }
    const wake = () => {
      rig.current.setAttribute('data-live', '')
      if (!s.frame) s.frame = requestAnimationFrame(step)
    }
    const toggle = () => {
      s.side = s.side ? 0 : 1
      if (reduced) { s.ry = s.side * 180; render(); return }
      wake()
    }

    const el = hang.current
    const down = (event) => {
      if (event.button !== 0 || reduced) return
      el.setPointerCapture(event.pointerId)
      s.drag = { px: event.clientX, py: event.clientY, x0: s.x, y0: s.y, tx: s.x, ty: s.y, moved: false }
      wake()
    }
    const move = (event) => {
      const d = s.drag
      if (!d) return
      let tx = d.x0 + event.clientX - d.px
      let ty = d.y0 + event.clientY - d.py
      if (Math.hypot(event.clientX - d.px, event.clientY - d.py) > 5) d.moved = true
      // Rubber band: the further it's pulled, the harder the strap pulls back
      const dist = Math.hypot(tx, ty)
      if (dist > 140) { const k = (140 + (dist - 140) * 0.35) / dist; tx *= k; ty *= k }
      d.tx = tx
      d.ty = Math.max(ty, -STRAP * 0.6)
    }
    const up = (event) => {
      const d = s.drag
      if (!d) return
      if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
      s.drag = null
      if (!d.moved || Math.abs(s.vx) > 14) s.side = s.side ? 0 : 1
      wake()
    }
    el.addEventListener('pointerdown', down)
    el.addEventListener('pointermove', move)
    el.addEventListener('pointerup', up)
    el.addEventListener('pointercancel', up)
    api.current = { toggle, onClick: reduced ? toggle : null }
    render()
    return () => {
      cancelAnimationFrame(s.frame)
      el.removeEventListener('pointerdown', down)
      el.removeEventListener('pointermove', move)
      el.removeEventListener('pointerup', up)
      el.removeEventListener('pointercancel', up)
    }
  }, [])

  const onKey = (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); api.current?.toggle() }
  }

  return (
    <div className="me-badge-wrap reveal" style={{ '--d': '150ms' }}>
      <div className="me-lanyard" ref={rig}>
        <span className="me-strap" ref={strap} aria-hidden="true" />
        <div className="me-hang" ref={hang} role="button" tabIndex={0} aria-label="Developer pass. Press to flip it over." onKeyDown={onKey} onClick={() => api.current?.onClick?.()}>
          <span className="me-clip" aria-hidden="true" />
          <div className="me-card3d">
            <div className="me-flip" ref={flip}>
              <article className="me-badge me-face">
                <header className="me-badge-top"><span className="brand-mark">KA</span><span>Developer pass</span><em>2026</em></header>
                <div className="me-photo"><img src="/assets/1p-cutout.webp" alt="Kert Cain Arvie P. Abajo" loading="lazy" draggable="false" /></div>
                <h3>Kert Cain Arvie P. Abajo</h3>
                <p className="me-role">Web &amp; Mobile Developer</p>
                <dl className="me-fields">
                  <div><dt>Course</dt><dd>BS Information Technology</dd></div>
                  <div><dt>Batch</dt><dd>2023 – 2026</dd></div>
                  <div><dt>Based in</dt><dd>Davao City, PH</dd></div>
                  <div><dt>Status</dt><dd className="me-open"><i />Open to work</dd></div>
                </dl>
                <span className="me-barcode" aria-hidden="true" />
              </article>
              <article className="me-badge me-face me-back" aria-hidden="true">
                <header className="me-badge-top"><span className="brand-mark">KA</span><span>Say hello</span><em>2026</em></header>
                <span className="me-back-mark">KA</span>
                <h3>Thanks for stopping by!</h3>
                <p className="me-role">Let’s build something useful.</p>
                <dl className="me-fields me-back-fields">
                  <div><dt>Email</dt><dd>kertabajo4@gmail.com</dd></div>
                  <div><dt>GitHub</dt><dd>@KertCainAbajo</dd></div>
                  <div><dt>Location</dt><dd>Davao City, Philippines</dd></div>
                </dl>
                <span className="me-barcode" aria-hidden="true" />
              </article>
            </div>
          </div>
        </div>
      </div>
      <span className="me-hint" aria-hidden="true">Drag me · tap to flip</span>
    </div>
  )
}

// Background for the About section: drifting glows, slow rays behind the pass, rising dust, a dot grid
// and a soft light that follows the pointer. Everything moves by transform/opacity only, and the
// section's off-screen pause stops the loops while it isn't visible.
function MeBackdrop() {
  const glow = useRef(null)
  useEffect(() => {
    const el = glow.current
    const area = el.parentElement
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    let frame = 0
    let point = null
    const apply = () => {
      frame = 0
      if (!point) return
      const box = area.getBoundingClientRect()
      el.style.transform = `translate3d(${(point.x - box.left).toFixed(0)}px, ${(point.y - box.top).toFixed(0)}px, 0)`
      el.style.opacity = '1'
    }
    const section = area.closest('section') || area
    const move = (event) => { point = { x: event.clientX, y: event.clientY }; if (!frame) frame = requestAnimationFrame(apply) }
    const leave = () => { point = null; el.style.opacity = '0' }
    section.addEventListener('pointermove', move, { passive: true })
    section.addEventListener('pointerleave', leave)
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', move)
      section.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <div className="me-bg" aria-hidden="true">
      <span className="me-grid" />
      <span className="me-blob b1" /><span className="me-blob b2" /><span className="me-blob b3" />
      <span className="me-rays" />
      <span className="me-dust d1" /><span className="me-dust d2" />
      <span className="me-pointer" ref={glow} />
    </div>
  )
}

// About: the intro and working style on the left, a "developer pass" swinging on a lanyard on the
// right, and the education journey as a timeline underneath.
export default function AboutMe() {
  return (
    <div className="me">
      <MeBackdrop />
      <div className="me-main">
        <article className="card me-intro reveal">
          <span className="card-mesh" aria-hidden="true" />
          <span className="card-kicker"><span className="kicker-icon"><UserRound size={14} /></span>The person</span>
          <ScrubText text="I’m an IT graduate from the University of the Immaculate Conception in Davao City. I enjoy taking slow, paper-heavy processes and turning them into simple apps people actually like using." />
          <div className="me-facts">
            {FACTS.map(([Icon, label], k) => <span className="me-fact" key={label} style={{ '--k': k }}><Icon size={15} />{label}</span>)}
          </div>
        </article>
        <div className="me-pair">
          <article className="card me-note reveal" style={{ '--d': '90ms' }}>
            <span className="me-note-icon"><Code2 size={18} /></span>
            <h3>How I work</h3>
            <p>I work on both what users see and what runs behind it. I test my own work carefully, help out with tech support, and use AI tools to move faster, but I always double-check the result.</p>
          </article>
          <article className="card me-note reveal" style={{ '--d': '180ms' }}>
            <span className="me-note-icon"><Rocket size={18} /></span>
            <h3>What’s next</h3>
            <p>I’m looking for a team where I can keep learning and build tools that save people time. Leading student organizations taught me to listen first, then build.</p>
          </article>
        </div>
      </div>

      <DeveloperPass />

      <article className="card me-journey reveal" style={{ '--d': '120ms' }}>
        <div className="me-journey-head">
          <span className="education-icon"><GraduationCap size={24} /></span>
          <div>
            <span className="card-kicker">Education</span>
            <h3>Bachelor of Science in Information Technology</h3>
            <p>University of the Immaculate Conception · Davao City, Philippines</p>
          </div>
        </div>
        <div className="me-steps">
          <span className="me-steps-line" aria-hidden="true"><i /></span>
          <ol>{STEPS.map(([year, label], k) => <li key={label} style={{ '--k': k }}><span className="me-dot" /><b>{year}</b><span>{label}</span></li>)}</ol>
        </div>
      </article>
    </div>
  )
}
