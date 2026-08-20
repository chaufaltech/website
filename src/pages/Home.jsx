import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import ClosingCta from '../components/ClosingCta.jsx'
import HeroBadges from '../components/HeroBadges.jsx'
import ProcessTrail from '../components/ProcessTrail.jsx'
import { SERVICES, PROCESS_STEPS, STATS } from '../data/content.js'

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section
        className="bg-navy text-white overflow-hidden relative bg-[url('/images/home-hero-image.png')] bg-cover bg-right lg:bg-center bg-no-repeat"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-navy/10 lg:to-navy/5" aria-hidden />
        <div className="section pt-36 pb-16 lg:pt-48 lg:pb-24 grid lg:grid-cols-2 gap-16 items-center relative">
          <div>
            <span className="eyebrow">Welcome to Chaufal Tech</span>
            <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-[4rem] leading-[1.02] tracking-tight mt-6">
              Every Problem
              <br />
              Has a <span className="text-orange">Solution.</span>
            </h1>
            <p className="text-white/60 text-lg mt-6 max-w-lg">
              We help businesses build, modernize, automate, and optimize their
              digital presence.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/contact" className="btn-primary">
                Let&apos;s Solve Your Problem
                <span className="w-6 h-6 rounded-full bg-black/20 flex items-center justify-center" aria-hidden>
                  →
                </span>
              </Link>
              <Link to="/services" className="btn-outline-dark">
                Explore Services
              </Link>
            </div>

            <div className="mt-10 inline-flex items-center gap-4 border border-white/15 rounded-2xl px-5 py-4">
              <div className="w-14 h-14 rounded-full border border-orange/40 bg-orange/10 text-orange flex items-center justify-center shrink-0">
                <Icon name="chart" className="w-6 h-6" />
              </div>
              <div>
                <p className="font-display font-bold text-white">
                  <span className="text-orange text-xl">50+</span> Projects Delivered
                </p>
                <p className="text-sm text-white/50 mt-1">Websites • Automation • Digital Solutions</p>
              </div>
            </div>
          </div>

          <HeroBadges />
        </div>
      </section>

      {/* SERVICES */}
      <section className="section py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">What We Do</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
            Digital Solutions That Drive Growth
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
          {SERVICES.map((s) => (
            <div
              key={s.slug}
              className="bg-white border border-black/5 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
            >
              <div className="relative aspect-[16/10] bg-cream">
                <img src={s.image} alt="" className="w-full h-full object-cover" />
                <div className="absolute -bottom-5 left-6 w-12 h-12 rounded-xl bg-navy text-orange flex items-center justify-center shadow-md">
                  <Icon name={s.icon} className="w-5 h-5" />
                </div>
              </div>
              <div className="p-8 pt-9">
                <h3 className="font-display font-bold text-lg text-ink">{s.title}</h3>
                <span className="block w-8 h-0.5 bg-orange rounded-full mt-2 mb-4" />
                <p className="text-sm text-muted leading-relaxed">{s.summary}</p>
                <Link to="/services" className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-5">
                  Learn more <span aria-hidden>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* TRUST STRIP */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 mt-16">
          {[
            { icon: 'rocket', title: 'Business-Focused', description: 'We build solutions that solve real business challenges.' },
            { icon: 'shield', title: 'Reliable & Secure', description: 'Security, performance, and reliability are built into everything we do.' },
            { icon: 'users', title: 'Transparent Process', description: 'Clear communication, regular updates, and no surprises.' },
            { icon: 'target', title: 'Results That Matter', description: 'We focus on measurable results that drive your business forward.' },
          ].map((f) => (
            <div key={f.title} className="flex items-start gap-4">
              <div className="w-[46px] h-[46px] rounded-full bg-navy text-orange flex items-center justify-center shrink-0">
                <Icon name={f.icon} className="w-[19px] h-[19px]" />
              </div>
              <div>
                <h4 className="font-display font-semibold text-ink text-sm">{f.title}</h4>
                <p className="text-sm text-muted mt-1 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* IN-SECTION CTA */}
        <div className="bg-navy rounded-2xl mt-16 px-8 py-10 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="absolute inset-0 bg-blueprint opacity-40 [mask-image:radial-gradient(circle_at_left,black,transparent_70%)]" aria-hidden />
          <div className="relative text-center md:text-left">
            <h3 className="font-display font-bold text-white text-2xl md:text-3xl">
              Let&apos;s build the right solution <br className="hidden md:block" />
              <span className="text-orange">for your business.</span>
            </h3>
          </div>
          <p className="relative text-white/60 max-w-xs text-center md:text-left">
            Share your project with us and let&apos;s turn your ideas into real results.
          </p>
          <Link to="/contact" className="btn-primary relative shrink-0">
            Start Your Project <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-navy text-white py-20 overflow-hidden">
        <div className="section text-center">
          <span className="eyebrow justify-center">Our Approach</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">
            A Simple. Proven. Reliable Process.
          </h2>
        </div>
        <div className="section mt-16">
          <ProcessTrail steps={PROCESS_STEPS} />
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section py-20 grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <span className="eyebrow">Why Choose Us</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
            Technology Built on Trust &amp; Quality
          </h2>
          <p className="text-muted mt-5 leading-relaxed">
            At Chaufal Tech, we don&apos;t just deliver projects. We build relationships,
            create value, and earn long-term partnerships.
          </p>
          <ul className="mt-8 space-y-6">
            {[
              { icon: 'target', title: 'Business First', description: 'Solutions aligned with real business goals and measurable outcomes.' },
              { icon: 'shield', title: 'Quality Without Compromise', description: 'Secure, reliable, and scalable technology built with best practices.' },
              { icon: 'message', title: 'Clear Communication', description: 'Transparent updates, honest feedback, and no surprises—every step of the way.' },
              { icon: 'handshake', title: 'Long-Term Partnership', description: 'We stay with you beyond delivery to support growth and long-term success.' },
            ].map((item, i, arr) => (
              <li
                key={item.title}
                className={`flex items-start gap-4 ${i < arr.length - 1 ? 'pb-6 border-b border-black/8' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-navy text-orange flex items-center justify-center shrink-0">
                  <Icon name={item.icon} className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-ink">{item.title}</h3>
                  <p className="text-sm text-muted mt-1 leading-relaxed">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative border border-black/8 rounded-3xl p-8 md:p-10">
          <div className="grid grid-cols-2 gap-x-8 gap-y-10">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="w-16 h-16 rounded-full bg-orange/10 text-orange flex items-center justify-center mx-auto">
                  <Icon name={stat.icon} className="w-7 h-7" />
                </div>
                <p className="font-display font-bold text-5xl text-ink tracking-tight mt-4">{stat.value}</p>
                <span className="block w-8 h-0.5 bg-orange rounded-full mx-auto mt-3 mb-3" />
                <h4 className="font-display font-bold text-ink">{stat.label}</h4>
                <p className="text-sm text-muted mt-1 leading-relaxed">{stat.description}</p>
              </div>
            ))}
          </div>

          {/* divider cross */}
          <div className="hidden sm:block absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-px bg-black/10" aria-hidden />
          <div className="hidden sm:block absolute left-8 right-8 top-1/2 -translate-y-1/2 h-px bg-black/10" aria-hidden />

          {/* logo badge at the intersection */}
          <div className="hidden sm:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white border border-black/10 shadow-md items-center justify-center">
            <img src="/logo/logo-icon.svg" alt="" className="w-9 h-9" />
          </div>
        </div>
      </section>

      <ClosingCta />
    </>
  )
}