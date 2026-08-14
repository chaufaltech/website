import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Services', to: '/services' },
  { label: 'Solutions', to: '/solutions' },
  { label: 'Work', to: '/work' },
  { label: 'Process', to: '/process' },
  { label: 'Blog', to: '/blog' },
  { label: 'Contact', to: '/contact' },
]

function Logo() {
  return (
    <Link to="/" className="flex items-center shrink-0">
      <img
        src="/logo/logo-primary-dark-background.svg"
        alt="Chaufal Tech"
        className="h-12 lg:h-14 xl:h-16 2xl:h-20 w-auto"
      />
    </Link>
  )
}

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-navy/70 backdrop-blur-md border-b border-white/10">
      <div className="section flex items-center justify-between h-20 lg:h-24">
        <Logo />

        <nav className="hidden lg:flex items-center gap-4 xl:gap-7 2xl:gap-9">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `relative text-[13px] xl:text-[15px] font-medium whitespace-nowrap transition-colors pb-1.5 ${
                  isActive
                    ? 'text-orange after:absolute after:left-0 after:right-0 after:-bottom-0 after:h-0.5 after:bg-orange after:rounded-full'
                    : 'text-white/75 hover:text-orange'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3 shrink-0">
          {/* Reserved spot: add "Log in" link here once auth/member area is built */}
          <Link to="/contact" className="btn-primary text-xs xl:text-sm py-2.5 xl:py-3 pl-4 xl:pl-5 pr-2 whitespace-nowrap">
            Let&apos;s Talk
            <span className="w-5 h-5 xl:w-6 xl:h-6 rounded-full bg-black/20 flex items-center justify-center shrink-0" aria-hidden>
              →
            </span>
          </Link>
        </div>

        <button
          className="lg:hidden inline-flex flex-col gap-1.5 p-2 shrink-0"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`block h-0.5 w-6 bg-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-white/10 bg-navy/90 backdrop-blur-md">
          <nav className="section flex flex-col py-4">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `py-3 text-sm font-medium border-b border-white/10 last:border-0 ${
                    isActive ? 'text-orange' : 'text-white/75'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary text-sm mt-4 justify-center">
              Let&apos;s Talk
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}