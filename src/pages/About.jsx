import Icon from '../components/Icon.jsx'
import AboutCta from '../components/AboutCta.jsx'
import {
  ABOUT_CAPABILITIES,
  ABOUT_PRINCIPLES,
  ABOUT_APPROACH,
  ABOUT_WHO_WE_WORK_WITH,
} from '../data/content.js'

export default function About() {
  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white overflow-hidden relative bg-[url('/images/about-hero-image.png')] bg-cover bg-right lg:bg-center bg-no-repeat">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,27,42,1)_0%,rgba(13,27,42,1)_52%,rgba(13,27,42,0.55)_72%,rgba(13,27,42,0.12)_100%)]"
          aria-hidden
        />
        <div className="section pt-36 pb-16 lg:pt-52 lg:pb-28 relative">
          <span className="eyebrow">About Chaufal Tech</span>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mt-4 max-w-xl">
            Technology Should Solve Problems.
            <br />
            <span className="text-orange">Not Create More of Them.</span>
          </h1>
          <p className="text-white/60 mt-5 max-w-lg leading-relaxed">
            Chaufal Tech helps businesses build, automate, modernize, and improve
            their digital systems with practical technology solutions designed
            around real business needs.
          </p>
          <a href="#approach" className="btn-outline-dark mt-8">
            Discover How We Work <span aria-hidden>→</span>
          </a>
        </div>
      </section>

      {/* WHO WE ARE */}
      <section className="section py-20 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow">Who We Are</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink leading-tight">
            Built Around a Simple Belief: Technology Should Make Business Better.
          </h2>
          <p className="text-muted mt-5 leading-relaxed">
            Chaufal Tech was built around a practical idea: technology should
            simplify work, solve real problems, and create measurable value.
          </p>
          <p className="text-muted mt-4 leading-relaxed">
            We combine web development, automation, digital modernization, and
            technology consulting to help businesses move forward with clarity
            and confidence.
          </p>
          <p className="text-muted mt-4 leading-relaxed">
            Our focus is simple — understand the problem, prepare the right
            approach, build with quality, and support what we deliver.
          </p>
        </div>

        <div className="relative border border-black/8 rounded-2xl p-8 md:p-10 overflow-hidden">
          {/* dot-grid corner accents */}
          <svg viewBox="0 0 60 60" className="absolute top-4 right-4 w-14 h-14 text-orange/30 pointer-events-none" aria-hidden>
            <g fill="currentColor">
              {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 4 }).map((_, col) => (
                  <circle key={`tr-${row}-${col}`} cx={4 + col * 14} cy={4 + row * 14} r="1.6" />
                ))
              )}
            </g>
          </svg>
          <svg viewBox="0 0 60 60" className="absolute bottom-4 left-4 w-14 h-14 text-orange/30 pointer-events-none" aria-hidden>
            <g fill="currentColor">
              {Array.from({ length: 4 }).map((_, row) =>
                Array.from({ length: 4 }).map((_, col) => (
                  <circle key={`bl-${row}-${col}`} cx={4 + col * 14} cy={4 + row * 14} r="1.6" />
                ))
              )}
            </g>
          </svg>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 relative">
            {ABOUT_CAPABILITIES.map((c, i) => (
              <div key={c.title} className="relative text-center">
                {i < ABOUT_CAPABILITIES.length - 1 && (
                  <span className="hidden sm:block absolute top-6 left-[calc(50%+26px)] right-[calc(-50%+26px)] border-t border-dashed border-orange/40" aria-hidden />
                )}
                <Icon name={c.icon} className="relative w-11 h-11 text-ink mx-auto" strokeWidth={1.6} />
                <h3 className="font-display font-bold text-ink text-sm mt-4">{c.title}</h3>
                <p className="text-xs text-muted mt-2 leading-relaxed">{c.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT WE BELIEVE */}
      <section className="bg-navy text-white py-20">
        <div className="section">
          <span className="eyebrow">What We Believe</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3">
            Our Principles Guide Everything We Do<span className="text-orange">.</span>
          </h2>
          <p className="text-white/50 mt-4 max-w-lg leading-relaxed">
            These principles shape our decisions, our work, and the way we partner
            with every client.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-14">
            {ABOUT_PRINCIPLES.map((p, i) => (
              <div
                key={p.title}
                className="relative rounded-2xl border border-white/10 p-7 overflow-hidden"
                style={{ background: 'linear-gradient(160deg, rgba(255,255,255,0.06), rgba(255,255,255,0.01) 60%)' }}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="font-display font-bold text-6xl text-amber leading-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <img src={p.image} alt="" className="w-40 h-40 object-contain shrink-0 -mt-1" />
                </div>
                <h3 className="font-display font-bold text-white text-lg mt-5 leading-snug">{p.title}</h3>
                <p className="text-sm text-white/50 mt-2 leading-relaxed">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR APPROACH */}
      <section id="approach" className="bg-paper py-20 scroll-mt-28">
        <div className="section grid lg:grid-cols-2 gap-12 items-center">
          {/* LEFT: editorial content */}
          <div>
            <span className="eyebrow">Our Approach</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink leading-tight">
              Practical Technology.
              <br />
              Thoughtful Execution<span className="text-orange">.</span>
            </h2>
            <span className="block w-14 h-1 bg-orange rounded-full mt-5" />

            <p className="text-muted mt-6 leading-relaxed max-w-md">
              We don&apos;t start with technology. We start by understanding your
              business, the challenge you&apos;re facing, and what a successful
              outcome should look like.
            </p>

            <div className="border-t border-black/10 mt-8 pt-8 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0">
                <Icon name="users" className="w-5 h-5" />
              </div>
              <p className="text-muted leading-relaxed">
                Our approach is built on collaboration, clarity, and a commitment to
                delivering real, lasting impact.
              </p>
            </div>

            <p className="border-l-2 border-orange pl-4 mt-8 text-ink/80 leading-relaxed">
              No unnecessary complexity.
              <br />
              Just the right technology, applied thoughtfully.
            </p>
          </div>

          {/* RIGHT: dark vertical flow */}
          <div className="bg-navy rounded-3xl p-7 md:p-9">
            {ABOUT_APPROACH.map((a, i) => (
              <div
                key={a.title}
                className={`grid grid-cols-[auto_auto_1fr] gap-x-6 ${
                  i < ABOUT_APPROACH.length - 1 ? 'pb-6 mb-6 border-b border-white/10' : ''
                }`}
              >
                <span className="font-display font-bold text-5xl text-orange leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="flex flex-col items-center">
                  <span className="w-4 h-4 rounded-full border-2 border-orange shrink-0" />
                  {i < ABOUT_APPROACH.length - 1 && <span className="w-px h-16 bg-orange/40 mt-1" />}
                </div>

                <div>
                  <h3 className="font-display font-bold text-white text-lg">{a.title}</h3>
                  <p className="text-sm text-white/50 mt-2 leading-relaxed">{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO WE WORK WITH */}
      <section className="bg-navy text-white py-20 overflow-hidden">
        <div className="section grid lg:grid-cols-[minmax(0,1fr)_2fr] gap-12 items-center">
          {/* LEFT: editorial content */}
          <div className="relative">
            <span className="eyebrow">Who We Work With</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 leading-tight">
              Built for Businesses That Need Technology to Move Forward<span className="text-orange">.</span>
            </h2>
            <span className="block w-14 h-1 bg-orange rounded-full mt-5" />
            <p className="text-white/50 mt-6 leading-relaxed max-w-sm">
              We partner with organizations at different stages of their journey,
              helping them solve real challenges and build for what&apos;s next.
            </p>
          </div>

          {/* RIGHT: stacked numbered cards */}
          <div className="space-y-6">
            {ABOUT_WHO_WE_WORK_WITH.map((w, i) => (
              <div
                key={w.title}
                className="border border-white/10 rounded-2xl p-6 md:p-8 grid grid-cols-[auto_auto_1fr] md:grid-cols-[auto_auto_1fr_auto] gap-x-5 items-start"
              >
                <span className="font-display font-bold text-[42px] text-orange leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="w-4 h-4 rounded-full border-2 border-orange shrink-0 mt-1" />

                <div>
                  <h3 className="font-display font-bold text-white text-lg">{w.title}</h3>
                  <p className="text-sm text-white/70 mt-2 leading-relaxed max-w-md">{w.description}</p>
                  <div className="flex flex-wrap items-center gap-2 mt-4">
                    {w.tags.map((tag, ti) => (
                      <span key={tag} className="flex items-center gap-2">
                        {ti > 0 && <span className="text-orange text-xs">•</span>}
                        <span className="text-xs border border-white/15 rounded-full px-3 py-1 text-white/70">{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="hidden md:flex items-center justify-center w-24 h-24 text-orange/70 shrink-0">
                  <Icon name={w.icon} className="w-16 h-16" strokeWidth={1.2} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutCta />
    </>
  )
}