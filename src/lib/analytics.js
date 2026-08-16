// Thin wrapper around gtag.js (loaded in index.html). Kept in one place so
// there's a single spot to swap providers later, and so page views fire
// correctly in a single-page app (GA's automatic page_view only fires once,
// on the initial full page load — route changes need to be sent manually).

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID

export function trackPageView(path) {
  if (!GA_ID || typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  })
}

export function trackEvent(name, params = {}) {
  if (!GA_ID || typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
