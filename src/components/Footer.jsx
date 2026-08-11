import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Work', to: '/work' },
  { label: 'Process', to: '/process' },
  { label: 'Contact', to: '/contact' },
]

const SERVICES = [
  'Websites & Web Applications',
  'Automation & Integrations',
  'Digital Modernization',
  'Technology Consulting',
]

const CONTACT_LINES = [
  { icon: 'headset', text: '+1 833-000-0000' },
  { icon: 'globe', text: 'hello@chaufaltech.com' },
  { icon: 'chart', text: 'chaufaltech.com' },
]

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="section py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <img
            src="/logo/chaufaltech_primary_editable.svg"
            alt="Chaufal Tech"
            className="h-11 w-auto mb-4"
          />
          <p className="text-sm leading-relaxed text-white/60">
            We help businesses build, modernize, automate, and optimize their digital
            presence — enterprise-quality technology, without the enterprise complexity.
          </p>
          <div className="flex gap-3 mt-5">
            {['LinkedIn', 'Facebook', 'Instagram'].map((label) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-xs hover:border-orange hover:text-orange transition-colors"
              >
                {label[0]}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2.5 text-sm">
            {QUICK_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="hover:text-orange transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">Services</h4>
          <ul className="space-y-2.5 text-sm">
            {SERVICES.map((s) => (
              <li key={s}>
                <Link to="/services" className="hover:text-orange transition-colors">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-white mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            {CONTACT_LINES.map((c) => (
              <li key={c.text} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-orange text-white flex items-center justify-center shrink-0">
                  <Icon name={c.icon} className="w-3.5 h-3.5" />
                </span>
                {c.text}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="section py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <span>© {new Date().getFullYear()} Chaufal Tech. All rights reserved.</span>
          <span>Building Trust Through Technology</span>
        </div>
      </div>
    </footer>
  )
}
