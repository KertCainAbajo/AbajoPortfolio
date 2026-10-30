// Looping walkthrough of the live Unified SmartPOS online shop (Aling Nena Mini Mart), played from real
// screenshots: storefront → add a product to the basket → choose delivery → search the catalogue.
// Timing lives in the .pdemo keyframes (one shared 16s timeline); pointer stops are the real positions
// of those controls as % of the 1440×900 screen.
const SCENES = ['store', 'added', 'delivery', 'search']
const STEPS = ['Browse the store', 'Add to basket', 'Choose delivery', 'Search products']

export default function PosDemo() {
  return (
    <div className="device-screen pdemo">
      {SCENES.map((name, i) => (
        <div className={`cdemo-scene pd-on${i}`} key={name}>
          <img src={`/assets/projects/pos-${name}.webp`} alt="" loading="lazy" decoding="async" draggable="false" />
        </div>
      ))}
      <span className="cdemo-track pd-track"><span className="cdemo-pointer pd-pointer"><i className="cdemo-ripple pd-ripple" /><svg viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.3L9.6 19z" /></svg></span></span>
      <span className="cdemo-steps pd-steps">{STEPS.map((s, i) => <i key={s} className={`cd-step pd-step${i}`}><b>{i + 1}</b>{s}</i>)}</span>
    </div>
  )
}
