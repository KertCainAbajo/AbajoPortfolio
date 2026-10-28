import { useState } from 'react'

const Logo = ({ icon }) => <svg viewBox="0 0 24 24" aria-hidden="true"><path d={icon.path} /></svg>

// "Layers of an app": the three tool groups float as a 3D stack. Clicking a layer (or its tab) moves it
// to the top of the stack, and the panel lists that layer's tools with what each one is for.
export default function TechStack({ groups }) {
  const [active, setActive] = useState(0)
  const group = groups[active]
  // Stack position: the chosen layer sits on top (0), the others keep their order underneath
  const place = (i) => (i === active ? 0 : i < active ? i + 1 : i)

  return (
    <div className="layers">
      <div className="layers-visual reveal" aria-hidden="true">
        <div className="layers-float">
          <div className="layers-scene">
            {groups.map((g, i) => (
              <div className="layer-plate" key={g.name} data-on={active === i || undefined} style={{ '--p': place(i), '--n': groups.length }} onClick={() => setActive(i)}>
                {g.items.map(([name, icon]) => <span className="plate-logo" key={name} style={{ '--brand': `#${icon.hex}` }}><Logo icon={icon} /></span>)}
              </div>
            ))}
          </div>
        </div>
        <span className="layers-caption">{String(active + 1).padStart(2, '0')} · {group.plain}</span>
      </div>

      <div className="card layers-panel reveal" style={{ '--d': '120ms' }}>
        <div className="layers-tabs" role="tablist" aria-label="Tool groups">
          {groups.map((g, i) => (
            <button type="button" role="tab" aria-selected={active === i} className="layers-tab" data-on={active === i || undefined} key={g.name} onClick={() => setActive(i)}>
              <span className="icon-tile">{g.icon}</span>
              <span className="layers-tab-copy"><b>{g.name}</b></span>
              <em>{g.items.length}</em>
            </button>
          ))}
        </div>
        <div className="layers-tools" role="tabpanel" key={active}>
          {group.items.map(([name, icon, use], k) => (
            <div className="tool-tile" key={name} style={{ '--k': k, '--brand': `#${icon.hex}` }}>
              <span className="tool-logo"><Logo icon={icon} /></span>
              <span className="tool-copy"><b>{name}</b><small>{use}</small></span>
            </div>
          ))}
        </div>
        <p className="layers-foot">{groups.reduce((sum, g) => sum + g.items.length, 0)} tools across {groups.length} layers · pick a layer to lift it out</p>
      </div>
    </div>
  )
}
