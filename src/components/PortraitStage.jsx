import { useCurrentTheme } from '../hooks/useTheme.js'

function Sunglasses() {
  return (
    <svg className="prop-shades" viewBox="0 0 120 38" aria-hidden="true">
      <path className="shades-frame" d="M2 6h116v5h-5l-3 14c-1.5 7-6 10-13 10H80c-7 0-11-4-12.5-10L66 15c-1.5-3-10.5-3-12 0l-1.5 10C51 31 47 35 40 35H23c-7 0-11.5-3-13-10L7 11H2z" />
      <path className="shades-lens" d="M12 11h42l-3.2 13.6C49.6 29.4 46.6 31 41 31H23.5c-5.6 0-8.7-1.8-9.8-6.6zM66 11h42l-2.3 13.4c-1.1 4.8-4.2 6.6-9.8 6.6H79c-5.6 0-8.6-1.6-9.8-6.4z" />
      <path className="shades-glint" d="M18 14l10 0-12 14h-3zM72 14l10 0-12 14h-3z" />
    </svg>
  )
}

// Hand pinching the right temple of the glasses; the sleeve runs off to the right.
function PinchHand() {
  return (
    <svg className="shades-hand" viewBox="0 0 120 70" aria-hidden="true">
      <path className="prop-sleeve" d="M66 6 120-2v58L72 46z" />
      <path className="prop-cuff" d="M58 10 70 7l6 39-12 2z" />
      <path className="prop-skin" d="M62 12C50 8 38 10 30 16l-4 14c8 10 24 14 38 14z" />
      <path className="prop-skin" d="M34 15c-10-2-20-1-26 2-5 3-3 9 3 9 7 0 15-2 21-2" />
      <path className="prop-skin" d="M30 28c-8 2-16 4-20 2-4 3-1 8 5 7 9-1 17-1 23 1" />
      <path className="prop-crease" d="M40 22q4 3 8 2M42 31q4 3 9 2" />
    </svg>
  )
}

// Umbrella held from below by a fist; the grip sits at (100, 205) in this viewBox.
function Umbrella() {
  return (
    <svg className="prop-umbrella" viewBox="0 0 240 300" aria-hidden="true">
      <path className="umbrella-shaft" d="M100 14v218c0 14 20 14 20 0" />
      <g className="umbrella-canopy">
        <path className="canopy-fill" d="M8 92C20 40 58 10 100 10s80 30 92 82c-12-9-25-9-37 0-14-10-28-10-41 0-13-10-27-10-41 0-12-9-25-9-37 0z" />
        <path className="canopy-stripe" d="M100 10C82 26 72 56 69 92c-13-10-27-10-41 0C36 46 64 18 100 10zM100 10c18 16 28 46 31 82 13-10 27-10 41 0C164 46 136 18 100 10z" />
        <path className="canopy-line" d="M8 92C20 40 58 10 100 10s80 30 92 82c-12-9-25-9-37 0-14-10-28-10-41 0-13-10-27-10-41 0-12-9-25-9-37 0zM100 10c-18 16-28 46-31 82M100 10c18 16 28 46 31 82" />
        <circle className="canopy-tip" cx="100" cy="8" r="5" />
      </g>
      <path className="prop-sleeve" d="M112 214 132 196l108 66v38h-44z" />
      <path className="prop-cuff" d="M106 220 128 200l10 8-22 20z" />
      <path className="prop-skin" d="M84 196c-4 0-6 3-6 7v17c0 6 3 9 9 9h20c6 0 10-3 12-8l3-14c2-7-2-11-9-11z" />
      <path className="prop-crease" d="M79 205h26M79 212h28M80 219h26" />
      <path className="prop-skin" d="M96 197c6-7 13-8 17-5 4 3 1 8-4 9l-10 1" />
    </svg>
  )
}

// Photo layers plus the summer props: worn in light mode, packed away in dark mode.
export default function PortraitStage({ children }) {
  const theme = useCurrentTheme()

  return (
    <div className={`portrait-stage ${theme === 'light' ? 'is-sunny' : ''}`}>
      {children}
      <div className="portrait-props" aria-hidden="true">
        <Umbrella />
        <div className="shades-rig">
          <Sunglasses />
          <PinchHand />
        </div>
      </div>
    </div>
  )
}
