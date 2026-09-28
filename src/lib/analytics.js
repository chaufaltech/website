// Consent-aware wrapper around Google Analytics (gtag.js).
//
// Nothing is loaded from Google and no analytics cookies are set until the
// visitor clicks "Accept" in the cookie banner. Declining (or withdrawing
// consent later via "Cookie Settings" in the footer) switches tracking off and
// removes any analytics cookies already set.
//
// Page views are sent manually from components/Analytics.jsx because this is a
// single-page app: GA's automatic page_view only fires on the first full load.

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

const CONSENT_KEY = 'chaufal-cookie-consent'
// Ask again after this long. Adjust if your legal advice says otherwise.
const CONSENT_MAX_AGE_MS = 365 * 24 * 60 * 60 * 1000

export const CONSENT_EVENT = 'chaufal:consent-change'
export const OPEN_SETTINGS_EVENT = 'chaufal:open-cookie-settings'

// No Measurement ID configured = no analytics = nothing to ask consent for.
export const analyticsAvailable = Boolean(GA_ID)

let loaded = false

export function getConsent() {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const { value, ts } = JSON.parse(raw)
    const valid = value === 'granted' || value === 'denied'
    if (!valid || Date.now() - ts > CONSENT_MAX_AGE_MS) return null
    return value
  } catch {
    return null
  }
}

function clearAnalyticsCookies() {
  const expired = 'expires=Thu, 01 Jan 1970 00:00:00 GMT'
  const parts = window.location.hostname.split('.')
  // GA sets its cookies on the highest domain the browser allows, so try every
  // suffix of the hostname (the browser ignores ones it won't accept).
  const domains = parts.map((_, i) => `.${parts.slice(i).join('.')}`)
  domains.push(window.location.hostname)

  document.cookie
    .split(';')
    .map((c) => c.split('=')[0].trim())
    .filter((name) => name === '_ga' || name === '_gid' || name.startsWith('_ga_') || name.startsWith('_gat'))
    .forEach((name) => {
      document.cookie = `${name}=; ${expired}; path=/`
      domains.forEach((domain) => {
        document.cookie = `${name}=; ${expired}; path=/; domain=${domain}`
      })
    })
}

export function setConsent(value) {
  try {
    window.localStorage.setItem(CONSENT_KEY, JSON.stringify({ value, ts: Date.now() }))
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }

  if (GA_ID) {
    // Official GA switch: when true, gtag sends nothing.
    window[`ga-disable-${GA_ID}`] = value !== 'granted'
  }
  if (value !== 'granted') clearAnalyticsCookies()

  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }))
}

// Injects gtag.js. Call only after consent has been granted.
export function loadAnalytics() {
  if (!GA_ID || loaded) return
  loaded = true

  window[`ga-disable-${GA_ID}`] = false
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }
  window.gtag('js', new Date())
  // send_page_view is off: Analytics.jsx sends page views on route changes.
  window.gtag('config', GA_ID, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
  document.head.appendChild(script)
}

export function trackPageView(path) {
  if (!GA_ID || typeof window.gtag !== 'function' || getConsent() !== 'granted') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(name, params = {}) {
  if (!GA_ID || typeof window.gtag !== 'function' || getConsent() !== 'granted') return
  window.gtag('event', name, params)
}