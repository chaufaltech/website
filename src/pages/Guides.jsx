import { Link } from 'react-router-dom'
import PageHero from '../components/PageHero.jsx'
import Seo from '../components/Seo.jsx'
import Icon from '../components/Icon.jsx'
import { breadcrumbSchema } from '../lib/seo.js'

const GUIDES = [
  {
    to: '/guides/image-optimization',
    icon: 'image',
    title: 'How to Optimize Images for a Website',
    description:
      'Resize, compress and choose the right format (JPG, PNG, WebP, AVIF) to speed up your site without losing visual quality.',
    meta: '10 min read',
  },
]

export default function Guides() {
  return (
    <>
      <Seo
        title="Practical Technology Guides | Chaufal Tech"
        description="Clear, practical guides on web performance, images, automation and modernization — written by the Chaufal Tech team."
        path="/guides"
        jsonLd={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: '/guides' },
        ])}
      />
      <PageHero
        eyebrow="Guides"
        title="Practical Technology Guides"
        subtitle="Straightforward advice on building faster, smarter and more reliable websites and systems."
      />

      <section className="section py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {GUIDES.map((g) => (
            <Link
              key={g.to}
              to={g.to}
              className="group bg-white border border-black/5 rounded-2xl p-7 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
            >
              <span className="w-12 h-12 rounded-xl bg-navy text-orange flex items-center justify-center">
                <Icon name={g.icon} className="w-5 h-5" />
              </span>
              <h2 className="font-display font-bold text-lg text-ink mt-5 leading-snug">{g.title}</h2>
              <p className="text-sm text-muted mt-3 leading-relaxed">{g.description}</p>
              <span className="flex items-center justify-between text-xs mt-5">
                <span className="text-muted">{g.meta}</span>
                <span className="text-orange font-semibold">
                  Read guide <span aria-hidden>→</span>
                </span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
