import { useState } from 'react'
import Icon from './Icon.jsx'

export default function TestimonialCarousel({ testimonials, perPage = 3 }) {
  const pageCount = Math.max(1, testimonials.length - perPage + 1)
  const [start, setStart] = useState(0)

  const visible = Array.from({ length: perPage }).map(
    (_, i) => testimonials[(start + i) % testimonials.length]
  )

  function prev() {
    setStart((s) => (s - 1 + testimonials.length) % testimonials.length)
  }
  function next() {
    setStart((s) => (s + 1) % testimonials.length)
  }

  return (
    <div>
      <div className="grid md:grid-cols-3 gap-6">
        {visible.map((t, i) => (
          <div
            key={`${t.name}-${i}`}
            className="border border-orange/30 rounded-xl2 p-7 bg-white/[0.02]"
          >
            <div className="flex items-start justify-between mb-4">
              <span className="text-orange/80" aria-hidden>
                <svg width="28" height="22" viewBox="0 0 28 22" fill="currentColor">
                  <path d="M0 22V13.5C0 6 4.5 1 12 0l1 3.5C8.5 4.5 6 7 6 10h6v12H0zm16 0V13.5C16 6 20.5 1 28 0l1 3.5C24.5 4.5 22 7 22 10h6v12H16z" />
                </svg>
              </span>
              <div className="flex gap-0.5 text-orange" aria-hidden>
                {'★★★★★'}
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
            <div className="flex items-center gap-3 mt-6">
              <div className="w-10 h-10 rounded-full bg-orange/20 text-orange flex items-center justify-center font-display font-semibold text-sm">
                {t.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-white/45">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-6 mt-10">
        <button
          onClick={prev}
          aria-label="Previous testimonials"
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-orange hover:text-orange transition-colors"
        >
          <Icon name="chevron" className="w-4 h-4 rotate-180" strokeWidth={2} />
        </button>
        <div className="flex gap-2">
          {Array.from({ length: pageCount }).map((_, i) => (
            <button
              key={i}
              onClick={() => setStart(i)}
              aria-label={`Go to testimonial set ${i + 1}`}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === start ? 'bg-orange' : 'bg-white/20'
              }`}
            />
          ))}
        </div>
        <button
          onClick={next}
          aria-label="Next testimonials"
          className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:border-orange hover:text-orange transition-colors"
        >
          <Icon name="chevron" className="w-4 h-4" strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
