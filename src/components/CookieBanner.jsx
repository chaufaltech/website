import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { OPEN_SETTINGS_EVENT, analyticsAvailable, getConsent, setConsent } from '../lib/analytics.js'

// Shown until the visitor makes a choice, and again whenever they click
// "Cookie Settings" in the footer. Accept and Decline are equally easy to reach.
export default function CookieBanner() {
  const [visible, setVisible] = useState(() => analyticsAvailable && getConsent() === null)

  useEffect(() => {
    const open = () => setVisible(true)
    window.addEventListener(OPEN_SETTINGS_EVENT, open)
    return () => window.removeEventListener(OPEN_SETTINGS_EVENT, open)
  }, [])

  if (!visible) return null

  function choose(value) {
    setConsent(value)
    setVisible(false)
  }

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed bottom-4 inset-x-4 z-[90] max-w-3xl mx-auto bg-navy text-white border border-white/15 rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-5"
    >
      <p className="text-sm text-white/75 leading-relaxed">
        We use Google Analytics cookies to understand how visitors use our site. They
        stay off unless you accept. See our{' '}
        <Link to="/privacy-policy" className="text-orange font-medium hover:underline">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="flex gap-3 shrink-0">
        <button
          type="button"
          onClick={() => choose('denied')}
          className="btn-outline-dark text-sm py-2.5 px-5 justify-center flex-1 sm:flex-none"
        >
          Decline
        </button>
        <button
          type="button"
          onClick={() => choose('granted')}
          className="btn-primary text-sm py-2.5 px-5 justify-center flex-1 sm:flex-none"
        >
          Accept
        </button>
      </div>
    </div>
  )
}
