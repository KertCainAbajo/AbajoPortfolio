import { Fragment, useEffect, useState } from 'react'
import { ArrowDown, ArrowUpRight, Code2, Smartphone, Layers3, Sparkles, MapPin, Palmtree, Globe, Bot, Network, Bug, Brain, FileText } from 'lucide-react'
import Sidebar from './components/Sidebar.jsx'
import Section from './components/Section.jsx'
import ProjectShowcase from './components/ProjectShowcase.jsx'
import Toolkit from './components/Toolkit.jsx'
import Interests from './components/Interests.jsx'
import TechStack from './components/TechStack.jsx'
import AboutMe from './components/AboutMe.jsx'
import Leadership from './components/Leadership.jsx'
import Skills from './components/Skills.jsx'
import Contact from './components/Contact.jsx'
import ContributionGraph from './components/ContributionGraph.jsx'
import ThemeSwitch from './components/ThemeSwitch.jsx'
import PortraitStage from './components/PortraitStage.jsx'
import { initSmoothScroll } from './lib/smoothScroll.js'
import { initInteractions } from './lib/interactions.js'
import { initEffects } from './lib/effects.js'
import Preloader from './components/Preloader.jsx'
import HeroField from './components/HeroField.jsx'
import SplitText, { ScrubText } from './components/SplitText.jsx'
import { siHtml5, siCss, siJavascript, siReact, siTypescript, siPhp, siLaravel, siMysql, siMongodb, siFlutter, siDart, siGit, siGithub, siPostman, siExpo, siPhpmyadmin, siVite, siFontawesome, siGoogle, siRender, siCloudflare, siApache, siPwa, siReactrouter, siNodedotjs, siExpress, siLivewire, siTailwindcss, siNginx, siPostgresql, siSupabase, siDocker, siChartdotjs, siBrevo, siAxios, siReactquery, siLeaflet, siCapacitor, siResend, siVitest, siTestinglibrary, siVercel, siOpenapiinitiative, siComposer, siAlpinedotjs, siGoogleanalytics } from 'simple-icons'

