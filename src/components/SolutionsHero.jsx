import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'

const FEATURES = [
  { icon: 'target', title: 'Business First', description: 'We start with your goals.' },
  { icon: 'puzzle', title: 'Solution Focused', description: 'We solve the right problem.' },
  { icon: 'chart', title: 'Measurable Impact', description: 'We deliver real outcomes.' },
]

export default function SolutionsHero() {
  return (
    <section className="bg-navy text-white overflow-hidden relative bg-[url('/images/solutions-hero-background-with-content.png')] bg-cover bg-right lg:bg-center bg-no-repeat">
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,27,42,0.85)_0%,rgba(13,27,42,0.6)_45%,rgba(13,27,42,0.35)_70%,rgba(13,27,42,0.12)_100%)]"
        aria-hidden
      />
      <div className="section pt-36 pb-20 lg:pt-48 lg:pb-24 relative">
        <span className="eyebrow">Solutions</span>
        <h1 className="font-display font-bold text-4xl sm:text-[42px] leading-tight mt-4 max-w-lg">
          Turn Business Challenges Into
          <br />
          <span className="text-orange">Better Systems.</span>
        </h1>
        <p className="text-white/60 mt-5 max-w-lg leading-relaxed">
          Whether you&apos;re dealing with manual processes, disconnected tools,
          outdated technology, or systems that no longer fit the way you work, we
          help you find and build the practical way forward.
        </p>

        <Link to="#solutions-detail" className="btn-primary mt-8">
          Explore Solutions <span aria-hidden>→</span>
        </Link>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-white/10 max-w-2xl">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0">
                <Icon name={f.icon} className="w-[18px] h-[18px]" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm text-white">{f.title}</h3>
                <p className="text-xs text-white/50 mt-1 leading-relaxed">{f.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}