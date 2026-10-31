// Looping walkthrough of the live UIC IP Management System (ITSO), played from real screenshots of the
// public pages: Home → agree to the IP policy → sign in with Google → the development team page, where
// Kert's card (Quality Assurance) is highlighted. Timing lives in the .idemo keyframes (one shared 16s
// timeline); pointer stops are the real positions of those controls as % of the 1440×900 screen.
const SCENES = ['home', 'welcome', 'login', 'about']
const PATHS = ['/', '/welcome', '/login', '/about']
const STEPS = ['Home', 'Agree to the IP policy', 'Sign in with Google', 'Meet the team']

export function ItsoUrl() {
  return (
    <span className="url cdemo-url">itso.uic.edu.ph<span className="cdemo-paths">{PATHS.map((p, i) => <i key={p} className={`md-on${i}`}>{p}</i>)}</span></span>
  )
}

export default function ItsoDemo() {
  return (
    <div className="device-screen idemo">
      {SCENES.map((name, i) => (
        <div className={`cdemo-scene id-on${i}`} key={name}>
          <img src={`/assets/projects/itso-${name}.webp`} alt="" loading="lazy" decoding="async" draggable="false" />
        </div>
      ))}
      <span className="id-me"><b>My role: Quality Assurance</b></span>
      <span className="cdemo-track id-track"><span className="cdemo-pointer id-pointer"><i className="cdemo-ripple id-ripple" /><svg viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.3L9.6 19z" /></svg></span></span>
      <span className="cdemo-steps id-steps">{STEPS.map((s, i) => <i key={s} className={`cd-step id-step${i}`}><b>{i + 1}</b>{s}</i>)}</span>
    </div>
  )
}
