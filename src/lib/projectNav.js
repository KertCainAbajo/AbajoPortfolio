import { docTop } from './layoutCache.js'
import { scrollToY } from './smoothScroll.js'

const PHONE_HEADER = 84 // clears the fixed mobile header when jumping

// Longer jumps take a little longer, so passing several cards never feels rushed (0.9s–2s)
const glide = (y) => scrollToY(y, Math.min(2, Math.max(0.9, 0.75 + Math.abs(y - window.scrollY) / 2400)))

// Cards stack (sticky) only on wider screens; on phones they scroll as a normal list
export const isStacked = () => window.matchMedia('(min-width: 761px)').matches

// Smoothly scroll so project `index` is the card on top (shared by the dock and card dragging)
export function jumpToProject(stack, index) {
  const items = stack?.querySelectorAll('.showcase-item')
  if (!items?.length) return
  const el = items[Math.max(0, Math.min(items.length - 1, index))]
  if (!isStacked()) { glide(docTop(el) - PHONE_HEADER); return }
  // Where the card sits before it sticks, minus its sticky offset = the scroll point where it lands on top
  el.style.position = 'static'
  const natural = docTop(el)
  el.style.position = ''
  const stick = parseFloat(getComputedStyle(el).top) || 0
  glide(natural - stick + 2)
}
