import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { CONSENT_EVENT, getConsent, loadAnalytics, trackPageView } from '../lib/analytics.js'

// Renders nothing. Loads Google Analytics only after consent, then sends a
// page view for the current route and for every route change.
export default function Analytics() {
  // Depend on path + query only, so in-page #anchor clicks don't count as page views.
  const { pathname, search } = useLocation()
  const [consent, setConsentState] = useState(getConsent)

  useEffect(() => {
    const onChange = (event) => setConsentState(event.detail)
    window.addEventListener(CONSENT_EVENT, onChange)
    return () => window.removeEventListener(CONSENT_EVENT, onChange)
  }, [])

  useEffect(() => {
    if (consent !== 'granted') return
    loadAnalytics()
    trackPageView(pathname + search)
  }, [consent, pathname, search])

  return null
}