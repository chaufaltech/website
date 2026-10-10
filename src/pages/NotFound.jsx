import { Link } from 'react-router-dom'
import Seo from '../components/Seo.jsx'

export default function NotFound() {
  return (
    <>
      <Seo
        title="Page not found | Chaufal Tech"
        description="The page you're looking for doesn't exist or may have moved."
        path="/404"
        noindex
      />
      <section className="section py-32 text-center">
        <p className="eyebrow justify-center">404</p>
        <h1 className="font-display font-bold text-3xl md:text-4xl text-ink mt-3">
          This page doesn&apos;t exist — yet.
        </h1>
        <p className="text-muted mt-4">The page you're looking for may have moved.</p>
        <Link to="/" className="btn-primary inline-flex mt-8">
          Back to Home
        </Link>
      </section>
    </>
  )
}
