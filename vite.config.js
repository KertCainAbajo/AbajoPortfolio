import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Content Security Policy: only this site's own scripts run, and the page may only
// talk to the services it actually uses. Update these lists if you add a new service.
const csp = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https://ghchart.rshah.org",
  "connect-src 'self' https://formsubmit.co https://github-contributions-api.jogruber.de",
  "form-action 'self' https://formsubmit.co",
  "base-uri 'none'",
  "object-src 'none'",
  'upgrade-insecure-requests',
].join('; ')

// Injected into production builds only: the dev server relies on inline scripts for hot reload.
const contentSecurityPolicy = () => ({
  name: 'content-security-policy',
  apply: 'build',
  transformIndexHtml: () => [{ tag: 'meta', attrs: { 'http-equiv': 'Content-Security-Policy', content: csp }, injectTo: 'head-prepend' }],
})

export default defineConfig({
  plugins: [react(), tailwindcss(), contentSecurityPolicy()],
})
