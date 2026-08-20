import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

const FEATURES = [
  { icon: 'users', title: 'Expert Team', description: 'Experienced professionals dedicated to your success.' },
  { icon: 'shield-check', title: 'Reliable Solutions', description: 'Secure, scalable and built for the future.' },
  { icon: 'clock', title: 'On-Time Delivery', description: 'We value your time and always deliver on it.' },
  { icon: 'chart', title: 'Business Focused', description: 'Solutions that drive real value for your business.' },
]

export default function ClosingCta() {
  return (
    <section className="section py-20">
      <div className="relative bg-cream/40 rounded-3xl shadow-xl border border-black/5 p-8 md:p-12 grid lg:grid-cols-[3fr_auto_1fr] gap-10 items-center overflow-hidden">
        {/* LEFT */}
        <div>
          <span className="eyebrow">Ready to Get Started?</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink leading-tight">
            Have a Business Challenge?
            <br />
            <span className="text-orange">Let&apos;s Solve It Together.</span>
          </h2>
          <p className="text-muted mt-4 max-w-md leading-relaxed">
            Share your goals with us and let our experts craft the right solution to
            help you move forward with confidence.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-6 mt-10">
            {FEATURES.map((f, i) => (
              <div key={f.title} className={i > 0 ? 'sm:border-l sm:border-black/10 sm:pl-6' : ''}>
                <div className="w-12 h-12 rounded-full bg-orange/10 text-orange flex items-center justify-center">
                  <Icon name={f.icon} className="w-5 h-5" />
                </div>
                <h4 className="font-display font-bold text-ink text-sm mt-3">{f.title}</h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* DIVIDER */}
        <div className="hidden lg:block w-px h-full bg-black/10" aria-hidden />

        {/* RIGHT */}
        <div className="relative flex flex-col items-center text-center py-6">
          {/* full-height circuit accent, bleeding into the card's corners */}
          <svg viewBox="0 0 320 420" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full text-orange/25 pointer-events-none" aria-hidden>
            <g stroke="currentColor" strokeWidth="1.5" fill="none">
              {/* left stub */}
              <path d="M0 210 L55 210" />
              {/* upper right cluster */}
              <path d="M180 90 L250 90 L250 40 L300 40" />
              <path d="M170 110 L220 110 L220 150" />
              <path d="M230 150 L300 150" />
              {/* lower right cluster */}
              <path d="M180 300 L240 300 L240 350 L300 350" />
              <path d="M170 280 L210 280 L210 250" />
              <path d="M225 250 L300 250" />
            </g>
            <g fill="currentColor">
              <circle cx="0" cy="210" r="4" />
              <circle cx="250" cy="40" r="3" />
              <circle cx="300" cy="40" r="3" />
              <circle cx="220" cy="150" r="3" />
              <circle cx="300" cy="150" r="3" />
              <circle cx="240" cy="350" r="3" />
              <circle cx="300" cy="350" r="3" />
              <circle cx="210" cy="250" r="3" />
              <circle cx="300" cy="250" r="3" />
            </g>
            {/* dotted grid accent, top-right corner */}
            <g fill="currentColor" opacity="0.5">
              {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 4 }).map((_, col) => (
                  <circle key={`${row}-${col}`} cx={250 + col * 16} cy={10 + row * 16} r="1.6" />
                ))
              )}
            </g>
          </svg>

          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-orange/10 blur-2xl scale-150" aria-hidden />
            <div className="absolute -inset-5 rounded-full border border-orange/15" aria-hidden />
            <div className="absolute -inset-2.5 rounded-full border border-orange/25" aria-hidden />
            <div className="relative w-28 h-28 rounded-full bg-white shadow-lg flex items-center justify-center">
              <img src="/logo/logo-icon.svg" alt="" className="w-14 h-14" />
            </div>
          </div>

          <Link to="/contact" className="relative inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-8 py-4 rounded-xl transition-colors mt-10">
            Let&apos;s Talk <span aria-hidden>→</span>
          </Link>
          <p className="relative flex items-center gap-2 text-sm text-muted mt-4">
            <span className="w-4 h-4 rounded-full border border-orange text-orange flex items-center justify-center shrink-0">
              <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3.5} />
            </span>
            No obligation. Just a conversation.
          </p>
        </div>
      </div>
    </section>
  )
}