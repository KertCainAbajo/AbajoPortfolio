import { Fragment } from 'react'

// Splits text into words (kept unbroken) and characters (animated one by one via --i).
export default function SplitText({ text }) {
  let n = 0
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split(' ').map((word, w) => (
          <Fragment key={w}>
            {w > 0 && ' '}
            <span className="split-word">{[...word].map((char, c) => <span className="split-char" style={{ '--i': n++ }} key={c}>{char}</span>)}</span>
          </Fragment>
        ))}
      </span>
    </>
  )
}

// Words light up one by one as the block scrolls through the viewport (driven by --p from effects.js).
export function ScrubText({ text, as: Tag = 'p', className = '' }) {
  const words = text.split(' ')
  return (
    <Tag className={`scrub ${className}`} data-scrub={words.length}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{words.map((word, i) => <span className="scrub-word" style={{ '--i': i }} key={i}>{word}{' '}</span>)}</span>
    </Tag>
  )
}
