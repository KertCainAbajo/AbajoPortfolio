import { useEffect, useRef, useState } from 'react'
import SplitText from './SplitText.jsx'
import { ArrowUpRight, Send, Github, Linkedin, Mail, MapPin, Loader2, CircleCheck, CircleAlert, X } from 'lucide-react'

const contact = {
  email: 'kertabajo4@gmail.com',
  github: 'https://github.com/KertCainAbajo',
  linkedin: 'https://www.linkedin.com/in/kert-cain-arvie-p-abajo-94325a3a7',
}

// FormSubmit forwards each submission to the inbox above. The very first submission
// sends a one-time activation email to that inbox; messages arrive after it is confirmed.
const FORM_ENDPOINT = `https://formsubmit.co/ajax/${contact.email}`

const NOTICE = {
  sent: { title: 'Message sent', text: 'Thanks for reaching out! I’ll reply to the email you provided.' },
  error: { title: 'Message not sent', text: 'Something went wrong. Please try again, or email me directly at' },
  limited: { title: 'Please wait a moment', text: '' },
}
const SENT_NOTICE_MS = 5000

// Browser-side rate limit. It stops double-sends, rapid re-submits and simple bots;
// it is not a hard guarantee, since anyone can post to the endpoint directly.
const COOLDOWN_MS = 60 * 1000
const HOURLY_LIMIT = 3
const MIN_FILL_MS = 3000
const LIMIT_KEY = 'contact-sends'

const readSends = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(LIMIT_KEY) || '[]')
    return Array.isArray(stored) ? stored.filter((entry) => Date.now() - entry.at < 60 * 60 * 1000) : []
  } catch { return [] }
}
const writeSends = (sends) => {
  try { window.localStorage.setItem(LIMIT_KEY, JSON.stringify(sends)) } catch { /* storage unavailable */ }
}
const fingerprint = (text) => text.trim().toLowerCase().replace(/\s+/g, ' ')

// Returns why a send should be blocked, or '' when it may go ahead.
function checkLimit(message) {
  const sends = readSends()
  const last = sends[sends.length - 1]
  if (last && Date.now() - last.at < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - (Date.now() - last.at)) / 1000)
    return `You just sent a message. You can send another in ${wait} seconds.`
  }
  if (sends.length >= HOURLY_LIMIT) {
    const wait = Math.ceil((60 * 60 * 1000 - (Date.now() - sends[0].at)) / 60000)
    return `You’ve reached the limit of ${HOURLY_LIMIT} messages per hour. Please try again in about ${wait} minute${wait === 1 ? '' : 's'}, or email me directly.`
  }
  if (sends.some((entry) => entry.fp === fingerprint(message))) {
    return 'This message was already sent. I’ll get back to you soon!'
  }
  return ''
}

