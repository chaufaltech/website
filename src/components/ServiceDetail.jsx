import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function ServiceDetail({
  number,
  category,
  title,
  titleLines,
  description,
  features,
  image,
  imageAlt = '',
  imageScale = 1,
  imageObjectPosition = 'center',
  ctaLabel,
  imageSide = 'right',
  theme = 'dark',
}) {
  const imageFirst = imageSide === 'left'
  const isLight = theme === 'light'

  return (
    <section
      className={`overflow-hidden border-b ${
        isLight ? 'bg-paper text-ink border-black/5' : 'bg-navy text-white border-white/5'
      }`}
    >
      {/* Background (bg-navy / bg-paper above) stays full-bleed on the <section>.
          Everything below is wrapped in the same `.section` container the
          Navbar uses, so content lines up with the header instead of
          bleeding to the viewport edge. */}
      <div className="section py-14 lg:py-[84px]">
        <div className="grid lg:grid-cols-[minmax(0,560px)_1fr] gap-10 lg:gap-16 items-center">
          {/* CONTENT */}
          <div className={`flex gap-4 ${imageFirst ? 'lg:order-2' : 'lg:order-1'}`}>
            <div className="flex w-[66px] shrink-0 flex-col">
              <span className="font-display font-bold text-5xl text-orange leading-none">{number}</span>
              <span className={`w-px flex-1 mt-5 ml-auto ${isLight ? 'bg-black/15' : 'bg-white/25'}`} aria-hidden />
            </div>

            <div className="min-w-0">
              <span className="block text-[13px] font-semibold tracking-[0.18em] uppercase text-orange">
                {category}
              </span>
              <h3 className="font-display font-bold text-2xl xl:text-[28px] 2xl:text-3xl leading-tight mt-3 max-w-xl">
                {titleLines ? (
                  titleLines.map((line, index) => {
                    const isLastLine = index === titleLines.length - 1

                    return (
                      <span key={line} className="block">
                        {isLastLine ? line.replace(/\.$/, '') : line}
                        {isLastLine && <span className="text-orange">.</span>}
                      </span>
                    )
                  })
                ) : (
                  <>
                    {title.replace(/\.$/, '')}
                    <span className="text-orange">.</span>
                  </>
                )}
              </h3>

              <p className={`${isLight ? 'text-muted' : 'text-white/70'} mt-5 leading-relaxed max-w-xl`}>{description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 mt-7">
                {features.map((feature, index) => (
                  <div
                    key={feature}
                    className={`flex min-w-0 items-center gap-2 text-xs xl:text-[13px] ${
                      index % 2 !== 0
                        ? `sm:border-l sm:pl-4 ${isLight ? 'sm:border-black/10' : 'sm:border-white/15'}`
                        : ''
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full border border-orange text-orange flex items-center justify-center shrink-0">
                      <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3} />
                    </span>
                    <span className={`leading-4 ${isLight ? 'text-ink/80' : 'text-white/80'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-8">
                {ctaLabel} <span aria-hidden>→</span>
              </Link>
            </div>
          </div>

          {/* IMAGE — now contained within the section width instead of
              bleeding to the edge; rounded corners read better now that
              it's a boxed panel rather than an edge-to-edge bleed. */}
          <div
            className={`relative min-h-[260px] lg:min-h-[380px] rounded-2xl overflow-hidden ${
              imageFirst ? 'lg:order-1' : 'lg:order-2'
            }`}
          >
            <img
              src={image}
              alt={imageAlt}
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                objectPosition: imageObjectPosition,
                transform: imageScale !== 1 ? `scale(${imageScale})` : undefined,
              }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}