// Order on the page: the three live projects first, then the rest
const projects = [
  { platform: 'web', number: 4, accent: '#db2777', mock: 'shop', url: 'Crochet · Shop', live: 'https://jeny-crochet.onrender.com/home', demo: 'crochet', details: {
      overview: 'Jeny Crochet Co. is a live online shop for handmade crochet. Customers browse more than 240 pieces across 12 collections, save favourites, order with cash on delivery, and can request a custom piece in their own colours and size.',
      facts: [['Catalogue', '242+ pieces · 12 collections'], ['Payment', 'Cash on delivery'], ['Hosting', 'Render + Cloudflare']],
      features: [
        ['Shop the collection', 'Browse every piece by collection, search by name, and sort to find something quickly.'],
        ['Product pages', 'Each piece has photos, price, stock status and a description of how it is made and what it is made from.'],
        ['Cart and wishlist', 'Save favourites for later or add pieces to the cart and change quantities.'],
        ['Cash on delivery', 'Customers pay when the order arrives, and can follow the delivery step by step.'],
        ['Custom orders', 'A request form for one-of-a-kind pieces, with making time and reply time shown up front.'],
        ['Accounts', 'Sign up with email or continue with Google, with a forgot-password option.'],
        ['Reviews', 'Pieces show star ratings and customer reviews.'],
        ['Install as an app', 'The site can be added to a phone home screen and opened like an app.'],
      ],
      flow: ['Browse the collection', 'Open a piece', 'Add it to the cart', 'Check out with cash on delivery', 'Follow the delivery', 'Or request a custom piece'],
      stack: [
        ['Backend', [['Laravel', siLaravel], ['PHP', siPhp]]],
        ['Frontend', [['Tailwind CSS', siTailwindcss], ['Vite', siVite], ['Axios', siAxios], ['Font Awesome', siFontawesome], ['Lenis (smooth scrolling)']]],
        ['Sign-in', [['Google sign-in', siGoogle]]],
        ['App features', [['Installable web app (PWA)', siPwa]]],
        ['Hosting', [['Render', siRender], ['Apache', siApache], ['Cloudflare', siCloudflare]]],
      ],
    }, title: 'Crochet Shop System', category: 'E-commerce', symbol: '✳', description: 'An online shop where people can browse handmade crochet, place orders, and ask for custom pieces.', tags: ['E-commerce', 'Orders', 'Custom work'] },
  { platform: 'web', number: 8, accent: '#059669', mock: 'shop', url: 'SmartPOS · Shop', live: 'https://alingnena-minimart.vercel.app/shop/aling-nena-mini-mart', demo: 'pos', details: {
      overview: 'Unified SmartPOS is a multi-tenant point-of-sale system for Philippine businesses, shown here with the demo store Aling Nena Mini Mart. One Laravel API and one database serve the staff web app, the customer online shop and an Android app: staff run the till, stock and reports, while customers order online for pickup or delivery and pay in cash.',
      facts: [['Demo store', 'Aling Nena Mini Mart · 3 branches'], ['Catalogue', '200 products · 10 categories'], ['API', '87 documented endpoints'], ['Hosting', 'Vercel + Supabase']],
      features: [
        ['Online shop', 'Customers browse the catalogue, search, save favourites and fill a basket, then choose pickup at a branch or delivery, and pay in cash.'],
        ['Online orders for staff', 'New orders appear in the staff app to confirm and prepare; pickup is completed at the till.'],
        ['POS checkout', 'Shifts with opening float and Z reading, barcode or SKU search, senior citizen and PWD discounts, VAT, split payments, receipts, voids and refunds.'],
        ['Inventory', 'Stock per branch with a full history, adjustments, stock counts, transfers between branches and low-stock alerts.'],
        ['Purchasing', 'Suppliers, purchase orders and receiving, with protection against receiving more than was ordered.'],
        ['Reports and audit log', 'Daily and monthly sales, by branch, cashier and payment method, best sellers, profit, and an audit log.'],
        ['Staff and roles', 'Owner, manager, cashier, inventory and custom roles with branch-level access; staff sign in with a business code and username.'],
        ['Hiring', 'A public careers page, online applications and a full interview-to-onboarding pipeline.'],
      ],
      flow: ['Customer fills a basket online', 'Chooses pickup or delivery', 'Staff confirm and prepare the order', 'Cashier completes it at the POS', 'Stock and sales reports update'],
      stack: [
        ['Backend', [['Laravel 13', siLaravel], ['PHP 8.3', siPhp], ['Laravel Sanctum'], ['REST API (OpenAPI docs)', siOpenapiinitiative]]],
        ['Web app', [['React 19', siReact], ['TypeScript', siTypescript], ['React Router', siReactrouter], ['TanStack Query', siReactquery], ['Tailwind CSS 4', siTailwindcss], ['Vite', siVite], ['Leaflet maps', siLeaflet]]],
        ['Mobile app', [['Capacitor (Android app)', siCapacitor]]],
        ['Database & storage', [['PostgreSQL', siPostgresql], ['Supabase (database + file storage)', siSupabase], ['MySQL (development)', siMysql]]],
        ['Email', [['Resend', siResend], ['Brevo', siBrevo]]],
        ['Testing', [['PHPUnit'], ['Vitest', siVitest], ['Testing Library', siTestinglibrary], ['Playwright']]],
        ['Hosting', [['Vercel', siVercel], ['Docker', siDocker]]],
      ],
    }, title: 'Unified SmartPOS', category: 'Point of sale & online shop', symbol: 'POS', description: 'A point-of-sale system with an online shop. Staff run sales, stock and reports, and customers order online for pickup or delivery.', tags: ['Point of sale', 'Inventory', 'Online orders'] },
  { platform: 'web', number: 3, accent: '#16a34a', mock: 'booking', url: 'Mechanic · Book a service', live: 'https://dexter-auto.onrender.com/login', demo: 'mechanic', details: {
      overview: 'Dexter Auto Services is a live booking system for an auto repair shop. Customers sign in to book a service, follow their repair step by step, and see the price before any work begins.',
      facts: [['Shop hours', 'Mon–Sat · 8AM–6PM'], ['Sign-in', 'Email, Google, optional 2FA'], ['Database', 'PostgreSQL (Supabase)'], ['Hosting', 'Docker on Render']],
      features: [
        ['Online booking', 'Customers book a service online and pick their time.'],
        ['Live repair tracking', 'Customers can follow every step of their repair.'],
        ['Upfront prices', 'The price is shown before any work begins, so there are no bill surprises.'],
        ['Accounts', 'Create an account with name, email and password, or sign up with Google, and stay signed in.'],
        ['Two-step login', 'Customers can protect their account with a second sign-in step (2FA).'],
        ['Password reset', 'A reset link is emailed when a customer forgets their password.'],
        ['Call the shop', 'Customers who prefer to talk can call the shop straight from the sign-in page.'],
        ['Shop policies', 'Privacy, terms, cookie and refund policies are linked on every page.'],
      ],
      flow: ['Create an account or sign in', 'Book a service and pick a time', 'See the price before work begins', 'Follow the repair step by step'],
      stack: [
        ['Backend', [['Laravel 12', siLaravel], ['PHP 8.2', siPhp], ['Laravel Sanctum'], ['Laravel Breeze']]],
        ['Frontend', [['Livewire 3 + Volt', siLivewire], ['Tailwind CSS', siTailwindcss], ['Vite', siVite], ['Chart.js', siChartdotjs], ['Lenis (smooth scrolling)']]],
        ['Database', [['PostgreSQL', siPostgresql], ['Supabase', siSupabase]]],
        ['Sign-in & security', [['Google sign-in (Socialite)', siGoogle], ['Two-factor login (2FA)'], ['Roles & permissions (Spatie)']]],
        ['Email & notifications', [['Brevo email', siBrevo], ['Web push notifications']]],
        ['Extras', [['PDF generation (dompdf)'], ['QR codes'], ['Laravel Pulse monitoring']]],
        ['Hosting', [['Docker', siDocker], ['Render', siRender], ['nginx', siNginx], ['Cloudflare', siCloudflare]]],
      ],
    }, title: 'Mechanic Booking System', category: 'Booking platform', symbol: 'M—', description: 'Customers pick a repair and book a time, and the shop keeps its mechanics’ schedules organized.', tags: ['Booking', 'Scheduling', 'Services'] },
  { platform: 'web', number: 5, accent: '#dc2626', mock: 'scan', url: 'Gym · Check-in', live: 'https://ironclad-web.onrender.com/login', demo: 'gym', details: {
      overview: 'Ironclad is a live gym membership and attendance system. Members carry a digital pass with a QR code, staff scan it at the front desk to time them in and out, and the owner sees peak hours, revenue by plan and a full activity log.',
      facts: [['Users', 'Members · Staff · Owner'], ['Check-in', 'QR code or member ID'], ['Hosting', 'Render + Cloudflare']],
      features: [
        ['Digital member pass', 'Each member gets a pass with a QR code to show at the front desk, plus their membership status.'],
        ['QR check-in', 'Staff scan the member’s QR code, or type their ID, to time them in and out in seconds.'],
        ['Membership status', 'Members see how many days are left. Expired passes are asked to renew, and new ones wait for staff to activate them.'],
        ['Plans and schedules', 'The gym manages its membership plans and schedules in one place.'],
        ['Visit history', 'Every time-in and time-out is saved, with a day streak, and members can download theirs as a spreadsheet (CSV).'],
        ['Owner reports', 'Peak check-in hours, revenue by plan, and member lists to export.'],
        ['Activity log', 'An audit log keeps a history of actions taken in the system.'],
        ['Accounts', 'Sign up with email or Google, reset a forgotten password, and update email or password.'],
      ],
      flow: ['Member signs in', 'Shows their QR pass at the front desk', 'Staff scan it to time them in', 'Time out when leaving', 'Visit history and streak update', 'Owner checks peak hours and revenue'],
      stack: [
        ['Frontend', [['React', siReact], ['React Router', siReactrouter], ['Vite', siVite]]],
        ['Backend', [['Node.js', siNodedotjs], ['Express', siExpress]]],
        ['Sign-in', [['Google sign-in', siGoogle]]],
        ['Hosting', [['Render', siRender], ['Cloudflare', siCloudflare]]],
      ],
    }, title: 'Gym Time-In & Time-Out', category: 'Membership system', symbol: '05', description: 'Members check in and out with their own ID, and the gym keeps track of attendance and memberships.', tags: ['Attendance', 'Membership', 'Member ID'] },
  { platform: 'web', number: 1, accent: '#e11d74', live: 'https://itso.uic.edu.ph/', demo: 'itso', details: {
      overview: 'The UIC IP Management System is the university’s live platform for registering, monitoring and managing intellectual property, run by the Innovation and Technology Support Office (ITSO) together with the Research, Publication, and Innovation Center (RPIC). I worked on it as Quality Assurance in a seven-person student development team.',
      facts: [['My role', 'Quality Assurance'], ['Team', '7 student developers'], ['For', 'UIC · ITSO and RPIC'], ['Sign-in', 'Google']],
      features: [
        ['IP filing and tracking', 'Applications for patents, utility models, copyright, industrial designs and trademarks, followed from filing to approval.'],
        ['Real-time monitoring', 'Deadlines, statuses and filing checkpoints across the whole portfolio in one dashboard.'],
        ['Dashboards for every role', 'Separate views for RPIC, ITSO, faculty and students.'],
        ['Document management', 'Secure storage with version control for research papers and filing documents.'],
        ['Event scheduling', 'Seminars, research defenses and other academic events in one calendar.'],
        ['Notifications', 'Real-time alerts and updates for everyone involved in a filing.'],
        ['Analytics and reporting', 'Live insights on the IP portfolio, such as readiness across protection types.'],
        ['IP policy first', 'Users read and accept the university IP policy before signing in with Google.'],
      ],
      flow: ['Read and accept the IP policy', 'Sign in with Google', 'File an IP application with its documents', 'ITSO and RPIC review it', 'Track the status until approval'],
      stack: [
        ['Backend', [['Laravel 12', siLaravel], ['PHP 8.4', siPhp], ['Composer', siComposer]]],
        ['Frontend', [['Livewire 3', siLivewire], ['Alpine.js', siAlpinedotjs], ['Tailwind CSS', siTailwindcss], ['Vite', siVite], ['Chart.js', siChartdotjs], ['Font Awesome', siFontawesome]]],
        ['Database', [['MySQL', siMysql]]],
        ['Sign-in', [['Google sign-in', siGoogle]]],
        ['Hosting & analytics', [['Cloudflare', siCloudflare], ['Google Analytics', siGoogleanalytics]]],
      ],
    }, mock: 'tracker', url: 'ITSO · Applications', title: 'ITSO IP Management System', category: 'Office workflow', symbol: 'IP', description: 'Lets the university’s Innovation and Technology Support Office receive applications online and follow each one from submission to approval.', tags: ['Document tracking', 'Status monitoring', 'Workflows'] },
  { platform: 'web', number: 2, accent: '#6366f1', mock: 'calendar', url: 'RPIC · Defense schedule', title: 'RPIC Research Management System', category: 'Research management', symbol: 'R/', description: 'Keeps research papers, defense schedules, files, and publications in one place, so nothing gets lost along the way.', tags: ['Research', 'Scheduling', 'Data organization'] },
  { platform: 'mobile', number: 6, accent: '#10b981', mock: 'habit', url: '', details: { stack: [['Mobile app', [['Flutter', siFlutter], ['Dart', siDart]]]] }, title: 'TechSustain', category: 'Flutter app', symbol: '↗', description: 'A Flutter app that helps people build small eco-friendly habits, with simple tips and a personal tracker.', tags: ['Flutter', 'Sustainability', 'Habit tracking'] },
  { platform: 'mobile', number: 7, accent: '#f59e0b', details: {
      overview: 'A Laravel REST API with a web portal where patients log their meals, symptoms, sleep and stress, then see insights, likely triggers and recommendations over time. Admins manage users and food categories and review analytics.',
      facts: [['Users', 'Patients · Admins'], ['Tracks', 'Food · symptoms · sleep & stress'], ['Database', 'MySQL']],
      features: [
        ['Quick daily logging', 'Patients log food, symptoms, and sleep and stress straight from their dashboard.'],
        ['Insights and triggers', 'An insight service summarises the logs and lists likely triggers.'],
        ['Recommendations', 'Personal recommendations based on what the patient has logged.'],
        ['Timeline and history', 'A timeline of past entries, with history filtered by date range.'],
        ['Accounts', 'Register or sign in with email or Google; API clients sign in with secure tokens.'],
        ['Admin tools', 'User management, analytics, activity logs and food-category management.'],
      ],
      flow: ['Sign up or sign in with Google', 'Log meals, symptoms and sleep', 'Review the timeline and history', 'See insights and likely triggers', 'Follow the recommendations'],
      stack: [
        ['Backend', [['Laravel 13', siLaravel], ['PHP 8.3', siPhp], ['Laravel Sanctum'], ['REST API']]],
        ['Frontend', [['Blade templates'], ['Tailwind CSS 4', siTailwindcss], ['Vite', siVite], ['Lenis (smooth scrolling)']]],
        ['Database', [['MySQL', siMysql]]],
        ['Sign-in', [['Google sign-in (Socialite)', siGoogle]]],
      ],
    }, mock: 'log', url: '', title: 'Acid Reflux Tracker', category: 'Health tracker', symbol: '≈', description: 'A personal log for meals and symptoms that helps spot what might be causing flare-ups over time.', tags: ['Health tracking', 'Patterns', 'Logging'] },
]

