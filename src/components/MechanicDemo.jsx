// Looping walkthrough of the live Dexter Auto booking system, played from real screenshots of the
// pages a visitor can reach: Sign in → Create an account → back to Sign in → Forgot password.
// (The booking screens themselves are behind the login.)
// Timing lives in the .mdemo keyframes (one shared 16s timeline); pointer stops are the real
// positions of those controls as % of the 1440×900 screen.
const SCENES = ['login', 'register', 'login', 'forgot']
const PATHS = ['/login', '/register', '/login', '/forgot-password']
const STEPS = ['Sign in', 'Create an account', 'Back to sign in', 'Reset password']

export function MechanicUrl() {
  return (
    <span className="url cdemo-url">dexter-auto.onrender.com<span className="cdemo-paths">{PATHS.map((p, i) => <i key={i} className={`md-on${i}`}>{p}</i>)}</span></span>
  )
}

export default function MechanicDemo() {
  return (
    <div className="device-screen mdemo">
      {SCENES.map((name, i) => (
        <div className={`cdemo-scene md-on${i}`} key={i}>
          <img src={`/assets/projects/mechanic-${name}.webp`} alt="" loading="lazy" decoding="async" draggable="false" />
        </div>
      ))}
      <span className="cdemo-track md-track"><span className="cdemo-pointer md-pointer"><i className="cdemo-ripple md-ripple" /><svg viewBox="0 0 24 24"><path d="M5 3l14 8.5-6.2 1.3L9.6 19z" /></svg></span></span>
      <span className="cdemo-steps md-steps">{STEPS.map((s, i) => <i key={s} className={`cd-step md-step${i}`}><b>{i + 1}</b>{s}</i>)}</span>
    </div>
  )
}
