import { Link } from 'react-router-dom'
import ServicesHero from '../components/ServicesHero.jsx'
import Icon from '../components/Icon.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import ServiceDetail from '../components/ServiceDetail.jsx'
import { SERVICES, SOLVE_CARDS, SERVICE_DETAILS } from '../data/content.js'

export default function Services() {
  return (
    <>
      <ServicesHero />

      {/* WHAT ARE YOU TRYING TO SOLVE */}
      <section className="section py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">What Are You Trying to Solve?</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
            Every business challenge needs the right approach.
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {SOLVE_CARDS.map((c) => (
            <div
              key={c.title}
              className="bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div className="aspect-[4/3] bg-cream/40 flex items-center justify-center p-4">
                <img src={c.image} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="p-6">
                <h3 className="font-display font-bold text-ink">{c.title}</h3>
                <p className="text-sm text-muted mt-2 leading-relaxed">{c.description}</p>
                <Link to="/contact" className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-6">
                  {c.linkLabel} <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {SERVICE_DETAILS.map((s) => (
        <ServiceDetail key={s.number} {...s} />
      ))}

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