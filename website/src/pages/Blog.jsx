import PageHero from '../components/PageHero.jsx'
import { BLOG_POSTS } from '../data/content.js'

export default function Blog() {
  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="From the Chaufal Tech Team"
        subtitle="Thoughts on technology, automation, and building businesses that last."
      />

      <section className="section py-20 grid md:grid-cols-3 gap-6">
        {BLOG_POSTS.map((post) => (
          <article key={post.title} className="border border-black/8 rounded-xl2 overflow-hidden">
            <div className="aspect-[16/10] bg-cream" />
            <div className="p-6">
              <p className="text-xs text-orange font-semibold uppercase tracking-wide">{post.date}</p>
              <h3 className="font-display font-semibold text-lg text-ink mt-2 leading-snug">
                {post.title}
              </h3>
              <p className="text-sm text-muted mt-3 leading-relaxed">{post.excerpt}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}
