import PageHero from '../components/PageHero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { PROCESS_STEPS } from '../data/content.js'

export default function Process() {
  return (
    <>
      <PageHero
        eyebrow="Our Approach"
        title="A Simple. Proven. Reliable Process."
        subtitle="Every engagement follows the same disciplined process, from first conversation to ongoing support."
      />

      <section className="section py-20">
        <div className="relative max-w-3xl mx-auto">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-black/10 hidden sm:block" aria-hidden />
          <div className="space-y-10">
            {PROCESS_STEPS.map((step) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="w-12 h-12 rounded-full bg-navy text-orange font-display font-bold flex items-center justify-center shrink-0 relative z-10">
                  {step.number}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-display font-semibold text-lg text-ink">{step.title}</h3>
                  <p className="text-sm text-muted mt-2 leading-relaxed">{step.description}</p>
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