const skills = [
  { name: 'Building websites & web apps', icon: Globe, note: 'From the screens people click on to the data behind them.' },
  { name: 'Making mobile apps', icon: Smartphone, note: 'Apps for Android and iPhone, built with Flutter and Expo.' },
  { name: 'Working smarter with AI', icon: Bot, note: 'I use AI to get unstuck faster, and I still check every answer myself.' },
  { name: 'Planning how a system fits together', icon: Network, note: 'Deciding what each part does before writing the code.' },
  { name: 'Testing & fixing bugs', icon: Bug, note: 'Trying to break things on purpose, so users never have to.' },
  { name: 'Solving real problems', icon: Brain, note: 'Breaking a messy problem into small steps I can actually finish.' },
  { name: 'Writing clear guides & reports', icon: FileText, note: 'Plain write-ups that users, teammates, and teachers can follow.' },
]
const techs = [
  { name: 'HTML5', icon: siHtml5 }, { name: 'CSS3', icon: siCss }, { name: 'JavaScript', icon: siJavascript }, { name: 'React', icon: siReact },
  { name: 'TypeScript', icon: siTypescript }, { name: 'PHP', icon: siPhp }, { name: 'Laravel', icon: siLaravel }, { name: 'MySQL', icon: siMysql },
  { name: 'MongoDB', icon: siMongodb }, { name: 'Flutter', icon: siFlutter }, { name: 'Dart', icon: siDart }, { name: 'Git', icon: siGit },
  { name: 'GitHub', icon: siGithub }, { name: 'Postman', icon: siPostman }, { name: 'Expo Go', icon: siExpo }, { name: 'phpMyAdmin', icon: siPhpmyadmin },
]
// Each tool: [name, logo, what I use it for (plain words)]
const stack = [
  { name: 'Frontend', plain: 'What people see', icon: <Code2 size={20} />, items: [['HTML', siHtml5, 'Page structure'], ['CSS', siCss, 'Layout and style'], ['JavaScript', siJavascript, 'Makes pages interactive'], ['React', siReact, 'Reusable screen parts'], ['TypeScript', siTypescript, 'Catches mistakes early']] },
  { name: 'Backend & data', plain: 'What runs behind it', icon: <Layers3 size={20} />, items: [['PHP', siPhp, 'Server-side logic'], ['Laravel', siLaravel, 'Builds web apps faster'], ['MySQL', siMysql, 'Stores app data'], ['MongoDB', siMongodb, 'Flexible data storage']] },
  { name: 'Mobile & tools', plain: 'Phones and daily tools', icon: <Smartphone size={20} />, items: [['Flutter', siFlutter, 'Android and iPhone apps'], ['Dart', siDart, 'The language behind Flutter'], ['Expo Go', siExpo, 'Tries apps on a real phone'], ['Git', siGit, 'Tracks every change'], ['GitHub', siGithub, 'Shares and backs up code'], ['Postman', siPostman, 'Tests app connections'], ['phpMyAdmin', siPhpmyadmin, 'Manages the database']] },
]
const leadership = [
  { years: '2024 — 2025', role: 'Officer · Auditor', org: 'College of Computer Studies', mark: 'CCS' },
  { years: '2023 — 2024', role: 'Officer · Legislative', org: 'Society of Information Technology Education Students', mark: 'SITES' },
]
const stats = [['08', 'Projects built'], ['16', 'Tools & technologies'], ['02', 'Leadership roles']]
const statement = ['Web development', 'Mobile apps', 'System design', 'Clean design', 'Problem solving']
const floaters = [{ tech: siReact, label: 'React', cls: 'float-a', depth: 30 }, { tech: siFlutter, label: 'Flutter', cls: 'float-b', depth: -40 }, { tech: siLaravel, label: 'Laravel', cls: 'float-c', depth: 24 }]

