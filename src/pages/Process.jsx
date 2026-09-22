import ProcessHero from '../components/ProcessHero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import Icon from '../components/Icon.jsx'
import { PROCESS_STEPS, PROCESS_VALUES } from '../data/content.js'

export default function Process() {
  return (
    <>
      <ProcessHero />

      <section className="bg-paper border-b border-black/5">
        <div className="section grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-black/10 py-8 sm:py-10">
          {PROCESS_VALUES.map((v) => (
            <div key={v.title} className="flex items-center gap-4 py-5 sm:py-0 first:pt-0 sm:px-8 first:sm:pl-0 last:sm:pr-0">
              <Icon name={v.icon} className="w-7 h-7 text-ink shrink-0" strokeWidth={1.6} />
              <div>
                <h3 className="font-display font-bold text-ink text-sm">{v.title}</h3>
                <p className="text-xs text-muted mt-1">{v.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section py-20">
        <div className="grid lg:grid-cols-2 gap-8 items-start mb-16">
          <div>
            <span className="eyebrow">The Chaufal Process</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink leading-tight">
              A structured journey.
              <br />
              Built around your goals.
            </h2>
          </div>
          <p className="text-muted leading-relaxed lg:pt-2">
            Every business is different. Our process gives structure to the journey,
            while staying flexible to your industry, team and pace. From understanding
            your challenges to ongoing support, we work with you at every step to turn
            ideas into real, measurable outcomes.
          </p>
        </div>

        <div className="relative">
          <div className="absolute left-7 top-8 bottom-8 w-px bg-black/10 hidden lg:block" aria-hidden />
          <div className="space-y-14">
            {PROCESS_STEPS.map((step) => (
              <div
                key={step.number}
                className="flex flex-col gap-5 lg:grid lg:grid-cols-[56px_88px_240px_1fr_300px] lg:gap-6 lg:items-center"
              >
                <div className="flex items-center gap-5 lg:contents">
                  <div className="relative z-10 w-14 h-14 rounded-full bg-navy text-orange font-display font-bold flex items-center justify-center shrink-0">
                    {step.number}
                  </div>
                  <div className="w-20 h-20 rounded-full bg-black/5 flex items-center justify-center shrink-0">
                    <Icon name={step.icon} className="w-7 h-7 text-ink" strokeWidth={1.6} />
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-lg text-ink">{step.title}</h3>
                  <p className="text-sm font-semibold text-muted mt-1">{step.tagline}</p>
                </div>

                <p className="text-sm text-muted leading-relaxed">{step.longDescription}</p>

                <div className="bg-orange/10 rounded-xl2 p-5 space-y-2.5">
                  {step.highlights.map((h) => (
                    <div key={h} className="flex items-center gap-2.5 text-sm text-ink/80">
                      <span className="w-4 h-4 rounded-full bg-orange text-white flex items-center justify-center shrink-0">
                        <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3.5} />
                      </span>
                      {h}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  )
}