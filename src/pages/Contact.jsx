import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

const PROJECT_SERVICES = [
  {
    icon: 'monitor',
    title: 'Websites & Web Applications',
    description: 'Build a fast, secure, and modern digital presence that grows your business.',
  },
  {
    icon: 'gear',
    title: 'Automation & Integrations',
    description: 'Connect your tools, automate workflows, and eliminate repetitive work.',
  },
  {
    icon: 'database',
    title: 'Digital Modernization',
    description: 'Modernize legacy systems and transform your business for the future.',
  },
  {
    icon: 'bulb',
    title: 'Technology Consulting',
    description: 'Get expert advice on the right technology decisions for your business.',
  },
]

const TRUST_FEATURES = [
  { icon: 'rocket', title: 'Fast Response', description: 'We usually get back within 24 business hours.' },
  { icon: 'shield', title: 'Confidential', description: 'Your information is safe and never shared.' },
  { icon: 'users', title: 'Real People', description: "You'll hear from our team, not an automated reply." },
  { icon: 'globe', title: 'Global Clients', description: 'We work with businesses around the world.' },
]

const CONTACT_EMAIL = 'chaufaltech@gmail.com'

const INITIAL_FORM = { name: '', email: '', company: '', message: '' }

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState('idle') // idle | submitting | sent | error
  const [errorMessage, setErrorMessage] = useState('')

  function handleChange(e) {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('submitting')
    setErrorMessage('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || 'Something went wrong. Please try again.')
      }

      setStatus('sent')
      setForm(INITIAL_FORM)
    } catch (err) {
      setStatus('error')
      setErrorMessage(err.message || 'Something went wrong. Please try again.')
    }
  }

  function closeModal() {
    setStatus('idle')
  }

  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-blueprint [mask-image:linear-gradient(to_right,transparent,black)]" aria-hidden />
        <div className="section pt-36 pb-16 lg:pt-44 lg:pb-20 relative">
          <span className="eyebrow">Contact Us</span>
          <h1 className="font-display font-bold text-4xl md:text-5xl mt-4 max-w-2xl">
            Let&apos;s Solve Your Problem.
          </h1>
          <span className="block w-14 h-1 bg-orange rounded-full mt-5" />
          <p className="mt-5 text-white/60 max-w-xl">
            Tell us what you&apos;re trying to build, improve, automate, or modernize.
            We&apos;ll get back to you with the next steps.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="bg-cream/40 py-20">
        <div className="section grid lg:grid-cols-5 gap-10 items-start">
          {/* LEFT: info column */}
          <div className="lg:col-span-2">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink">Have a project in mind?</h2>
            <p className="font-display font-bold text-2xl md:text-3xl text-orange mt-1">We&apos;d love to hear about it.</p>
            <p className="text-muted mt-4 leading-relaxed">
              Whether you need a new website, automation, digital modernization, or
              technology guidance, we&apos;re here to help.
            </p>

            <div className="mt-8 space-y-6">
              {PROJECT_SERVICES.map((s) => (
                <div key={s.title} className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-navy text-orange flex items-center justify-center shrink-0">
                    <Icon name={s.icon} className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-ink text-sm">{s.title}</h3>
                    <p className="text-sm text-muted mt-1 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-black/10 mt-8 pt-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-orange/10 text-orange flex items-center justify-center shrink-0">
                <Icon name="mail" className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted">Prefer email?</p>
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-orange">
                  {CONTACT_EMAIL}
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT: form card */}
          <div className="lg:col-span-3 bg-white rounded-2xl shadow-lg p-8 md:p-10">
            <h2 className="font-display font-bold text-xl text-ink mb-6">Tell us about your project</h2>

            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="text-sm font-medium text-ink/80">
                  Full name <span className="text-orange">*</span>
                </label>
                <input
                  id="name"
                  required
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:border-orange outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="text-sm font-medium text-ink/80">
                  Work email <span className="text-orange">*</span>
                </label>
                <input
                  id="email"
                  required
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:border-orange outline-none"
                  placeholder="you@company.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="company" className="text-sm font-medium text-ink/80">Company</label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={handleChange}
                  className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:border-orange outline-none"
                  placeholder="Your business name"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="message" className="text-sm font-medium text-ink/80">
                  Tell us about your project <span className="text-orange">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:border-orange outline-none resize-none"
                  placeholder="What are you trying to build, improve, automate, or solve?"
                />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" disabled={status === 'submitting'} className="btn-primary w-full justify-center disabled:opacity-60">
                  {status === 'submitting' ? 'Sending…' : (
                    <>Let&apos;s Solve Your Problem <span aria-hidden>→</span></>
                  )}
                </button>

                {status === 'error' && (
                  <p className="text-sm text-red-600 mt-3">{errorMessage}</p>
                )}

                <div className="flex items-start gap-3 mt-5">
                  <span className="w-6 h-6 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0 mt-0.5">
                    <Icon name="shield" className="w-3.5 h-3.5" />
                  </span>
                  <p className="text-xs text-muted leading-relaxed">
                    By submitting this form, you agree that Chaufal Tech may use the
                    information you provide to respond to your inquiry. View our{' '}
                    <Link to="/privacy-policy" className="text-orange font-medium hover:underline">
                      Privacy Policy
                    </Link>.
                  </p>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* TRUST STRIP */}
        <div className="section mt-14">
          <div className="bg-black/[0.03] rounded-2xl grid grid-cols-2 md:grid-cols-4 divide-y sm:divide-y-0 divide-x-0 md:divide-x divide-black/10">
            {TRUST_FEATURES.map((f) => (
              <div key={f.title} className="flex items-center gap-3 px-6 py-6">
                <div className="w-10 h-10 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0">
                  <Icon name={f.icon} className="w-[18px] h-[18px]" />
                </div>
                <div>
                  <p className="font-display font-semibold text-ink text-sm">{f.title}</p>
                  <p className="text-xs text-muted mt-0.5 leading-snug">{f.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {status === 'sent' && (
        <div
          className="fixed inset-0 z-[100] bg-navy/60 backdrop-blur-sm flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-orange/10 text-orange flex items-center justify-center mx-auto">
              <Icon name="check" className="w-6 h-6" strokeWidth={3} />
            </div>
            <h3 id="success-modal-title" className="font-display font-bold text-xl text-ink mt-5">
              Message sent!
            </h3>
            <p className="text-sm text-muted mt-2 leading-relaxed">
              Thanks — we&apos;ve got your message and will be in touch soon.
            </p>
            <button type="button" onClick={closeModal} className="btn-primary w-full justify-center mt-6">
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}