// Types the name, holds it for 5s, erases it, then types it again.
// Kept in its own component so each keystroke re-renders only this span, not the whole page.
function TypedName({ text }) {
  const [typed, setTyped] = useState('')
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(text)
      return undefined
    }
    let index = 0
    let deleting = false
    let timer = 0
    const step = () => {
      index += deleting ? -1 : 1
      setTyped(text.slice(0, index))
      if (!deleting && index >= text.length) {
        deleting = true
        timer = window.setTimeout(step, 5000)
      } else if (deleting && index <= 0) {
        deleting = false
        timer = window.setTimeout(step, 450)
      } else {
        timer = window.setTimeout(step, deleting ? 26 : 48)
      }
    }
    timer = window.setTimeout(step, 48)
    return () => window.clearTimeout(timer)
  }, [text])
  return <span className="hero-name-typed" aria-hidden="true">{typed}<span className="typing-cursor" /></span>
}

function App() {
  const [ready, setReady] = useState(false)
  const title = 'Kert Cain Arvie P. Abajo'

  useEffect(() => initSmoothScroll(), [])
  useEffect(() => (ready ? initInteractions() : undefined), [ready])
  useEffect(() => (ready ? initEffects() : undefined), [ready])

  return (
    <div className="app-frame" id="top">
      <Preloader onReveal={() => setReady(true)} />
      <div className="scroll-progress" aria-hidden="true" />
      <div className="cursor-dot" aria-hidden="true" /><div className="cursor-ring" aria-hidden="true" />
      <div className="backdrop" aria-hidden="true">
        <span className="backdrop-grid" /><span className="backdrop-glow glow-a" /><span className="backdrop-glow glow-b" />
        {/* Beach panorama (day in light mode, moonlit night in dark mode) (sky with rays, clouds and gulls, islands and a sailboat on the horizon,
            a golden-hour sun setting on the horizon with its reflection on the water, rolling foam, wet sand,
            a swaying palm); switching themes sets the sun and raises the moon, or the reverse */}
        <span className="beach">
          <span className="beach-stars"><i /><i /></span><span className="beach-aurora" /><span className="beach-rays" /><span className="beach-cloud c1" /><span className="beach-cloud c2" /><span className="beach-cloud c3" />
          <span className="beach-gull g1"><i /></span><span className="beach-gull g2"><i /></span><span className="beach-gull g3"><i /></span>
          <span className="beach-haze" /><span className="beach-sun" /><span className="beach-moon" /><span className="beach-isles" /><span className="beach-boat" />
          <span className="beach-sea"><b className="beach-glint" /><i /><i /><i /></span><span className="beach-sand" />
          <span className="beach-palm-shadow" /><span className="beach-palm" />
        </span>
      </div>
      <Sidebar />
      <main className="main-content">
        <div className="topbar">
          <span className="topbar-left">Portfolio <i>/</i> 2026</span>
          <span className="status-pill"><span className="live-dot" /> Available for opportunities</span>
        </div>

        <section id="about" className="hero-section">
          <HeroField />
          <div className="hero-waves" aria-hidden="true"><i /><i /><i /></div>
          <span className="hero-sun" aria-hidden="true" />
          <div className="hero-copy">
            <span className="hero-badge reveal" style={{ '--d': '150ms' }}><Sparkles size={14} /> IT Graduate <i /> Web &amp; Mobile Developer</span>
            <h1 className="reveal" style={{ '--d': '250ms' }} aria-label={title}><span className="hero-name-ghost" aria-hidden="true">{title}</span><TypedName text={title} /></h1>
            {/* Light mode: a hand-drawn swoosh under the name */}
            <svg className="hero-swoosh" viewBox="0 0 600 40" preserveAspectRatio="none" aria-hidden="true"><path d="M6 28 C120 8 250 6 372 20 S548 34 594 12" /></svg>
            <p className="hero-description reveal" style={{ '--d': '380ms' }}>I build websites and mobile apps that make everyday tasks easier, like booking a service, tracking a request, or checking in at the gym.</p>
            <div className="hero-actions reveal" style={{ '--d': '480ms' }}>
              <a className="btn btn-primary" href="#projects" data-magnetic>Explore my work <ArrowUpRight size={16} /></a>
              <a className="btn btn-ghost" href="#contact" data-magnetic>Let’s connect</a>
            </div>
            <dl className="hero-stats reveal" style={{ '--d': '580ms' }}>
              {stats.map(([value, label]) => <div key={label}><dt data-count={Number(value)}>{value}</dt><dd>{label}</dd></div>)}
            </dl>
          </div>

          <div className="hero-visual reveal" style={{ '--d': '300ms' }}>
            {floaters.map((f) => <span className={`floater ${f.cls}`} data-depth={f.depth} key={f.label} aria-hidden="true" style={{ '--brand': `#${f.tech.hex}` }}><span className="floater-inner"><svg viewBox="0 0 24 24"><path d={f.tech.path} /></svg>{f.label}</span></span>)}
            {/* A tilted 3D orbit ring circling the portrait, with two points of light travelling round it */}
            <span className="hero-orbit" aria-hidden="true"><i /></span>
            <div className="portrait-card" data-tilt="6">
              <div className="visual-topline"><span className="visual-label">The developer</span><ThemeSwitch /></div>
              <div className="portrait-art" aria-label="Portrait of Kert Cain Arvie P. Abajo" role="img">
                <PortraitStage>
                  <div className="portrait-speedlines" />
                  <img className="portrait-photo portrait-base" src="/assets/1p-cutout.webp" alt="Kert Cain Arvie P. Abajo" onError={(event) => { event.currentTarget.style.display = 'none' }} />
                  <img className="portrait-photo portrait-base-head" src="/assets/1p-cutout.webp" alt="" aria-hidden="true" onError={(event) => { event.currentTarget.style.display = 'none' }} />
                </PortraitStage>
              </div>
              <div className="visual-bottomline"><span>Information Technology</span><span><MapPin size={13} /> Davao City, PH</span></div>
            </div>
            {/* Light mode: a slowly turning postmark stamp over the portrait's corner */}
            <span className="hero-stamp" aria-hidden="true">
              <svg viewBox="0 0 200 200"><defs><path id="stamp-ring" d="M100 100 m-74 0 a74 74 0 1 1 148 0 a74 74 0 1 1 -148 0" /></defs>
                <text><textPath href="#stamp-ring" textLength="462" lengthAdjust="spacing">WEB &amp; MOBILE DEVELOPER • DAVAO CITY • OPEN TO WORK •</textPath></text></svg>
              <b><Palmtree size={26} /></b>
            </span>
          </div>
          <a className="scroll-cue" href="#education"><span>Scroll to explore</span><ArrowDown size={14} /></a>
        </section>

        <div className="statement" aria-hidden="true">
          <div className="statement-track">{[0, 1].map((copy) => statement.map((word, i) => <span key={`${copy}-${i}`} className={i % 2 ? 'outline' : ''}>{word}<i>✦</i></span>))}</div>
        </div>

        <Section id="education" number="01" title="A little about me" eyebrow="About">
          <AboutMe />
        </Section>

        <Section id="stack" number="02" title="Tech stack" eyebrow="Stack" description="The languages and tools I use most, grouped by what they’re for.">
          <TechStack groups={stack} />
        </Section>

        <Section id="skills" number="03" title="Things I do well" eyebrow="Skills" description="What I can bring to your team. Pick one to see a quick example.">
          <Skills skills={skills} />
        </Section>

        <Section id="leadership" number="04" title="Student leadership" eyebrow="Leadership" description="Two years as an officer in student organizations at the University of the Immaculate Conception.">
          <Leadership items={leadership} />
        </Section>

        <Section id="projects" number="05" title="Selected projects" eyebrow="Work" description="Six web apps and two mobile apps I built from 2023 to 2026, each one for a real need." className="projects-section">
          <ProjectShowcase projects={projects} />
        </Section>


        <Section id="interests" number="06" title="Always curious about" eyebrow="Interests" description="Things I’m learning more about. Tap a panel to open it, and tap again to close it.">
          <Interests />
        </Section>

        <Section id="technologies" number="07" title="In my toolkit" eyebrow="Technologies" description="Everything I’ve worked with so far. Hover a ring to see that group.">
          <Toolkit techs={techs} />
        </Section>

        <Section id="contributions" number="08" title="My GitHub activity" eyebrow="Activity">
          <ContributionGraph />
        </Section>

        <section className="quote-section reveal">
          <span className="quote-mark" aria-hidden="true">“</span>
          <ScrubText as="blockquote" text="Great things are done by a series of small things brought together." />
          <cite>— Vincent van Gogh</cite>
        </section>

        <Contact />
        <div className="footer-mark reveal" aria-hidden="true"><SplitText text="Kert Cain Abajo" /></div>
        <footer className="site-footer">
          <a className="footer-brand" href="#top"><span className="brand-mark">KA</span> Kert Cain Abajo</a>
          <span>Built with React · Davao City, PH · © 2026</span>
          <a href="#top">Back to top ↑</a>
        </footer>
      </main>
    </div>
  )
}

export default App
