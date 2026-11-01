export default function ToolsHero() {
  return (
    <section className="bg-navy text-white overflow-hidden relative bg-[url('/images/work-hero-bg.png')] bg-cover bg-no-repeat bg-[right_top]">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,27,42,1)_0%,rgba(13,27,42,0.9)_45%,rgba(13,27,42,0.55)_70%,rgba(13,27,42,0.15)_100%)]"
        aria-hidden
      />
      <div className="section pt-36 pb-16 lg:pt-44 lg:pb-20 relative">
        <span className="eyebrow">Our Tools</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mt-4 max-w-xl">
          Practical Tools.
          <br />
          Built by Us.
        </h1>
        <p className="text-white/60 mt-5 max-w-md leading-relaxed">
          From SEO audits and metadata checks to image optimization, we build
          free, practical tools that solve real problems for websites and the
          teams behind them.
        </p>
      </div>
    </section>
  )
}