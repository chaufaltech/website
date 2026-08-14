import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
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
  )
}
