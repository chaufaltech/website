import { Link } from 'react-router-dom'
import ServicesHero from '../components/ServicesHero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import ServiceDetail from '../components/ServiceDetail.jsx'
import { SOLVE_CARDS, SERVICE_DETAILS } from '../data/content.js'

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
              <div className="aspect-[4/3.2] bg-cream/40 flex items-center justify-center p-4">
                <img src={c.image} alt="" className="w-full h-full object-contain" />
              </div>
              <div className="px-[26px] py-[23px] sm:p-[26px]">
                <h3 className="font-display font-bold text-ink">{c.title}</h3>
                <p className="text-sm text-muted mt-1.5 sm:mt-2 leading-relaxed">{c.description}</p>
                <Link to="/contact" className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-4 sm:mt-6">
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

      <CtaBanner
        title="Not Sure Which Service You Need?"
        subtitle="Tell us about your business challenge and we'll recommend the right path."
      />
    </>
  )
}