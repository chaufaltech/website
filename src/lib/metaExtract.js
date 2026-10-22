// URL Metadata Extractor — engine.
//
// The page is fetched through /api/audit (a website can't read other sites directly),
// then parsed and analysed here in the browser. The fetched HTML is only ever parsed
// with DOMParser (which never runs scripts or loads resources) and never inserted into
// the page; everything shown is plain text.

const TITLE_RANGE = [30, 60]
const DESCRIPTION_RANGE = [70, 160]

export function normalizeUrl(raw) {
  let v = (raw || '').trim()
  if (!v) return null
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`
  try {
    const url = new URL(v)
    return url.hostname.includes('.') ? url.href : null
  } catch {
    return null
  }
}

async function apiPost(action, url, timeoutMs = 30000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, url }),
      signal: controller.signal,
    })
    const body = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(body.error || `The service had a problem (error ${res.status}). Please try again in a moment.`)
    return body
  } catch (err) {
    if (err && err.name === 'AbortError') throw new Error('The request took too long. The site may be slow or unreachable.')
    throw err
  } finally {
    clearTimeout(timer)
  }
}

const textOf = (el) => (el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '')
const clean = (v) => (v == null ? '' : String(v).trim())

function absolute(href, base) {
  if (!href) return ''
  try {
    return new URL(href, base).href
  } catch {
    return clean(href)
  }
}

// Many sites answer automated requests with a short "Access Denied" / bot-check page.
const BLOCK_TITLE = /^(access denied|403 forbidden|forbidden|request blocked|blocked|just a moment\.{0,3}|attention required.*|pardon our interruption.*|access to this page has been denied.*|are you a robot.*|robot check|security check|human verification|please verify you are a human.*|error 1020.*|one more step.*)$/i
const BLOCK_BODY = /don['\u2019]t have permission to access|request unsuccessful\. incapsula|verify you are (a )?human|enable javascript and cookies to continue|checking your browser before accessing|access to this page has been denied|reference #\d+\.[0-9a-f.]+/i

function looksLikeBlockPage(doc) {
  const body = textOf(doc.body)
  if (body.split(/\s+/).filter(Boolean).length > 300) return false
  return BLOCK_TITLE.test(textOf(doc.querySelector('title'))) || BLOCK_BODY.test(body)
}

function collectTypes(node, out) {
  if (Array.isArray(node)) return node.forEach((n) => collectTypes(n, out))
  if (node && typeof node === 'object') {
    const t = node['@type']
    if (typeof t === 'string') out.add(t)
    else if (Array.isArray(t)) t.forEach((x) => typeof x === 'string' && out.add(x))
    if (node['@graph']) collectTypes(node['@graph'], out)
  }
}

function truncate(text, max) {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}\u2026` : text
}

function host(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return ''
  }
}

function check(id, label, status, detail, fix) {
  return { id, label, status, detail, fix: fix || '' }
}

function lengthCheck(id, label, value, [min, max], what) {
  if (!value) {
    return check(id, label, 'fail', `No ${what} found.`, `Add a ${what} of about ${min}–${max} characters.`)
  }
  const n = value.length
  if (n < min) return check(id, label, 'warn', `${n} characters. A little short.`, `Aim for roughly ${min}–${max} characters so it makes full use of the space in search results.`)
  if (n > max) return check(id, label, 'warn', `${n} characters. Likely to be cut off in search results.`, `Shorten it to about ${max} characters or fewer, with the important words first.`)
  return check(id, label, 'pass', `${n} characters. A good length.`)
}

