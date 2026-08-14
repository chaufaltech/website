export default function ProcessTrail({ steps }) {
  return (
    <div className="relative">
      {/* the trace line — hidden on mobile where steps stack vertically */}
      <div className="hidden lg:block absolute left-0 right-0 top-6 h-px bg-gradient-to-r from-transparent via-orange/40 to-transparent" aria-hidden />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-4 gap-y-10">
        {steps.map((step) => (
          <div key={step.number} className="relative flex flex-col items-center text-center">
            <div className="relative w-12 h-12 shrink-0 z-10">
              <div className="absolute inset-0 rotate-45 border border-orange bg-navy" />
              <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-semibold text-orange">
                {step.number}
              </span>
            </div>
            <h3 className="font-display font-semibold mt-4">{step.title}</h3>
            <p className="text-xs text-white/50 mt-2 leading-relaxed max-w-[11rem]">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
