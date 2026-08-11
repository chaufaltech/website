import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import HeroGraphic from '../components/HeroGraphic.jsx'
import TestimonialCarousel from '../components/TestimonialCarousel.jsx'
import {
  SERVICES,
  PROCESS_STEPS,
  STATS,
  TESTIMONIALS,
  PROJECTS,
  TRUSTED_LOGOS,
} from '../data/content.js'

const STAT_ICONS = ['smile', 'users', 'target', 'check']
const HERO_ITEMS = [
  { icon: 'globe', label: 'Websites' },
  { icon: 'gear', label: 'Automation Integrations' },
  { icon: 'cloud', label: 'Modernization' },
  { icon: 'chart', label: 'Technology Consulting' },
]
const AVATAR_INITIALS = ['R', 'N', 'A']

export default function Home() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white overflow-hidden relative">
        <div className="section py-16 lg:py-24 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="eyebrow bg-white/5 px-4 py-2 rounded-full">
              <Icon name="check" className="w-3.5 h-3.5" /> Welcome to Chaufal Tech
            </span>
            <h1 className="font-display font-extrabold text-5xl sm:text-6xl lg:text-[4rem] leading-[1.02] tracking-tight mt-6">
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
                Explore Our Services
              </Link>
            </div>

            <div className="flex items-center gap-4 mt-10">
              <div className="flex -space-x-3" aria-hidden>
                {AVATAR_INITIALS.map((letter, i) => (
                  <div
                    key={i}
                    className="w-11 h-11 rounded-full border-2 border-navy bg-orange/25 text-orange flex items-center justify-center text-sm font-semibold"
                  >
                    {letter}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/60 leading-snug">
                Trusted by Businesses <br className="hidden sm:block" /> to deliver real results
              </p>
            </div>
          </div>

          <div>
            <HeroGraphic />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-10">
              {HERO_ITEMS.map((item) => (
                <div key={item.label} className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 rounded-full border border-orange/40 bg-orange/10 text-orange flex items-center justify-center shrink-0">
                    <Icon name={item.icon} className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-white/70 leading-tight">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TRUSTED BY STRIP */}
      <section className="border-b border-black/5">
        <div className="section py-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <p className="font-display font-semibold text-ink shrink-0">
            Trusted by Businesses <br className="hidden md:block" /> Like Yours
          </p>
          <div className="flex flex-wrap items-center gap-x-10 gap-y-4">
            {TRUSTED_LOGOS.map((logo, i) => (
              <div key={i} className="flex items-center gap-2 text-muted opacity-70">
                <Icon name={logo.icon} className="w-4 h-4" />
                <span className="text-sm font-medium">{logo.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="section py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow">What We Do</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
            Digital Solutions That Drive Growth
          </h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
          {SERVICES.map((s) => (
            <div key={s.slug} className="border border-black/8 rounded-xl2 p-7 hover:shadow-lg hover:-translate-y-1 transition-all duration-200">
              <div className="w-12 h-12 rounded-xl bg-cream text-orange flex items-center justify-center mb-5">
                <Icon name={s.icon} />
              </div>
              <h3 className="font-display font-semibold text-lg text-ink">{s.title}</h3>
              <p className="text-sm text-muted mt-3 leading-relaxed">{s.summary}</p>
              <Link to="/services" className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-5">
                Learn more <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="bg-navy text-white py-20">
        <div className="section text-center">
          <span className="eyebrow">Our Approach</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">
            A Simple. Proven. Reliable Process.
          </h2>
        </div>
        <div className="section mt-14">
          <div className="flex flex-wrap lg:flex-nowrap items-stretch justify-center gap-x-2 gap-y-8">
            {PROCESS_STEPS.map((step, i) => (
              <div key={step.number} className="flex items-center">
                <div className="w-40 sm:w-44 border border-white/10 rounded-xl2 p-5 text-center">
                  <div className="relative w-16 h-16 mx-auto rounded-full border-2 border-orange/30 flex items-center justify-center">
                    <div
                      className="absolute inset-0 rounded-full border-2 border-orange"
                      style={{ clipPath: 'polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 50% 100%)' }}
                    />
                    <Icon name={STAT_ICONS[i % STAT_ICONS.length]} className="w-6 h-6 relative" />
                  </div>
                  <p className="text-orange text-xs font-semibold mt-3">{step.number}</p>
                  <h3 className="font-display font-semibold mt-1">{step.title}</h3>
                  <p className="text-xs text-white/50 mt-2 leading-relaxed">{step.description}</p>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <span className="hidden lg:block text-white/20 px-1" aria-hidden>
                    <Icon name="chevron" className="w-5 h-5" />
                  </span>
                )}
              </div>
            ))}
          </div>
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
            <div key={stat.label} className="border border-black/8 rounded-xl2 p-6">
              <div className="w-11 h-11 rounded-full bg-cream text-orange flex items-center justify-center mb-4">
                <Icon name={STAT_ICONS[i]} className="w-5 h-5" />
              </div>
              <p className="font-display font-extrabold text-3xl text-ink">{stat.value}</p>
              <p className="text-sm text-muted mt-1">{stat.label}</p>
            </div>
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
              <div className="bg-white rounded-xl2 shadow-lg px-5 py-4 -mt-8 mx-4 relative">
                <p className="text-xs text-orange font-semibold">{p.category}</p>
                <h3 className="font-display font-semibold text-ink mt-1 text-sm">{p.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-navy text-white py-20">
        <div className="section text-center">
          <span className="eyebrow">What Our Clients Say</span>
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