export async function extractMetadata(inputUrl, { onProgress = () => {} } = {}) {
  onProgress('Fetching page\u2026')
  const page = await apiPost('meta', inputUrl)

  if (page.status < 200 || page.status >= 300) {
    const blocked = page.status === 401 || page.status === 403 || page.status === 429
    throw new Error(
      blocked
        ? `The site responded ${page.status} ${page.statusText}. It may block automated requests or require a login, so its metadata can't be read from here.`
        : `The server responded ${page.status} ${page.statusText || ''}`.trim() + ', so there is no page to read.'
    )
  }
  const looksLikeHtml = /<(?:!doctype\s+html|html|head|body)\b/i.test((page.html || '').slice(0, 5000))
  if (page.contentType && !/html|xml/i.test(page.contentType) && !looksLikeHtml) {
    throw new Error(`That URL returned "${page.contentType.split(';')[0].trim()}" instead of a web page, so there is no page metadata to read.`)
  }
  if (!page.html || !page.html.trim()) throw new Error('The page came back empty. The site may block automated requests.')

  onProgress('Reading metadata\u2026')
  const finalUrl = page.finalUrl
  const doc = new DOMParser().parseFromString(page.html, 'text/html')
  const accessDenied = looksLikeBlockPage(doc)

  // ---- every <meta> tag ----
  const allMeta = [...doc.querySelectorAll('meta')]
    .map((m) => {
      const kind = m.hasAttribute('name') ? 'name' : m.hasAttribute('property') ? 'property' : m.hasAttribute('http-equiv') ? 'http-equiv' : m.hasAttribute('charset') ? 'charset' : 'other'
      const key = m.getAttribute('name') || m.getAttribute('property') || m.getAttribute('http-equiv') || (kind === 'charset' ? 'charset' : '')
      const content = m.hasAttribute('content') ? m.getAttribute('content') : m.getAttribute('charset')
      return { kind, key: clean(key), content: clean(content) }
    })
    .filter((m) => m.key)
  const firstMeta = (...keys) => {
    const wanted = keys.map((k) => k.toLowerCase())
    const hit = allMeta.find((m) => wanted.includes(m.key.toLowerCase()))
    return hit ? hit.content : ''
  }

  // ---- basics ----
  const title = textOf(doc.querySelector('title'))
  const description = firstMeta('description')
  const canonicalEl = doc.querySelector('link[rel~="canonical" i]')
  const canonical = canonicalEl ? absolute(canonicalEl.getAttribute('href'), finalUrl) : ''
  const robotsMeta = firstMeta('robots')
  const charsetEl = doc.querySelector('meta[charset]')
  const httpEquivType = allMeta.find((m) => m.key.toLowerCase() === 'content-type')
  const charset = charsetEl ? clean(charsetEl.getAttribute('charset')) : httpEquivType ? clean((/charset=([\w-]+)/i.exec(httpEquivType.content) || [])[1]) : ''
  const themeColors = allMeta.filter((m) => m.key.toLowerCase() === 'theme-color').map((m) => m.content)

  const basic = {
    title,
    description,
    canonical,
    robots: robotsMeta,
    googlebot: firstMeta('googlebot'),
    bingbot: firstMeta('bingbot'),
    xRobotsTag: clean(page.xRobotsTag),
    language: clean(doc.documentElement.getAttribute('lang')),
    charset,
    viewport: firstMeta('viewport'),
    themeColor: themeColors.join(', '),
    author: firstMeta('author'),
    keywords: firstMeta('keywords'),
    generator: firstMeta('generator'),
    referrer: firstMeta('referrer'),
    applicationName: firstMeta('application-name'),
  }

  // ---- Open Graph & Twitter ----
  const ogList = allMeta.filter((m) => /^(og|article|profile|book|product|fb):/i.test(m.key)).map((m) => ({ property: m.key, content: m.content }))
  const og = (p) => (ogList.find((m) => m.property.toLowerCase() === p) || {}).content || ''
  const openGraph = {
    list: ogList,
    title: og('og:title'),
    description: og('og:description'),
    image: absolute(og('og:image') || og('og:image:url'), finalUrl),
    url: og('og:url'),
    type: og('og:type'),
    siteName: og('og:site_name'),
    locale: og('og:locale'),
  }
  const twList = allMeta.filter((m) => /^twitter:/i.test(m.key)).map((m) => ({ name: m.key, content: m.content }))
  const tw = (n) => (twList.find((m) => m.name.toLowerCase() === n) || {}).content || ''
  const twitter = {
    list: twList,
    card: tw('twitter:card'),
    title: tw('twitter:title'),
    description: tw('twitter:description'),
    image: absolute(tw('twitter:image') || tw('twitter:image:src'), finalUrl),
    site: tw('twitter:site'),
    creator: tw('twitter:creator'),
  }

  // ---- icons, alternates, feeds ----
  const icons = [...doc.querySelectorAll('link[rel]')]
    .filter((l) => /(^|\s)(icon|shortcut|apple-touch-icon|apple-touch-icon-precomposed|mask-icon|manifest|fluid-icon)(\s|$)/i.test(l.getAttribute('rel')))
    .map((l) => ({
      rel: clean(l.getAttribute('rel')),
      href: absolute(l.getAttribute('href'), finalUrl),
      sizes: clean(l.getAttribute('sizes')),
      type: clean(l.getAttribute('type')),
    }))
    .filter((i) => i.href)

  const alternates = [...doc.querySelectorAll('link[rel~="alternate" i][hreflang]')].map((l) => ({
    hreflang: clean(l.getAttribute('hreflang')),
    href: absolute(l.getAttribute('href'), finalUrl),
  }))
  const feeds = [...doc.querySelectorAll('link[rel~="alternate" i][type]')]
    .filter((l) => /rss|atom|feed|json/i.test(l.getAttribute('type')) && !l.hasAttribute('hreflang'))
    .map((l) => ({ title: clean(l.getAttribute('title')), type: clean(l.getAttribute('type')), href: absolute(l.getAttribute('href'), finalUrl) }))
  const related = ['amphtml', 'prev', 'next', 'shortlink', 'manifest']
    .map((rel) => {
      const el = doc.querySelector(`link[rel~="${rel}" i]`)
      return el ? { rel, href: absolute(el.getAttribute('href'), finalUrl) } : null
    })
    .filter(Boolean)

  // ---- structured data (JSON-LD) ----
  const structuredData = [...doc.querySelectorAll('script[type="application/ld+json" i]')].map((s) => {
    const raw = (s.textContent || '').trim()
    try {
      const data = JSON.parse(raw)
      const types = new Set()
      collectTypes(data, types)
      return { valid: true, types: [...types], data }
    } catch (err) {
      return { valid: false, types: [], error: err.message, raw: truncate(raw, 2000) }
    }
  })

  // ---- headings ----
  const headings = {
    h1: [...doc.querySelectorAll('h1')].map(textOf).filter(Boolean).slice(0, 5),
    counts: { h1: doc.querySelectorAll('h1').length, h2: doc.querySelectorAll('h2').length, h3: doc.querySelectorAll('h3').length },
  }

  // ---- raw <head> markup (one tag per line; scripts other than JSON-LD and all styles were removed by the server) ----
  const headRaw = doc.head ? doc.head.innerHTML.replace(/>\s*(?=<)/g, '>\n').trim() : ''
  const headHtml = truncate(headRaw, 30000)

  // ---- previews (with the fallbacks the platforms actually use) ----
  const displayUrl = (() => {
    try {
      const u = new URL(finalUrl)
      const path = u.pathname === '/' ? '' : u.pathname.replace(/\/$/, '').split('/').filter(Boolean).join(' \u203A ')
      return `${u.hostname}${path ? ` \u203A ${path}` : ''}`
    } catch {
      return finalUrl
    }
  })()
  const previews = {
    google: { displayUrl, title: truncate(title || '(no title)', 60), description: truncate(description, 160) },
    facebook: {
      domain: host(openGraph.url || finalUrl),
      title: openGraph.title || title,
      description: openGraph.description || description,
      image: openGraph.image,
      usesFallback: !openGraph.title || !openGraph.description,
    },
    x: {
      card: twitter.card,
      domain: host(finalUrl),
      title: twitter.title || openGraph.title || title,
      description: twitter.description || openGraph.description || description,
      image: twitter.image || openGraph.image,
      usesFallback: !twitter.title || !twitter.description || !twitter.image,
    },
  }

  // ---- analysis ----
  const checks = []
  checks.push(lengthCheck('title', 'Title tag', title, TITLE_RANGE, 'title'))
  checks.push(lengthCheck('description', 'Meta description', description, DESCRIPTION_RANGE, 'meta description'))

  if (!canonical) {
    checks.push(check('canonical', 'Canonical URL', 'warn', 'No canonical link found.', 'Add <link rel="canonical" href="\u2026"> pointing to the preferred URL of this page to avoid duplicate-content splitting.'))
  } else {
    const same = canonical.replace(/\/$/, '') === finalUrl.replace(/\/$/, '')
    checks.push(check('canonical', 'Canonical URL', 'pass', same ? 'Points to this page.' : `Points to a different URL: ${canonical}`, same ? '' : 'This is fine if intentional. Otherwise the canonical may be telling search engines to index another page instead.'))
  }

  const robotsAll = `${basic.robots} ${basic.googlebot} ${basic.xRobotsTag}`.toLowerCase()
  if (/noindex|none/.test(robotsAll)) {
    checks.push(check('robots', 'Indexing directives', 'fail', `The page asks search engines not to index it (${[basic.robots, basic.googlebot, basic.xRobotsTag].filter(Boolean).join('; ')}).`, 'Remove the noindex directive (meta robots or X-Robots-Tag) if you want this page to appear in search results.'))
  } else if (/nofollow/.test(robotsAll)) {
    checks.push(check('robots', 'Indexing directives', 'warn', 'The page asks search engines not to follow its links (nofollow).', 'Remove nofollow unless you intend to stop link signals passing from this page.'))
  } else {
    checks.push(check('robots', 'Indexing directives', 'pass', basic.robots || basic.xRobotsTag ? `Indexable (${basic.robots || basic.xRobotsTag}).` : 'No noindex or nofollow directive found.'))
  }

  checks.push(basic.viewport
    ? check('viewport', 'Viewport', 'pass', basic.viewport)
    : check('viewport', 'Viewport', 'warn', 'No viewport meta tag found.', 'Add <meta name="viewport" content="width=device-width, initial-scale=1"> so the page works properly on mobile.'))
  checks.push(basic.language
    ? check('lang', 'Language', 'pass', `Declared as "${basic.language}".`)
    : check('lang', 'Language', 'warn', 'No lang attribute on the <html> tag.', 'Add lang="en" (or the right language code) to <html>. Search engines and screen readers use it.'))
  checks.push(basic.charset
    ? check('charset', 'Character encoding', 'pass', basic.charset)
    : check('charset', 'Character encoding', 'warn', 'No character encoding declared in the page.', 'Add <meta charset="UTF-8"> as early as possible in <head>.'))

  const missingOg = ['title', 'description', 'image', 'url', 'type'].filter((k) => !openGraph[k])
  checks.push(missingOg.length === 0
    ? check('og', 'Open Graph', 'pass', 'Title, description, image, URL and type are all set.')
    : check('og', 'Open Graph', openGraph.title || openGraph.image ? 'warn' : 'fail', `Missing: ${missingOg.map((k) => `og:${k}`).join(', ')}.`, 'Add the missing og: tags so links to this page look right on Facebook, LinkedIn, WhatsApp, Slack and similar. A 1200\u00D7630 image works well for og:image.'))

  checks.push(twitter.card
    ? check('twitter', 'X / Twitter card', 'pass', `Card type: ${twitter.card}.`)
    : check('twitter', 'X / Twitter card', 'warn', 'No twitter:card tag found.', 'Add <meta name="twitter:card" content="summary_large_image"> for a controlled preview when shared on X. Open Graph tags are used as a fallback.'))

  checks.push(icons.some((i) => /icon/i.test(i.rel) && !/mask|manifest/i.test(i.rel))
    ? check('icon', 'Favicon', 'pass', 'An icon is declared.')
    : check('icon', 'Favicon', 'warn', 'No icon link found. Browsers will look for /favicon.ico.', 'Add <link rel="icon" href="/favicon.ico" sizes="48x48"> (and an SVG or PNG version). Google shows favicons in mobile search results.'))

  const invalid = structuredData.filter((b) => !b.valid)
  if (invalid.length) {
    checks.push(check('jsonld', 'Structured data', 'fail', `${invalid.length} JSON-LD block${invalid.length > 1 ? 's' : ''} could not be parsed.`, 'Fix the JSON syntax (a stray comma or quote is the usual cause). Invalid structured data is ignored by search engines.'))
  } else if (structuredData.length) {
    const types = [...new Set(structuredData.flatMap((b) => b.types))]
    checks.push(check('jsonld', 'Structured data', 'pass', `${structuredData.length} JSON-LD block${structuredData.length > 1 ? 's' : ''}${types.length ? `: ${types.join(', ')}` : ''}.`))
  } else {
    checks.push(check('jsonld', 'Structured data', 'warn', 'No JSON-LD structured data found.', 'Add schema.org markup (Organization, Article, Product, FAQPage\u2026) so search engines and AI answers can understand the page.'))
  }

  if (alternates.length) {
    checks.push(alternates.some((a) => a.hreflang.toLowerCase() === 'x-default')
      ? check('hreflang', 'Language alternates', 'pass', `${alternates.length} hreflang link${alternates.length > 1 ? 's' : ''}, including x-default.`)
      : check('hreflang', 'Language alternates', 'warn', `${alternates.length} hreflang link${alternates.length > 1 ? 's' : ''}, but no x-default.`, 'Add an x-default hreflang entry for visitors whose language isn\u2019t listed.'))
  }

  const summary = { pass: checks.filter((c) => c.status === 'pass').length, warn: checks.filter((c) => c.status === 'warn').length, fail: checks.filter((c) => c.status === 'fail').length }

  return {
    inputUrl,
    url: finalUrl,
    fetchedAt: new Date().toISOString(),
    accessDenied,
    truncated: !!page.truncated,
    response: {
      status: page.status,
      statusText: page.statusText,
      contentType: clean(page.contentType),
      redirects: Array.isArray(page.redirects) ? page.redirects : [],
    },
    basic,
    openGraph,
    twitter,
    icons,
    alternates,
    feeds,
    related,
    structuredData,
    headings,
    previews,
    headHtml,
    headHtmlTruncated: headRaw.length > 30000,
    allMeta,
    checks,
    summary,
  }
}