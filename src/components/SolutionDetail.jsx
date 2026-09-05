import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function SolutionDetail({
  id,
  number,
  eyebrow,
  title,
  titleLines,
  description,
  benefits = [],
  poweredBy = [],
  image,
  imageAlt = '',
  imageSide = 'right',
  theme = 'dark',
}) {
  const imageFirst = imageSide === 'left'
  const isLight = theme === 'light'

  return (
    <section
      id={id}
      className={`overflow-hidden border-b scroll-mt-24 ${
        isLight ? 'bg-paper text-ink border-black/5' : 'bg-navy text-white border-white/5'
      }`}
    >
      <div className="section py-12 sm:py-14 lg:py-[84px]">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-16 items-center">
          {/* CONTENT */}
          <div className={`flex gap-6 ${imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="flex w-[56px] shrink-0 flex-col">
              <span className="font-display font-bold text-5xl text-orange leading-none">{number}</span>
              <span className={`w-px flex-1 mt-5 ml-auto ${isLight ? 'bg-black/15' : 'bg-white/25'}`} aria-hidden />
            </div>

            <div className="min-w-0">
              <span className="block text-[13px] font-semibold tracking-[0.18em] uppercase text-orange">
                {eyebrow}
              </span>
              <h3 className="font-display font-bold text-2xl xl:text-[28px] 2xl:text-3xl leading-tight mt-3 max-w-xl">
                {titleLines
                  ? titleLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))
                  : title}
              </h3>

              <p className={`${isLight ? 'text-muted' : 'text-white/70'} mt-4 sm:mt-5 leading-relaxed max-w-xl`}>
                {description}
              </p>

              {benefits.length > 0 && (
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 mt-5 sm:mt-7">
                  {benefits.map((b) => (
                    <div key={b.label} className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full border border-orange text-orange flex items-center justify-center shrink-0">
                        <Icon name={b.icon} className="w-3 h-3" strokeWidth={3} />
                      </span>
                      <span className={`text-sm ${isLight ? 'text-ink/80' : 'text-white/80'}`}>{b.label}</span>
                    </div>
                  ))}
                </div>
              )}

              {poweredBy.length > 0 && (
                <div className="mt-6 sm:mt-8">
                  <span className={`block text-xs uppercase tracking-wide ${isLight ? 'text-muted' : 'text-white/40'} mb-3`}>
                    Powered by:
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {poweredBy.map((service) => (
                      <Link
                        key={service}
                        to="/services"
                        className="inline-flex items-center text-xs font-semibold text-orange border border-orange/40 rounded-full px-4 py-2 hover:bg-orange/10 transition-colors"
                      >
                        {service}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* IMAGE */}
          <div
            className={`relative min-h-[260px] lg:min-h-[380px] rounded-2xl overflow-hidden ${
              imageFirst ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            <img src={image} alt={imageAlt} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </div>
    </section>
  )
}