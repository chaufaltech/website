export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="bg-navy text-white">
      <div className="section pt-36 pb-20 lg:pt-44 lg:pb-28 text-center">
        {eyebrow && <span className="eyebrow justify-center mb-4">{eyebrow}</span>}
        <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight max-w-3xl mx-auto">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-5 text-white/60 max-w-2xl mx-auto text-lg">{subtitle}</p>
        )}
      </div>
    </section>
  )
}