// Looping walkthrough of the live Jeny Crochet shop, played from real screenshots of the deployed site:
// Home → Shop (scrolls the catalogue) → a product → Add to cart → Custom orders. Timing lives in the
// .cdemo keyframes (one shared 18s timeline), positions are the real button spots as % of the screen.
const SCENES = ['home', 'shop', 'product', 'custom']
const PATHS = ['/home', '/shop', '/product/amigurumi-mushroom', '/custom-orders']
const STEPS = ['Browse', 'Pick a piece', 'Add to cart', 'Custom order']

export function CrochetUrl() {
  return (
    <span className="url cdemo-url">jeny-crochet.onrender.com<span className="cdemo-paths">{PATHS.map((p, i) => <i key={p} className={`cd-on${i}`}>{p}</i>)}</span></span>
  )
}

export default function CrochetDemo() {
  return (
    <div className="device-screen cdemo">
      {SCENES.map((name, i) => (
        <div className={`cdemo-scene cd-on${i}`} key={name}>
          <img src={`/assets/projects/crochet-${name}.webp`} alt="" loading="lazy" decoding="async" draggable="false" />
        </div>
      ))}
      <span className="cdemo-badge">1</span>
      <span className="cdemo-toast"><b>✓</b> Added to cart</span>
      <span className="cdemo-track"><span className="cdemo-pointer"><i className="cdemo-ripple" /><svg viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.3L9.6 19z" /></svg></span></span>
      <span className="cdemo-steps">{STEPS.map((s, i) => <i key={s} className={`cd-step cd-on${i}`}><b>{i + 1}</b>{s}</i>)}</span>
    </div>
  )
}
