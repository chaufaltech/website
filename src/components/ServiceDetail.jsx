import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

export default function ServiceDetail({
  number,
  category,
  title,
  description,
  features,
  image,
  ctaLabel,
  imageSide = 'right',
}) {
  const imageFirst = imageSide === 'left'

  return (
    <section className="bg-navy text-white border-b border-white/5 overflow-hidden">
      <div className="grid lg:grid-cols-[52%_48%] 2xl:grid-cols-[46%_54%] 2xl:h-[410px]">
        <div
          className={`flex gap-7 lg:gap-10 px-6 sm:px-10 lg:pl-12 lg:pr-10 xl:pl-16 xl:pr-12 2xl:pl-20 2xl:pr-16 py-[52px] ${
            imageFirst ? 'lg:order-2' : ''
          }`}
        >
          <div className="flex w-[66px] shrink-0 flex-col">
            <span className="font-display font-bold text-5xl text-orange leading-none">{number}</span>
            <span className="w-px flex-1 bg-white/25 mt-5 ml-auto" aria-hidden />
          </div>

          <div className="min-w-0">
            <span className="block text-[13px] font-semibold tracking-[0.18em] uppercase text-orange">
              {category}
            </span>
            <h3 className="font-display font-bold text-2xl xl:text-[28px] 2xl:text-3xl leading-tight mt-3 max-w-xl">
              {title.replace(/\.$/, '')}
              <span className="text-orange">.</span>
            </h3>

            <p className="text-white/70 mt-5 leading-relaxed max-w-xl">{description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-[0.94fr_1.12fr_0.94fr] gap-y-3 mt-7">
              {features.map((feature, index) => (
                <div
                  key={feature}
                  className={`flex min-w-0 items-center gap-2 text-xs xl:text-[13px] ${
                    index % 3 !== 0 ? 'sm:border-l sm:border-white/15 sm:pl-4' : ''
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-orange text-orange flex items-center justify-center shrink-0">
                    <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3} />
                  </span>
                  <span className="leading-4 text-white/80 2xl:whitespace-nowrap">{feature}</span>
                </div>
              ))}
            </div>

            <Link to="/contact" className="inline-flex items-center gap-1.5 text-orange text-sm font-semibold mt-8">
              {ctaLabel} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>

        <div className={`relative min-h-[280px] lg:min-h-[410px] ${imageFirst ? 'lg:order-1' : ''}`}>
          <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
        </div>
      </div>
    </section>
  )
}
