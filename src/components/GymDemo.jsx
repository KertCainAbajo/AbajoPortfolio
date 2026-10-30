// Looping tour of the live Ironclad gym login screen (a real screenshot of the deployed site):
// the camera eases in on the member QR pass, glides to the feature list, visits the sign-in form,
// then pulls back out. Timing and focus points live in the .gdemo keyframes (one shared 16s timeline).
const CAPTIONS = ['Member pass with a QR code', 'Check in faster at the front desk', 'Sign in with email or Google']

export default function GymDemo() {
  return (
    <div className="device-screen gdemo">
      <img src="/assets/projects/gym-login.webp" alt="" loading="lazy" decoding="async" draggable="false" />
      <span className="gdemo-captions">{CAPTIONS.map((c, i) => <i key={c} className={`gd-cap${i}`}>{c}</i>)}</span>
    </div>
  )
}
