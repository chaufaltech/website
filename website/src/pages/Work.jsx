import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { PROJECTS } from '../data/content.js'

const CATEGORIES = ['All', ...new Set(PROJECTS.map((p) => p.category))]

export default function Work() {
  const [filter, setFilter] = useState('All')
  const filtered = filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)

  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title="Solutions That Speak for Themselves"
        subtitle="A look at the kind of problems we get called in to solve."
      />

      <section className="section py-20">
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium border transition-colors ${
                filter === c
                  ? 'bg-orange text-white border-orange'
                  : 'border-black/10 text-ink/70 hover:border-orange hover:text-orange'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <div key={p.title} className="rounded-xl2 overflow-hidden border border-black/8">
              <div className="aspect-[4/3] bg-gradient-to-br from-navy to-navy-light flex items-center justify-center text-white/20 font-display font-bold text-4xl">
                {p.title.split(' ')[0][0]}
              </div>
              <div className="p-5">
                <p className="text-xs text-orange font-semibold">{p.category}</p>
                <h3 className="font-display font-semibold text-ink mt-1">{p.title}</h3>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted mt-10">No projects in this category yet.</p>
        )}
      </section>

      <CtaBanner
        title="Have a Similar Challenge?"
        subtitle="Tell us what you're working on and we'll show you how we'd approach it."
      />
    </>
  )
}
