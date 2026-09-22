export default function ProcessHero() {
  return (
    <section className="bg-navy text-white overflow-hidden relative bg-[url('/images/process-journey-hero-bg.png')] bg-contain bg-right bg-no-repeat bg-origin-content pt-24 lg:pt-28">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,27,42,0.92)_0%,rgba(13,27,42,0.6)_35%,rgba(13,27,42,0.2)_55%,rgba(13,27,42,0)_65%,rgba(13,27,42,0)_100%)]"
        aria-hidden
      />
      <div className="section pt-36 pb-6 lg:pt-32 lg:pb-32 relative">
        <span className="eyebrow">Our Approach</span>
        <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mt-4 max-w-xl">
          From Complexity to
          <br />
          A Clear Way Forward.
        </h1>
        <p className="text-white/60 mt-5 max-w-lg leading-relaxed">
          We understand the problem, define the right approach, and stay with you
          from first conversation to ongoing support.
        </p>
      </div>
    </section>
  )
}