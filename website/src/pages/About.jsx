import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { CORE_VALUES, PRINCIPLES } from '../data/content.js'

export default function About() {
  return (
    <>
      <PageHero
        eyebrow="About Chaufal Tech"
        title="We don't sell websites. We solve business problems through technology."
        subtitle="Building Trust Through Technology — one long-term partnership at a time."
      />

      {/* VISION / MISSION / PURPOSE */}
      <section className="section py-20 grid md:grid-cols-3 gap-8">
        <div>
          <h2 className="font-display font-semibold text-xl text-ink">Vision</h2>
          <p className="text-muted mt-3 leading-relaxed text-sm">
            To empower businesses of all sizes with innovative digital solutions that
            simplify operations, accelerate growth, and create lasting value through
            technology and automation.
          </p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl text-ink">Mission</h2>
          <p className="text-muted mt-3 leading-relaxed text-sm">
            We deliver enterprise-grade websites, software, AI automation, and digital
            transformation solutions that are reliable, scalable, and focused on
            measurable business outcomes — while building long-term partnerships
            with our clients.
          </p>
        </div>
        <div>
          <h2 className="font-display font-semibold text-xl text-ink">Purpose</h2>
          <p className="text-muted mt-3 leading-relaxed text-sm">
            We believe every business — whether a startup, local enterprise, or
            established organization — deserves access to enterprise-quality
            technology without enterprise-level complexity or cost.
          </p>
        </div>
      </section>

      {/* IDENTITY */}
      <section className="bg-navy text-white py-20">
        <div className="section grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="eyebrow">Our Identity</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">
              Most agencies only build websites. <span className="text-orange">We sell business solutions.</span>
            </h2>
          </div>
          <p className="text-white/60 leading-relaxed">
            Our founder philosophy is simple: we don&apos;t sell websites, we solve business
            problems through technology. Every engagement starts with your business goals,
            not a template. Our client promise is to become the trusted partner businesses
            call when facing difficult digital challenges.
          </p>
        </div>
      </section>

      {/* CORE VALUES */}
      <section className="section py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">What We Stand For</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">Core Values</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {CORE_VALUES.map((v) => (
            <div key={v.title} className="border border-black/8 rounded-xl2 p-7">
              <div className="w-10 h-10 rounded-full bg-cream text-orange flex items-center justify-center mb-4">
                <Icon name="check" className="w-4 h-4" strokeWidth={2.5} />
              </div>
              <h3 className="font-display font-semibold text-ink">{v.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="bg-cream/40 py-20">
        <div className="section grid md:grid-cols-2 gap-12">
          <div>
            <span className="eyebrow">How We Work</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
              The Chaufal Principles
            </h2>
            <p className="text-muted mt-4 leading-relaxed">
              These principles guide every conversation, proposal, and project we take on.
            </p>
          </div>
          <ul className="space-y-4">
            {PRINCIPLES.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" className="w-3.5 h-3.5" strokeWidth={3} />
                </span>
                <span className="text-ink/80 text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PEOPLE PROMISE + FUTURE VISION */}
      <section className="section py-20 grid md:grid-cols-2 gap-8">
        <div className="border border-black/8 rounded-xl2 p-8">
          <h2 className="font-display font-semibold text-xl text-ink">Our People Promise</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            <li>Treat people with respect</li>
            <li>Provide opportunities to grow</li>
            <li>Encourage learning</li>
            <li>Expect accountability</li>
          </ul>
        </div>
        <div className="border border-black/8 rounded-xl2 p-8">
          <h2 className="font-display font-semibold text-xl text-ink">Future Vision</h2>
          <p className="text-sm text-muted mt-4 leading-relaxed">
            To become a respected technology consulting company known for solving
            complex digital challenges with professionalism, reliability, and trust.
          </p>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}
