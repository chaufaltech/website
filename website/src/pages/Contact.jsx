import { useState } from 'react'
import PageHero from '../components/PageHero.jsx'
import Icon from '../components/Icon.jsx'

const CONTACT_INFO = [
  { icon: 'headset', label: 'Phone', value: '+1 833-000-0000' },
  { icon: 'globe', label: 'Email', value: 'hello@chaufaltech.com' },
  { icon: 'chart', label: 'Website', value: 'chaufaltech.com' },
]

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sent

  // NOTE: this is a UI-only placeholder. Wire this up to your backend / email
  // service (or reuse once auth is added, to a logged-in submission endpoint)
  // before going live.
  function handleSubmit(e) {
    e.preventDefault()
    setStatus('sent')
  }

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Let's Talk About Your Business Challenge"
        subtitle="Tell us what you're working on — we'll get back to you within one business day."
      />

      <section className="section py-20 grid lg:grid-cols-5 gap-14">
        <div className="lg:col-span-2 space-y-6">
          {CONTACT_INFO.map((c) => (
            <div key={c.label} className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-cream text-orange flex items-center justify-center shrink-0">
                <Icon name={c.icon} className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-muted uppercase tracking-wide">{c.label}</p>
                <p className="font-medium text-ink">{c.value}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="lg:col-span-3 grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-1">
            <label htmlFor="name" className="text-sm font-medium text-ink/80">Full name</label>
            <input
              id="name"
              required
              type="text"
              className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:border-orange outline-none"
              placeholder="Your name"
            />
          </div>
          <div className="sm:col-span-1">
            <label htmlFor="email" className="text-sm font-medium text-ink/80">Email</label>
            <input
              id="email"
              required
              type="email"
              className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:border-orange outline-none"
              placeholder="you@company.com"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="company" className="text-sm font-medium text-ink/80">Company</label>
            <input
              id="company"
              type="text"
              className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:border-orange outline-none"
              placeholder="Your business name"
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="message" className="text-sm font-medium text-ink/80">What are you trying to solve?</label>
            <textarea
              id="message"
              required
              rows={5}
              className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm focus:border-orange outline-none resize-none"
              placeholder="Tell us a bit about your business challenge"
            />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Send Message <span aria-hidden>→</span>
            </button>
            {status === 'sent' && (
              <p className="text-sm text-green-600 mt-3">
                Thanks — this is a demo form for now, so nothing was actually sent yet.
              </p>
            )}
          </div>
        </form>
      </section>
    </>
  )
}
