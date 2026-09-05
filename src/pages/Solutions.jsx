import SolutionsHero from '../components/SolutionsHero.jsx'
import SolutionDetail from '../components/SolutionDetail.jsx'
import Icon from '../components/Icon.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { SOLUTIONS_CHALLENGES, SOLUTION_DETAILS } from '../data/content.js'

const CHALLENGE_ANCHORS = {
  'Too Much Manual Work': 'automate-manual-processes',
  'Disconnected Tools & Data': 'bring-disconnected-systems-together',
  'Outdated Technology': 'move-beyond-outdated-technology',
  "Systems That Don't Fit": 'create-technology-that-fits',
  'Digital Experiences Falling Behind': 'create-digital-experiences',
  'Technology That Needs Constant Attention': 'keep-technology-reliable',
}

export default function Solutions() {
  return (
    <>
      <SolutionsHero />

      <section id="solutions-detail" className="section py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">Common Business Challenges</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
            What&apos;s Getting in the Way?
          </h2>
          <p className="text-muted mt-4">
            We help businesses overcome the technology challenges that slow down work,
            limit growth, and create unnecessary complexity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mt-14">
          {SOLUTIONS_CHALLENGES.map((c) => (
            <a
              key={c.title}
              href={`#${CHALLENGE_ANCHORS[c.title] || 'solutions-detail'}`}
              className="group bg-white border border-black/5 rounded-xl2 p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <Icon name={c.icon} className="w-9 h-9 text-orange" strokeWidth={1.6} />
              <h3 className="font-display font-bold text-ink text-[15px] leading-snug mt-4">{c.title}</h3>
              <p className="text-xs text-muted mt-2.5 leading-relaxed">{c.description}</p>
              <span className="inline-flex text-orange mt-4 transition-transform group-hover:translate-x-1" aria-hidden>
                →
              </span>
            </a>
          ))}
        </div>
      </section>

      {SOLUTION_DETAILS.map((s) => (
        <SolutionDetail key={s.slug} id={s.slug} {...s} />
      ))}

      <section className="bg-navy text-white overflow-hidden">
        <div className="section py-20 grid lg:grid-cols-[minmax(0,380px)_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <span className="eyebrow">How Solutions Come Together</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 leading-tight">
              One Challenge May Need
              <br />
              More Than One Service.
            </h2>
            <p className="text-white/60 mt-5 leading-relaxed max-w-md">
              Business problems rarely fit neatly into a single category. We combine
              the right capabilities around the outcome you&apos;re trying to achieve.
            </p>
          </div>

          <div className="relative -mx-6 sm:mx-0">
            <img
              src="/images/solutions-how-services-work-together.png"
              alt="Diagram showing a business challenge flowing through an understand step into web development, automation and integrations, custom applications, digital modernization, and maintenance and support, resulting in a business outcome"
              className="w-full h-auto"
            />
          </div>
        </div>
      </section>

      <CtaBanner
        title="Have a Business Challenge?"
        highlight="Let's Find the Right Way Forward."
        mobileSubtitle="Tell us where your business is today and where you want to take it."
      />
    </>
  )
}