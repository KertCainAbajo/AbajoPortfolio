import { useState } from 'react'
import { ArrowUpRight, Send, Github, Linkedin, Mail, MapPin } from 'lucide-react'

// Replace these sample details with your own before publishing.
const contact = {
  name: 'Your Name',
  email: 'hello@example.com',
  github: 'https://github.com/',
  linkedin: 'https://www.linkedin.com/',
}

export default function Contact() {
  const [sent, setSent] = useState(false)
  const handleSubmit = (event) => {
    event.preventDefault()
    setSent(true)
    event.currentTarget.reset()
  }
  return (
    <section id="contact" className="contact-section">
      <div className="section-heading"><div><span className="eyebrow"><span className="eyebrow-dot" />10 / SAY HELLO</span><h2>Have a good idea?</h2></div><a className="top-link" href="#top" aria-label="Back to top"><ArrowUpRight size={16} /></a></div>
      <div className="contact-grid">
        <div className="contact-info">
          <p className="contact-lede">Let’s make something useful.<br /><span>Tell me what you’re thinking.</span></p>
          <div className="contact-details">
            <span className="contact-label">GET IN TOUCH</span>
            <a href={`mailto:${contact.email}`}><Mail size={16} />{contact.email}<ArrowUpRight size={14} /></a>
            <a href={contact.github} target="_blank" rel="noreferrer"><Github size={16} />GitHub<ArrowUpRight size={14} /></a>
            <a href={contact.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} />LinkedIn<ArrowUpRight size={14} /></a>
            <span className="location-line"><MapPin size={16} />Davao City, Philippines</span>
          </div>
          <div className="contact-stamp">AVAILABLE<br />FOR WHAT’S NEXT<span>✳</span></div>
        </div>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>Your name<input name="name" placeholder="How should I call you?" required /></label>
          <label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>
          <label>Your message<textarea name="message" rows="4" placeholder="A little about your project..." required /></label>
          <button type="submit" className="send-button">{sent ? 'MESSAGE NOTED' : 'SEND A MESSAGE'}<Send size={15} /></button>
          <p className={`form-note ${sent ? 'form-note-visible' : ''}`} aria-live="polite">Thanks for reaching out. This demo form doesn’t send data yet.</p>
        </form>
      </div>
    </section>
  )
}
