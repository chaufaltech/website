import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function CtaBanner({
  title = 'Have a Problem Technology Can Solve?',
  highlight = "Let's Talk About It.",
  subtitle = "Tell us where your business is today and where you want to take it. We'll help you explore the right way forward.",
  mobileSubtitle,
}) {
  return (
    <section className="section py-16">
      {/* Card is navy — page background behind it is untouched.
          Layout tiers:
          - base (mobile): everything stacked, centered
          - sm (tablet): 2-column grid — heading | subtitle+button, no divider
          - lg (desktop): original 3-part row with divider */}
      <div className="relative bg-navy border border-white/10 rounded-2xl px-6 py-10 sm:px-8 lg:px-12 flex flex-col sm:grid sm:grid-cols-2 sm:gap-10 lg:flex lg:flex-row lg:items-center lg:justify-between items-center gap-8 lg:gap-8 overflow-hidden">
        {/* subtle circuit accent bleeding off the right edge */}
        <svg viewBox="0 0 220 160" className="hidden lg:block absolute -right-6 top-1/2 -translate-y-1/2 w-56 h-40 text-orange/25 pointer-events-none" aria-hidden>
          <g stroke="currentColor" strokeWidth="1.5" fill="none">
            <path d="M40 20 L100 20 L100 50" />
            <path d="M60 70 L130 70" />
            <path d="M40 110 L100 110 L100 140" />
          </g>
          <g fill="currentColor">
            <circle cx="100" cy="50" r="3" />
            <circle cx="130" cy="70" r="3" />
            <circle cx="100" cy="140" r="3" />
          </g>
        </svg>

        <div className="relative text-center sm:text-left max-w-xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white leading-tight">
            {title}
            <br />
            <span className="text-orange">{highlight}</span>
          </h2>
        </div>

        {/* Divider only makes sense in the true 3-part desktop row. */}
        <span className="hidden lg:block w-px h-16 bg-white/10 shrink-0" aria-hidden />

        <div className="relative flex flex-col lg:flex-row items-center gap-6 w-full lg:w-auto">
          {mobileSubtitle ? (
            <>
              <p className="text-sm text-white/60 max-w-xs text-center sm:text-left sm:hidden">{mobileSubtitle}</p>
              <p className="hidden sm:block text-sm text-white/60 max-w-xs text-center sm:text-left">{subtitle}</p>
            </>
          ) : (
            <p className="text-sm text-white/60 max-w-xs text-center sm:text-left">{subtitle}</p>
          )}
          <div className="flex flex-col items-center shrink-0 w-full sm:w-auto">
            <Link
              to="/contact"
              className="btn-primary w-full max-w-[260px] justify-center sm:w-auto sm:max-w-none"
            >
              Let&apos;s Talk <span aria-hidden>→</span>
            </Link>
            <p className="flex items-center gap-2 text-[13px] text-white/70 mt-3 whitespace-nowrap">
              <span className="w-4 h-4 rounded-full border border-orange text-orange flex items-center justify-center shrink-0">
                <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3.5} />
              </span>
              No obligation. Just a conversation.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}