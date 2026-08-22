import Icon from './Icon.jsx'

const STEPS = [
  { icon: 'browser', label: 'Build' },
  { icon: 'gear', label: 'Automate' },
  { icon: 'cloud-upload', label: 'Modernize' },
  { icon: 'message', label: 'Support & Evolve' },
]

export default function ServicesHero() {
  return (
    <section className="bg-navy text-white overflow-hidden relative bg-[url('/images/services-hero-background-clean.png')] bg-cover bg-right lg:bg-center bg-no-repeat">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,27,42,1)_0%,rgba(13,27,42,0.9)_45%,rgba(13,27,42,0.55)_70%,rgba(13,27,42,0.15)_100%)]"
        aria-hidden
      />
      <div className="section pt-36 pb-16 lg:pt-48 lg:pb-24 relative">
        <span className="eyebrow">Our Services</span>
        <h1 className="font-display font-bold text-4xl md:text-[45px] leading-tight mt-4 max-w-2xl">
          The Right Technology for the Problem at Hand<span className="text-orange">.</span>
        </h1>
        <p className="text-white/75 mt-5 max-w-lg leading-relaxed">
          From websites and custom applications to automation and modernization, we
          design practical solutions around what your business actually needs.
        </p>

        <div className="inline-flex flex-wrap items-center gap-2.5 border border-white/15 rounded-2xl px-5 py-3.5 mt-8 bg-white/[0.03]">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center gap-2.5">
              {i > 0 && <Icon name="chevron" className="w-[18px] h-[18px] text-white/30 mx-1" strokeWidth={2} />}
              <Icon name={s.icon} className="w-[18px] h-[18px] text-orange" strokeWidth={1.8} />
              <span className="font-mono text-[13px] font-semibold tracking-wide uppercase text-white/80">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}