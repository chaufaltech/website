import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function CtaBanner({
  title = 'Have a Problem Technology Can Solve?',
  highlight = "Let's Talk About It.",
  subtitle = "Tell us where your business is today and where you want to take it. We'll help you explore the right way forward.",
}) {
  return (
    <section className="section py-16">
      <div className="relative bg-cream/40 border border-black/5 rounded-2xl px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-8 overflow-hidden">
        {/* subtle circuit accent bleeding off the right edge */}
        <svg viewBox="0 0 220 160" className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 w-56 h-40 text-orange/20 pointer-events-none" aria-hidden>
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

        <div className="relative text-center md:text-left max-w-xl">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-ink leading-tight">
            {title}
            <br />
            <span className="text-orange">{highlight}</span>
          </h2>
        </div>

        <div className="relative flex flex-col sm:flex-row items-center gap-6">
          <p className="text-sm text-muted max-w-xs text-center md:text-left">{subtitle}</p>
          <div className="flex flex-col items-center shrink-0">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Let&apos;s Talk <span aria-hidden>→</span>
            </Link>
            <p className="flex items-center gap-2 text-xs text-muted mt-3 whitespace-nowrap">
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