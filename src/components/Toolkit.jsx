import { useState } from 'react'
import { Code2, Layers3, Smartphone } from 'lucide-react'

const GROUPS = [
  { key: 'backend', label: 'Backend & data', icon: Layers3, names: ['PHP', 'Laravel', 'MySQL', 'MongoDB'], rad: .2, dur: '38s' },
  { key: 'frontend', label: 'Frontend', icon: Code2, names: ['HTML5', 'CSS3', 'JavaScript', 'React', 'TypeScript'], rad: .32, dur: '54s' },
  { key: 'mobile', label: 'Mobile & tools', icon: Smartphone, names: ['Flutter', 'Dart', 'Expo Go', 'Git', 'GitHub', 'Postman', 'phpMyAdmin'], rad: .45, dur: '72s' },
]

// "Tech universe": tools orbit a glowing core, one ring per category. Hovering a legend entry
// lights up that ring; hovering the orbit pauses it so labels can be read.
export default function Toolkit({ techs }) {
  const [focus, setFocus] = useState(null)
  const byName = Object.fromEntries(techs.map((t) => [t.name, t]))
  return (
    <div className="toolkit" data-focus={focus || undefined}>
      <div className="toolkit-legend">
        {GROUPS.map((g, gi) => {
          const Icon = g.icon
          return (
            <button type="button" className="card legend-item reveal" data-on={focus === g.key || undefined} key={g.key} style={{ '--d': `${gi * 90}ms` }}
              onMouseEnter={() => setFocus(g.key)} onMouseLeave={() => setFocus(null)} onFocus={() => setFocus(g.key)} onBlur={() => setFocus(null)}>
              <span className="icon-tile"><Icon size={18} /></span>
              <span className="legend-copy"><strong>{g.label}</strong><small>Ring {gi + 1} · {g.names.length} tools</small></span>
              <span className="legend-logos">{g.names.map((n) => <svg key={n} viewBox="0 0 24 24" aria-hidden="true" style={{ '--brand': `#${byName[n].icon.hex}` }}><path d={byName[n].icon.path} /></svg>)}</span>
            </button>
          )
        })}
        <p className="toolkit-total"><b>16</b> tools I’ve worked with so far.</p>
      </div>

      <div className="orbit-stage reveal" aria-label="Technologies I use">
        <span className="orbit-glow" aria-hidden="true" />
        <div className="orbit-core"><b>KA</b><small>stack</small></div>
        {GROUPS.map((g) => (
          <div className={`orbit-ring ${focus && focus !== g.key ? 'is-dim' : ''} ${focus === g.key ? 'is-lit' : ''}`} key={g.key} style={{ '--rad': g.rad, '--dur': g.dur }}>
            {g.names.map((n, i) => {
              const t = byName[n]
              return (
                <span className="orbit-item" key={n} style={{ '--a': `${(360 / g.names.length) * i + g.rad * 200}deg` }}>
                  <span className="orbit-bubble" style={{ '--brand': `#${t.icon.hex}` }} title={t.name}>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d={t.icon.path} /></svg>
                    <em>{t.name}</em>
                  </span>
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
