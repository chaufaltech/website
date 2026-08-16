import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import Panel from '../components/Panel.jsx'
import HeroBadges from '../components/HeroBadges.jsx'
import ProcessTrail from '../components/ProcessTrail.jsx'
import TestimonialCarousel from '../components/TestimonialCarousel.jsx'
import {
  SERVICES,
  PROCESS_STEPS,
  STATS,
  TESTIMONIALS,
  PROJECTS,
} from '../data/content.js'

const STAT_ICONS = ['smile', 'users', 'target', 'check']

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
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {SERVICES.map((s, i) => (
            <Panel
              key={s.slug}
              color="text-orange/40"
              className="border border-black/8 rounded-xl2 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <span className="absolute top-4 right-5 font-mono text-[10px] text-muted/60 tracking-widest">
                {String(i + 1).padStart(2, '0')}/{String(SERVICES.length).padStart(2, '0')}
              </span>
              <div className="w-12 h-12 rounded-xl bg-cream text-orange flex items-center justify-center mb-5">
                <Icon name={s.icon} />
              </div>
              <h3 className="font-display font-semibold text-lg text-ink">{s.title}</h3>
              <p className="text-sm text-muted mt-3 leading-relaxed">{s.summary}</p>
              <Link to="/services" className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-5">
                Learn more <span aria-hidden>→</span>
              </Link>
            </Panel>
          ))}
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
          <ul className="mt-6 space-y-3">
            {[
              '9+ Years of Industry Experience',
              'Client-Focused & Result Driven',
              'Quality Never Compromised',
              'Transparent Communication',
              'On Time Delivery, Every Time',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm text-ink/80">
                <span className="w-5 h-5 rounded-full bg-orange/15 text-orange flex items-center justify-center shrink-0">
                  <Icon name="check" className="w-3 h-3" strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-5">
          {STATS.map((stat, i) => (
            <Panel key={stat.label} color="text-orange/30" className="border border-black/8 rounded-xl2 p-6">
              <div className="w-11 h-11 rounded-full bg-cream text-orange flex items-center justify-center mb-4">
                <Icon name={STAT_ICONS[i]} className="w-5 h-5" />
              </div>
              <p className="font-mono font-semibold text-3xl text-ink tracking-tight">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </Panel>
          ))}
        </div>
      </section>

      {/* WORK PREVIEW */}
      <section className="bg-cream/40 py-20">
        <div className="section flex items-end justify-between flex-wrap gap-4 mb-14">
          <div>
            <span className="eyebrow">Our Work</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
              Solutions That Speak for Themselves
            </h2>
          </div>
          <Link to="/work" className="btn-outline-light text-sm bg-white">
            View All Projects <span aria-hidden>→</span>
          </Link>
        </div>
        <div className="section grid md:grid-cols-3 gap-8">
          {PROJECTS.map((p) => (
            <Link to="/work" key={p.title} className="group block">
              <div className="aspect-[4/3] rounded-xl2 overflow-hidden bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white/20 font-display font-bold text-4xl shadow-md group-hover:from-orange group-hover:to-orange-light transition-colors duration-300">
                {p.title.split(' ')[0][0]}
              </div>
              <Panel
                as="div"
                color="text-orange/50"
                className="bg-white rounded-xl2 shadow-lg px-5 py-4 -mt-8 mx-4 relative"
              >
                <p className="text-xs text-orange font-mono font-semibold tracking-wide uppercase">{p.category}</p>
                <h3 className="font-display font-semibold text-ink mt-1 text-sm">{p.title}</h3>
              </Panel>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-navy text-white py-20">
        <div className="section text-center">
          <span className="eyebrow justify-center">What Our Clients Say</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">
            Trusted by Clients. Proven by Results.
          </h2>
        </div>
        <div className="section mt-14">
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </div>
      </section>

      <CtaBanner />
    </>
  )
}