const AUTO_REPLY = `Hi there,

Thank you for reaching out through my portfolio. I've received your message and will get back to you as soon as I can, usually within 1–2 business days.

In the meantime, you can view my work on GitHub: ${contact.github}
or connect with me on LinkedIn: ${contact.linkedin}

Best regards,
Kert Cain Arvie P. Abajo
Web & Mobile Developer · Davao City, Philippines
${contact.email}`

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const [detail, setDetail] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const startedAt = useRef(0)

  // Count down the cooldown on the button after a successful send
  useEffect(() => {
    const tick = () => {
      const last = readSends().at(-1)
      setCooldown(last ? Math.max(0, Math.ceil((COOLDOWN_MS - (Date.now() - last.at)) / 1000)) : 0)
    }
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [status])

  // The success notice dismisses itself; errors stay until closed or retried
  useEffect(() => {
    if (status !== 'sent') return undefined
    const timer = window.setTimeout(() => setStatus('idle'), SENT_NOTICE_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const message = String(data.get('message') || '')
    // Real people take a few seconds to fill the form; instant submits are bots
    if (!startedAt.current || Date.now() - startedAt.current < MIN_FILL_MS) {
      setDetail('That was very fast. Please take a moment to review your message, then send it again.')
      setStatus('limited')
      startedAt.current = startedAt.current || Date.now()
      return
    }
    const blocked = checkLimit(message)
    if (blocked) {
      setDetail(blocked)
      setStatus('limited')
      return
    }
    setStatus('sending')
    setDetail('')
    try {
      const response = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      })
      const result = await response.json().catch(() => ({}))
      // FormSubmit answers 200 with success "false" until the inbox owner activates the form
      if (!response.ok || String(result.success) === 'false') throw new Error(result.message || '')
      writeSends([...readSends(), { at: Date.now(), fp: fingerprint(message) }])
      setStatus('sent')
      form.reset()
      startedAt.current = 0
    } catch (error) {
      setDetail(/activat/i.test(error.message) ? 'The form is waiting for activation: check kertabajo4@gmail.com (and Spam) for the FormSubmit email and click “Activate Form”.' : '')
      setStatus('error')
    }
  }

  const sending = status === 'sending'
  const coolingDown = cooldown > 0 && !sending
  return (
    <section id="contact" className="contact-section">
      <header className="section-heading reveal"><span className="eyebrow"><span className="eyebrow-no">09</span><span className="scramble" data-text="Contact">Contact</span></span><h2><SplitText text="Let’s talk" /></h2><p className="section-description">I’m open to roles, freelance work, and collaborations. Messages go straight to my inbox.</p></header>
      <div className="card contact-grid reveal">
        <div className="contact-info">
          <p className="contact-lede">Hiring, or have a project in mind?<br /><span>Send me a message and I’ll get back to you.</span></p>
          <div className="contact-details">
            <span className="contact-label">Get in touch</span>
            <a href={`mailto:${contact.email}`}><Mail size={16} />{contact.email}<ArrowUpRight size={14} /></a>
            <a href={contact.github} target="_blank" rel="noreferrer"><Github size={16} />GitHub<ArrowUpRight size={14} /></a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} />LinkedIn<ArrowUpRight size={14} /></a>
            <span className="location-line"><MapPin size={16} />Davao City, Philippines</span>
          </div>
          <span className="status-pill contact-status"><span className="live-dot" /> Open for what’s next</span>
        </div>
        <form className="contact-form" onSubmit={handleSubmit} onFocus={() => { if (!startedAt.current) startedAt.current = Date.now() }}>
          <input type="hidden" name="_subject" value="New message from your portfolio" />
          <input type="hidden" name="_template" value="table" />
          {/* FormSubmit emails this text back to the address in the "email" field */}
          <input type="hidden" name="_autoresponse" value={AUTO_REPLY} />
          <label>Your name<input name="name" placeholder="How should I call you?" autoComplete="name" required minLength={2} maxLength={80} disabled={sending} /></label>
          <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={120} disabled={sending} /></label>
          <label>Your message<textarea name="message" rows="4" placeholder="A little about the role or project..." required minLength={10} maxLength={2000} disabled={sending} /></label>
          <button type="submit" className="send-button" data-magnetic disabled={sending || coolingDown}>
            {sending ? 'Sending…' : coolingDown ? `Send again in ${cooldown}s` : 'Send message'}
            {sending ? <Loader2 size={15} className="send-spinner" /> : <Send size={15} />}
          </button>
          <div className="form-notice-slot" role="status" aria-live="polite">
            {NOTICE[status] && (
              <div className={`form-notice form-notice-${status === 'limited' ? 'error' : status}`} key={status}>
                <span className="form-notice-icon">{status === 'sent' ? <CircleCheck size={20} /> : <CircleAlert size={20} />}</span>
                <div className="form-notice-copy">
                  <strong>{NOTICE[status].title}</strong>
                  <p>{status !== 'sent' && detail ? detail : <>{NOTICE[status].text}{status === 'error' && <> <a href={`mailto:${contact.email}`}>{contact.email}</a>.</>}</>}</p>
                </div>
                <button type="button" className="form-notice-close" onClick={() => setStatus('idle')} aria-label="Dismiss message"><X size={16} /></button>
                {status === 'sent' && <span className="form-notice-timer" style={{ animationDuration: `${SENT_NOTICE_MS}ms` }} aria-hidden="true" />}
              </div>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}
