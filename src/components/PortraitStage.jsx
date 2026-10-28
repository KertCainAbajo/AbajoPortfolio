import { useEffect, useRef, useState } from 'react'
import { useCurrentTheme } from '../hooks/useTheme.js'
import BeachVideo from './BeachVideo.jsx'

const LEAD_MS = 450 // zoom gets a head start before the outfit change overlaps it
const OUTFIT_MS = 1100
const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

// Photo layers plus the beach clip. Light mode: zoom in, suit fades into the clip's first frame,
// the clip plays once and holds its last frame. Dark mode: the reversed clip plays, then back to the suit.
export default function PortraitStage({ children }) {
  const theme = useCurrentTheme()
  const [zoom, setZoom] = useState(theme === 'light' ? 'in' : 'out')
  const [outfit, setOutfit] = useState(theme === 'light' ? 'beach' : 'suit')
  const video = useRef(null)
  const run = useRef(0)
  const phase = useRef(theme === 'light' ? 'held' : 'suit')
  const shownTheme = useRef(null)

  useEffect(() => {
    const token = ++run.current
    const live = () => token === run.current
    const clip = video.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // First render (and React StrictMode's repeat run in dev) is not a switch
    if (shownTheme.current === null || shownTheme.current === theme) {
      if (shownTheme.current === null && theme === 'light') clip.show('in-end')
      shownTheme.current = theme
      return
    }
    shownTheme.current = theme

    const toLight = async () => {
      // Interrupted while the reversed clip was playing: turn around from the same pose
      if (phase.current === 'playing-out') {
        const { time } = clip.position()
        clip.stop()
        setZoom('in'); setOutfit('beach')
        phase.current = 'playing-in'
        await clip.play('in', Math.max(0, clip.duration() - time))
        if (live()) phase.current = 'held'
        return
      }
      if (reduced) {
        setZoom('in'); setOutfit('beach'); await clip.show('in-end'); phase.current = 'held'
        return
      }
      phase.current = 'zooming-in'
      setZoom('in')
      await Promise.all([wait(LEAD_MS), clip.show('in-start')])
      if (!live()) return
      phase.current = 'fading-in'
      setOutfit('beach')
      await wait(OUTFIT_MS)
      if (!live()) return
      phase.current = 'playing-in'
      await clip.play('in', 0)
      if (live()) phase.current = 'held'
    }

    const toDark = async () => {
      if (reduced) {
        clip.stop(); setOutfit('suit'); setZoom('out'); phase.current = 'suit'
        return
      }
      // Still zooming/fading in: simply undo
      if (phase.current === 'zooming-in' || phase.current === 'fading-in') {
        setOutfit('suit'); setZoom('out'); phase.current = 'suit'
        return
      }
      let from = 0
      if (phase.current === 'playing-in') {
        const { time } = clip.position()
        clip.stop()
        from = Math.max(0, clip.duration() - time)
      }
      phase.current = 'playing-out'
      await clip.play('out', from)
      if (!live()) return
      phase.current = 'fading-out'
      setOutfit('suit')
      await wait(OUTFIT_MS)
      if (!live()) return
      setZoom('out')
      phase.current = 'suit'
    }

    if (theme === 'light') toLight()
    else toDark()
  }, [theme])

  return (
    <div className="portrait-stage" data-zoom={zoom} data-outfit={outfit}>
      {children}
      <BeachVideo ref={video} />
    </div>
  )
}
