import { useState } from 'react'
import { Link } from 'react-router-dom'

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Work', to: '/work' },
  { label: 'Process', to: '/process' },
  { label: 'Blog', to: '/blog' },
]

const SERVICES = [
  'Websites & Web Applications',
  'Automation & Integrations',
  'Digital Modernization',
  'Technology Consulting',
]

// Small inline glyphs — kept local to the footer since these are brand
// marks, not part of the general-purpose Icon.jsx set.
const SOCIAL_ICONS = {
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7l-5.5-6.8L4.5 22H1.4l8.2-9.3L.7 2h7.2l5 6.2L18.9 2Zm-1.2 18h1.7L6.4 4H4.6l13.1 16Z" />
    </svg>
  ),
  threads: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M12 3c-4.4 0-7 2.6-7 7v4c0 4.4 2.6 7 7 7s7-2.6 7-7c0-2.6-1.4-4-3.5-4-2 0-3 1-3 2.5S13 15 14.5 15c1.8 0 3-1.2 3-3" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM.22 8.24h4.56V23H.22V8.24zM8.35 8.24h4.37v2.01h.06c.61-1.15 2.1-2.37 4.32-2.37 4.62 0 5.47 3.04 5.47 7v8.12h-4.56v-7.2c0-1.72-.03-3.93-2.39-3.93-2.4 0-2.77 1.87-2.77 3.8v7.33H8.35V8.24z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="4" />
      <path d="M10 9l6 3-6 3V9z" fill="currentColor" stroke="none" />
    </svg>
  ),
}

const CONNECT_LINKS = [
  { key: 'mail', label: 'Contact Us', to: '/contact', internal: true },
  { key: 'instagram', label: 'Instagram', href: 'https://www.instagram.com/chaufaltech' },
  { key: 'x', label: 'X', href: 'https://x.com/chaufaltech' },
  { key: 'threads', label: 'Threads', href: 'https://www.threads.com/@chaufaltech' },
  { key: 'linkedin', label: 'LinkedIn', href: 'http://www.linkedin.com/in/chaufaltech' },
  { key: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/@ChaufalTech' },
]

// Collapsed by default on mobile (tap to expand); always open at md+ where
// there's room to show every column at once.
function FooterColumn({ title, id, openId, setOpenId, children }) {
  const open = openId === id

  return (
    <div className="border-b border-white/10 md:border-0 pb-4 md:pb-0">
      <button
        type="button"
        onClick={() => setOpenId(open ? null : id)}
        aria-expanded={open}
        className="w-full flex items-center justify-between md:pointer-events-none md:cursor-default"
      >
        <h4 className="font-display text-base font-medium uppercase tracking-wide text-white mb-4">
          {title}
          <span className="block w-6 h-0.5 bg-orange rounded-full mt-2" />
        </h4>
        <span
          className="shrink-0 mb-4 flex items-center justify-center text-orange text-[2rem] font-bold leading-none md:hidden"
          aria-hidden="true"
        >
          {open ? '−' : '+'}
        </span>
      </button>
      <div className={`${open ? 'block' : 'hidden'} md:block`}>{children}</div>
    </div>
  )
}

export default function Footer() {
  const [openId, setOpenId] = useState(null)

  return (
    <footer className="bg-navy text-white/80">
      <div className="section py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <img
            src="/logo/logo-primary-dark-background.svg"
            alt="Chaufal Tech"
            className="h-11 lg:h-20 w-auto mb-4"
          />
          <p className="text-sm leading-relaxed text-white/60">
            We help businesses build, modernize, automate, and optimize their digital
            presence — enterprise-quality technology, without the enterprise complexity.
          </p>
        </div>

        <FooterColumn title="Quick Links" id="links" openId={openId} setOpenId={setOpenId}>
          <ul className="space-y-2.5 text-sm pb-4 md:pb-0">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-orange transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Services" id="services" openId={openId} setOpenId={setOpenId}>
          <ul className="space-y-2.5 text-sm pb-4 md:pb-0">
            {SERVICES.map((s) => (
              <li key={s}>
                <Link to="/services" className="hover:text-orange transition-colors">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </FooterColumn>

        <FooterColumn title="Connect with Us" id="connect" openId={openId} setOpenId={setOpenId}>
          <ul className="space-y-3 text-sm pb-4 md:pb-0">
            {CONNECT_LINKS.map((c) => {
              const inner = (
                <>
                  <span className="w-7 h-7 rounded-full bg-orange/15 text-orange flex items-center justify-center shrink-0">
                    <span className="w-3.5 h-3.5 block">{SOCIAL_ICONS[c.key]}</span>
                  </span>
                  {c.label}
                </>
              )
              return (
                <li key={c.key}>
                  {c.internal ? (
                    <Link to={c.to} className="flex items-center gap-3 hover:text-orange transition-colors">
                      {inner}
                    </Link>
                  ) : (
                    <a
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 hover:text-orange transition-colors"
                    >
                      {inner}
                    </a>
                  )}
                </li>
              )
            })}
          </ul>
        </FooterColumn>
      </div>

      <div className="border-t border-white/10">
        <div className="section py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Chaufal Tech. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-orange transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-orange transition-colors">Terms of Service</a>
            <span>Building Trust Through Technology</span>
          </div>
        </div>
      </div>
    </footer>
  )
}