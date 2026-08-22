import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function AboutCta({
  eyebrow = "Let's Work Together",
  title = "Have a Challenge in Mind? Let's Figure Out the Right Way Forward",
  subtitle = "Tell us what you're trying to build, improve, automate, or modernize. We'll help you understand the practical next step.",
  buttonText = 'Start a Conversation',
}) {
  return (
    <section className="section py-16">
      <div className="relative bg-cream/40 border border-black/5 border-l-4 border-l-orange rounded-2xl px-8 py-8 md:px-12 md:py-9 overflow-hidden">
        {/* subtle circuit + dot-grid accent, top-right corner */}
        <svg viewBox="0 0 220 160" className="hidden md:block absolute right-0 top-0 w-64 h-full text-orange/15 pointer-events-none" aria-hidden>
          <g stroke="currentColor" strokeWidth="1.5" fill="none">
            <path d="M120 10 L170 10 L170 40 L210 40" />
            <path d="M150 55 L200 55" />
            <path d="M120 150 L160 150 L160 120 L210 120" />
          </g>
          <g fill="currentColor">
            <circle cx="170" cy="40" r="3" />
            <circle cx="210" cy="40" r="3" />
            <circle cx="200" cy="55" r="3" />
            <circle cx="160" cy="120" r="3" />
            <circle cx="210" cy="120" r="3" />
          </g>
          <g fill="currentColor" opacity="0.6">
            {[0, 1].map((row) =>
              [0, 1].map((col) => <rect key={`${row}-${col}`} x={100 + col * 10} y={8 + row * 10} width="6" height="6" rx="1" />)
            )}
          </g>
        </svg>

        <div className="relative grid md:grid-cols-[1fr_auto_auto] gap-8 items-center">
          <div>
            <span className="eyebrow">{eyebrow}</span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink leading-tight mt-3 max-w-lg">
              {title}
              <span className="text-orange">.</span>
            </h2>
            <span className="block w-14 h-1 bg-orange rounded-full mt-4" />
            <p className="text-sm text-muted mt-4 max-w-md leading-relaxed">{subtitle}</p>
          </div>

          <div className="hidden md:block w-px h-28 bg-black/10" aria-hidden />

          <div className="flex flex-col items-start gap-4">
            <Link to="/contact" className="btn-primary">
              {buttonText} <span aria-hidden>→</span>
            </Link>
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0">
                <Icon name="shield" className="w-4 h-4" />
              </span>
              <p className="text-xs text-muted leading-relaxed">
                No obligation. No pressure.
                <br />
                Just a conversation about what you need.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}