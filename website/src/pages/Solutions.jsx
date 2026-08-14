import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import CtaBanner from '../components/CtaBanner.jsx'

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
      <PageHero
        eyebrow="Solutions"
        title="Enterprise-Quality Technology, Without Enterprise Complexity"
        subtitle="Every business deserves the same level of technology — we tailor how we deliver it to where you are."
      />

      <section className="section py-20">
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
