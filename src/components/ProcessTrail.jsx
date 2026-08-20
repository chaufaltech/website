function StepCard({ step }) {
  return (
    <div className="relative bg-white/[0.03] border border-white/10 rounded-xl p-6 overflow-hidden">
      <span
        className="absolute top-3 right-4 font-display font-bold text-5xl text-white/[0.06] leading-none select-none"
        aria-hidden
      >
        {step.number}
      </span>
      <span className="relative font-mono font-bold text-orange text-sm">{step.number}</span>
      <h3 className="relative font-display font-semibold text-lg text-white mt-2">{step.title}</h3>
      <p className="relative text-sm text-white/50 mt-2 leading-relaxed">{step.description}</p>
    </div>
  )
}

// Three equal phases, each an "Understand-the-work / Prove-the-work" pair —
// same visual weight, same border treatment. Orange only shows up as a
// small accent under each phase title and on hover, never as a permanent
// "this one's selected" signal.
const PHASES = [
  { label: 'Discover & Plan' },
  { label: 'Build & Validate' },
  { label: 'Deliver & Grow' },
]

export default function ProcessTrail({ steps }) {
  return (
    <div className="grid sm:grid-cols-3 gap-6 items-start">
      {PHASES.map((phase, i) => {
        const phaseSteps = steps.slice(i * 2, i * 2 + 2)
        return (
          <div
            key={phase.label}
            className="border border-white/15 hover:border-orange/50 rounded-2xl p-6 transition-colors duration-200"
          >
            <h3 className="font-mono text-xs font-semibold tracking-[0.18em] uppercase text-white text-center">
              {phase.label}
            </h3>
            <span className="block w-8 h-0.5 bg-orange rounded-full mx-auto mt-3 mb-6" />
            <div className="space-y-5">
              {phaseSteps.map((step) => (
                <StepCard key={step.number} step={step} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}