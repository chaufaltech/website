import SolutionsHero from '../components/SolutionsHero.jsx'
import Icon from '../components/Icon.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { SOLUTIONS_CHALLENGES } from '../data/content.js'

const AUDIENCES = [
  {
    icon: 'target',
    title: 'Startups',
    description:
      'Launch fast with a solid technical foundation — websites, MVPs, and automation that scale as you grow, without enterprise overhead.',
  },
  {
    icon: 'gear',
    title: 'Local Enterprises',
    description:
      'Modernize day-to-day operations, automate repetitive work, and give your team tools that actually fit how you run the business.',
  },
  {
    icon: 'chart',
    title: 'Established Organizations',
    description:
      'Upgrade legacy systems, integrate new tools, and get strategic technology guidance that supports long-term growth.',
  },
]

const OUTCOMES = [
  { title: 'Simplify Operations', description: 'Fewer manual steps, cleaner workflows, less friction for your team.' },
  { title: 'Accelerate Growth', description: 'Digital infrastructure that scales with demand instead of slowing it down.' },
  { title: 'Create Lasting Value', description: 'Solutions built to be maintained and extended, not thrown away in a year.' },
]

export default function Solutions() {
  return (
    <>
      <SolutionsHero />

      <section id="solutions-detail" className="section py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">Common Business Challenges</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
            What&apos;s Getting in the Way?
          </h2>
          <p className="text-muted mt-4">
            We help businesses overcome the technology challenges that slow down work,
            limit growth, and create unnecessary complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mt-14">
          {SOLUTIONS_CHALLENGES.map((c) => (
            <a
              key={c.title}
              href="#who-we-work-with"
              className="group bg-white border border-black/5 rounded-xl2 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <Icon name={c.icon} className="w-9 h-9 text-orange" strokeWidth={1.6} />
              <h3 className="font-display font-bold text-ink text-[15px] leading-snug mt-4">{c.title}</h3>
              <p className="text-xs text-muted mt-2.5 leading-relaxed">{c.description}</p>
              <span className="inline-flex text-orange mt-4 transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="who-we-work-with" className="section py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">Who We Work With</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
            Solutions Built for Your Stage
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mt-14">
          {AUDIENCES.map((a) => (
            <div key={a.title} className="border border-black/8 rounded-xl2 p-8 text-center">
              <div className="w-14 h-14 mx-auto rounded-full bg-cream text-orange flex items-center justify-center mb-5">
                <Icon name={a.icon} className="w-6 h-6" />
              </div>
              <h3 className="font-display font-semibold text-lg text-ink">{a.title}</h3>
              <p className="text-sm text-muted mt-3 leading-relaxed">{a.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-navy text-white py-20">
        <div className="section text-center">
          <span className="eyebrow">What You Get</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">Outcomes We Design Around</h2>
        </div>
        <div className="section grid md:grid-cols-3 gap-6 mt-14">
          {OUTCOMES.map((o) => (
            <div key={o.title} className="bg-white/5 border border-white/10 rounded-xl2 p-7">
              <h3 className="font-display font-semibold">{o.title}</h3>
              <p className="text-sm text-white/60 mt-3 leading-relaxed">{o.description}</p>
            </div>
          ))}
        </div>
      </section>

      <CtaBanner />
    </>
  )
}