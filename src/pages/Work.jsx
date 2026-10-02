import { Link } from 'react-router-dom'
import WorkHero from '../components/WorkHero.jsx'
import Icon from '../components/Icon.jsx'
import { WORK_FEATURED_TOOLS, WORK_OTHER_TOOLS, WORK_IMPACT_STATS } from '../data/content.js'

// Stylized stand-ins for the two product screenshots in the design — not
// pixel-exact recreations, built from the existing design tokens (navy
// panels, orange accents) so they stay consistent if the palette changes.

function SeoGeoMockup() {
  const breakdown = [
    { label: 'Search Visibility', value: 82, color: 'bg-emerald-400' },
    { label: 'GEO Visibility', value: 76, color: 'bg-orange' },
    { label: 'Content Quality', value: 71, color: 'bg-red-400' },
    { label: 'Technical SEO', value: 68, color: 'bg-amber' },
  ]

  return (
    <div className="bg-navy-deep border border-white/10 rounded-xl p-5" aria-hidden="true">
      <div className="flex gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
        <span className="w-2.5 h-2.5 rounded-full bg-white/15" />
      </div>
      <p className="text-xs font-semibold text-white/60 mb-3">SEO / GEO Calculator</p>
      <div className="flex items-center gap-2 mb-5">
        <span className="flex-1 text-xs text-white/40 border border-white/10 rounded-lg px-3 py-2 truncate">
          digital marketing tools
        </span>
        <span className="text-xs font-semibold bg-orange text-white rounded-lg px-3 py-2 shrink-0">
          Analyze
        </span>
      </div>
      <p className="text-[11px] uppercase tracking-wide text-white/40 mb-3">Overall Score</p>
      <div className="flex items-center gap-5">
        <div className="w-20 h-20 rounded-full border-4 border-emerald-400/70 flex flex-col items-center justify-center shrink-0">
          <span className="font-display font-bold text-xl text-white leading-none">78</span>
          <span className="text-[10px] text-white/40">/100</span>
        </div>
        <div className="flex-1 space-y-2">
          {breakdown.map((row) => (
            <div key={row.label} className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-white/60">
                <span className={`w-1.5 h-1.5 rounded-full ${row.color}`} />
                {row.label}
              </span>
              <span className="text-white/80 font-medium">{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QaAutomationMockup() {
  const tests = [
    { name: 'Login Flow', time: '2.4s' },
    { name: 'Dashboard Load', time: '3.1s' },
    { name: 'Data Sync', time: '4.2s' },
    { name: 'API Integration', time: '5.6s' },
    { name: 'Logout Flow', time: '1.8s' },
  ]

  return (
    <div className="bg-navy-deep border border-white/10 rounded-xl p-5" aria-hidden="true">
      <div className="flex gap-1.5 mb-4">
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-amber/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400/70" />
      </div>
      <p className="text-xs font-semibold text-white/60 mb-3">Test Runs</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
          <p className="font-display font-bold text-lg leading-none text-emerald-400">152</p>
          <p className="text-[10px] text-white/40 mt-1">Passed</p>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
          <p className="font-display font-bold text-lg leading-none text-red-400">12</p>
          <p className="text-[10px] text-white/40 mt-1">Failed</p>
        </div>
        <div className="bg-white/5 rounded-lg px-3 py-2 text-center">
          <p className="font-display font-bold text-lg leading-none text-white/50">3</p>
          <p className="text-[10px] text-white/40 mt-1">Skipped</p>
        </div>
      </div>
      <div className="space-y-2">
        {tests.map((t) => (
          <div key={t.name} className="flex items-center justify-between text-[11px] text-white/70">
            <span className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Icon name="check" className="w-2 h-2" strokeWidth={4} />
              </span>
              {t.name}
            </span>
            <span className="text-white/40">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const MOCKUPS = {
  'seo-geo-calculator': SeoGeoMockup,
  'qa-automation-tool': QaAutomationMockup,
}

function FeaturedToolCard({ tool }) {
  const Mockup = MOCKUPS[tool.slug]

  return (
    <div className="bg-navy rounded-2xl border border-white/10 p-7 md:p-8 grid md:grid-cols-2 gap-8 items-center">
      <div>
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-wide uppercase text-orange bg-orange/10 rounded-full px-3 py-1.5">
          <Icon name="gear" className="w-3 h-3" strokeWidth={2.2} />
          {tool.badge}
        </span>
        <h3 className="font-display font-bold text-2xl text-white mt-4 leading-tight">
          {tool.titleLines
            ? tool.titleLines.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))
            : tool.title}
        </h3>
        <p className="text-sm text-white/60 mt-3 leading-relaxed">{tool.description}</p>
        <ul className="mt-5 space-y-2.5">
          {tool.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-white/80">
              <span className="w-4 h-4 rounded-full bg-orange text-white flex items-center justify-center shrink-0">
                <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3.5} />
              </span>
              {feature}
            </li>
          ))}
        </ul>
        {/* Placeholder: point this at the tool's real URL once it's live. */}
        <span className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-6">
          {tool.ctaLabel} <span aria-hidden>→</span>
        </span>
      </div>

      {Mockup && <Mockup />}
    </div>
  )
}

function OtherToolCard({ tool }) {
  // Tools without a page yet (no `to`) show plain text instead of a dead link.
  const LearnMore = tool.to ? Link : 'span'
  const linkProps = tool.to ? { to: tool.to } : {}

  return (
    <div className="border border-white/10 rounded-xl2 p-6">
      <div className="w-11 h-11 rounded-full bg-orange/10 text-orange flex items-center justify-center">
        <Icon name={tool.icon} className="w-5 h-5" strokeWidth={1.8} />
      </div>
      <h3 className="font-display font-bold text-white text-[15px] mt-4">{tool.title}</h3>
      <p className="text-sm text-white/50 mt-2 leading-relaxed">{tool.description}</p>
      <LearnMore
        {...linkProps}
        className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-4"
      >
        {tool.to ? 'Try It' : 'Learn more'} <span aria-hidden>→</span>
      </LearnMore>
    </div>
  )
}

export default function Work() {
  return (
    <>
      <WorkHero />

      {/* FEATURED PROJECTS */}
      <section className="section py-20">
        <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start mb-14">
          <div>
            <span className="eyebrow">Featured Projects</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink leading-tight">
              Tools we&apos;ve built.
              <br />
              For real-world use.
            </h2>
          </div>
          <p className="text-muted max-w-sm leading-relaxed lg:pt-2">
            These are some of the products and tools we&apos;ve developed at Chaufal
            Tech. They showcase our technical capabilities, problem-solving
            approach, and commitment to building useful, high-quality software.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {WORK_FEATURED_TOOLS.map((tool) => (
            <FeaturedToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* OTHER PROJECTS */}
      <section className="bg-navy text-white py-20">
        <div className="section">
          <div className="grid lg:grid-cols-[1fr_auto] gap-8 items-start mb-14">
            <div>
              <span className="eyebrow">Other Projects</span>
              <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 leading-tight">
                More tools. Same mindset.
              </h2>
            </div>
            <p className="text-white/50 max-w-sm leading-relaxed">
              Alongside our featured products, we&apos;ve built a range of internal
              tools and utilities that help us work smarter, move faster, and stay
              ahead.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WORK_OTHER_TOOLS.map((tool) => (
              <OtherToolCard key={tool.title} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* THE IMPACT */}
      <section className="bg-paper text-ink pb-20 border-t border-black/5">
        <div className="section pt-16">
          <span className="eyebrow">The Impact</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 max-w-lg leading-tight text-ink">
            Built for efficiency, scalability and growth.
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-black/10 mt-12 max-w-3xl">
            {WORK_IMPACT_STATS.map((stat) => (
              <div key={stat.label} className="text-center px-3 first:pl-0">
                <p className="font-display font-bold text-3xl md:text-4xl text-orange">{stat.value}</p>
                <p className="text-xs md:text-sm text-muted mt-2 leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-navy text-white rounded-2xl mt-14 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left max-w-md">
              <h3 className="font-display font-bold text-xl md:text-2xl text-white leading-tight">
                Have an idea for a custom tool or product?
                <br />
                <span className="text-orange">Let&apos;s Build It Together.</span>
              </h3>
              <p className="text-sm text-white/50 mt-3 leading-relaxed">
                We&apos;re always open to new ideas — whether it&apos;s a custom
                application, automation tool, or something entirely new. Let&apos;s
                talk about what we can build.
              </p>
            </div>
            <Link to="/contact" className="btn-primary shrink-0">
              Let&apos;s Talk <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}