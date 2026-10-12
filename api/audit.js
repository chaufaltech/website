import { AuditFetchError, resolvePublicTarget, safeGet } from './_lib/safeFetch.js'

// Backend for the SEO / GEO Calculator (src/pages/SeoGeoCalculator.jsx).
//
// A website can't read other sites directly (browser CORS rules), so the page
// asks this endpoint to do the fetching. POST { action, url }:
//   page  fetch the page being audited and return its HTML
//   text  fetch /robots.txt, /sitemap.xml or /llms.txt from the same site
//   psi   run Google PageSpeed Insights (uses the optional PSI_API_KEY env var)
//
// Nothing is stored. Credentials are server-side only; do not use VITE_-prefixed variables.

const PSI_API_KEY = process.env.PSI_API_KEY || ''

// --- Basic rate limiting (in-memory, per serverless instance) -----------------
// Stops casual abuse; it resets on cold starts and isn't shared across
// instances. For stronger protection add Vercel's WAF rate limiting.
const WINDOW_MS = 10 * 60 * 1000
const LIMITS = { page: 10, text: 40, psi: 10 }
const hits = { page: new Map(), text: new Map(), psi: new Map() }

function isRateLimited(action, ip) {
  const now = Date.now()
  const store = hits[action]
  for (const [key, stamps] of store) {
    const recent = stamps.filter((t) => now - t < WINDOW_MS)
    if (recent.length) store.set(key, recent)
    else store.delete(key)
  }
  const recent = store.get(ip) || []
  if (recent.length >= LIMITS[action]) return true
  recent.push(now)
  store.set(ip, recent)
  return false
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

// Same-site requests only.
function isAllowedOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return true
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}

const ALLOWED_TEXT_PATHS = new Set(['/robots.txt', '/sitemap.xml', '/llms.txt'])

async function handlePage(url) {
  const page = await safeGet(url, { maxBytes: 3 * 1024 * 1024, timeoutMs: 15000 })
  return {
    finalUrl: page.finalUrl,
    status: page.status,
    statusText: page.statusText,
    contentType: page.contentType,
    xRobotsTag: page.xRobotsTag,
    truncated: page.truncated,
    // Only return a body for successful HTML responses.
    html: page.status >= 200 && page.status < 300 ? page.text : '',
  }
}

async function handleText(url) {
  let target
  try {
    target = new URL(url)
  } catch {
    throw new AuditFetchError('Invalid URL.')
  }
  if (!ALLOWED_TEXT_PATHS.has(target.pathname)) throw new AuditFetchError('Unsupported file.')
  try {
    const res = await safeGet(target.href, { maxBytes: 300 * 1024, timeoutMs: 8000 })
    return {
      ok: res.status >= 200 && res.status < 300,
      contentType: res.contentType,
      text: res.status >= 200 && res.status < 300 ? res.text.slice(0, 100 * 1024) : '',
    }
  } catch {
    // A missing or unreachable file is a normal result, not a server error.
    return { ok: false, contentType: '', text: '' }
  }
}

const FIELD_METRICS = ['LARGEST_CONTENTFUL_PAINT_MS', 'CUMULATIVE_LAYOUT_SHIFT_SCORE', 'INTERACTION_TO_NEXT_PAINT']
function pickField(experience) {
  const metrics = experience && experience.metrics
  if (!metrics) return undefined
  const out = {}
  FIELD_METRICS.forEach((key) => {
    if (metrics[key]) out[key] = { percentile: metrics[key].percentile }
  })
  return { metrics: out }
}

async function handlePsi(url) {
  await resolvePublicTarget(url) // same public-address rules as everything else

  const endpoint = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed')
  endpoint.searchParams.set('url', url)
  endpoint.searchParams.set('strategy', 'mobile')
  endpoint.searchParams.set('category', 'performance')
  if (PSI_API_KEY) endpoint.searchParams.set('key', PSI_API_KEY)

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), 50000)
  try {
    const res = await fetch(endpoint.href, { signal: controller.signal })
    if (!res.ok) {
      const body = await res.json().catch(() => null)
      return { psiError: { status: res.status, message: (body && body.error && body.error.message) || `HTTP ${res.status}` } }
    }
    const data = await res.json()
    const lh = data.lighthouseResult || {}
    const audits = lh.audits || {}
    const num = (id) => (audits[id] ? { numericValue: audits[id].numericValue } : undefined)
    // Return only what the audit uses; the full response is several MB.
    return {
      lighthouseResult: {
        categories: { performance: { score: lh.categories && lh.categories.performance ? lh.categories.performance.score : null } },
        audits: {
          'largest-contentful-paint': num('largest-contentful-paint'),
          'cumulative-layout-shift': num('cumulative-layout-shift'),
          'total-blocking-time': num('total-blocking-time'),
        },
      },
      loadingExperience: pickField(data.loadingExperience),
      originLoadingExperience: pickField(data.originLoadingExperience),
    }
  } catch (err) {
    if (err && err.name === 'AbortError') return { psiError: { status: 504, message: 'timed out' } }
    return { psiError: { status: 502, message: 'Could not reach PageSpeed Insights.' } }
  } finally {
    clearTimeout(timer)
  }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }
  if (!isAllowedOrigin(req)) return res.status(403).json({ error: 'Forbidden' })

  const action = req.body && req.body.action
  const url = req.body && typeof req.body.url === 'string' ? req.body.url.trim() : ''
  if (!LIMITS[action]) return res.status(400).json({ error: 'Unknown action.' })
  if (!url || url.length > 2048) return res.status(400).json({ error: 'A valid URL is required.' })

  if (isRateLimited(action, getClientIp(req))) {
    res.setHeader('Retry-After', String(WINDOW_MS / 1000))
    return res.status(429).json({ error: 'Too many audits from your connection. Please try again in a few minutes.' })
  }

  try {
    if (action === 'page') return res.status(200).json(await handlePage(url))
    if (action === 'text') return res.status(200).json(await handleText(url))
    return res.status(200).json(await handlePsi(url))
  } catch (error) {
    if (error instanceof AuditFetchError) return res.status(error.status).json({ error: error.message })
    console.error('Audit endpoint error:', error)
    return res.status(500).json({ error: 'Something went wrong while auditing that page.' })
  }
}
