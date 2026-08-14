import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { SERVICES } from '../data/content.js'

export default function Services() {
  return (
    <>
      <PageHero
        eyebrow="What We Do"
        title="Digital Solutions That Drive Growth"
        subtitle="Enterprise-grade websites, software, automation, and consulting — built around measurable outcomes."
      />

      <section className="section py-20 space-y-16">
        {SERVICES.map((s, i) => (
          <div
            key={s.slug}
            className={`grid md:grid-cols-2 gap-10 items-center ${
              i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''
            }`}
          >
            <div className="aspect-[4/3] rounded-xl2 bg-navy flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-orange/20 text-orange flex items-center justify-center">
                <Icon name={s.icon} className="w-9 h-9" />
              </div>
            </div>
            <div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-ink">{s.title}</h2>
              <p className="text-muted mt-4 leading-relaxed">{s.summary}</p>
              <ul className="mt-6 space-y-3">
                {s.details.map((d) => (
                  <li key={d} className="flex items-center gap-3 text-sm text-ink/80">
                    <span className="w-5 h-5 rounded-full bg-cream text-orange flex items-center justify-center shrink-0">
                      <Icon name="check" className="w-3 h-3" strokeWidth={3} />
                    </span>
                    {d}
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-primary mt-7 text-sm">
                Discuss This Service <span aria-hidden>→</span>
              </Link>
            </div>
          </div>
        ))}
      </section>

      <CtaBanner
        title="Not Sure Which Service You Need?"
        subtitle="Tell us about your business challenge and we'll recommend the right path."
      />
    </>
  )
}
