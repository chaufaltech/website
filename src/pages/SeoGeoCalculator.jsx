import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import CtaBanner from '../components/CtaBanner.jsx'
import { SITE_URL, breadcrumbSchema } from '../lib/seo.js'
import { trackEvent } from '../lib/analytics.js'
import { auditUrl } from '../lib/seoAudit.js'

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
const TOOL_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'SEO / GEO Calculator',
  url: `${SITE_URL}/tools/seo-geo-calculator`,
  description:
    'Audit any page for SEO, accessibility, performance and AI-search (GEO) readiness. Get a 1–10 score and a prioritized fix list.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any (web browser)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Chaufal Tech', url: `${SITE_URL}/` },
}

const WHAT_IT_CHECKS = [
  {
    icon: 'search',
    title: 'Meta & Indexability',
    text: 'Title, meta description, canonical URL, robots / noindex, viewport, language and character set.',
  },
  {
    icon: 'monitor-trend',
    title: 'Performance',
    text: 'Live Core Web Vitals (LCP, CLS, INP) and the Lighthouse mobile score, from Google PageSpeed Insights.',
  },
  {
    icon: 'document',
    title: 'Content & Structure',
    text: 'H1 usage, heading hierarchy and content depth.',
  },
  {
    icon: 'image',
    title: 'Images & Media',
    text: 'Alt text quality and missing image dimensions that cause layout shift.',
  },
  {
    icon: 'users',
    title: 'Accessibility',
    text: 'Form labels, landmark regions and link text quality, plus a reminder for manual contrast checks.',
  },
  {
    icon: 'gear',
    title: 'Technical SEO',
    text: 'HTTPS, structured data (JSON-LD), Open Graph, Twitter cards, robots.txt and sitemap.xml.',
  },
  {
    icon: 'bulb',
    title: 'GEO / AI-Search Readiness',
    text: 'Schema relevance, author and dates, an answer-first opening, semantic HTML, citations and llms.txt.',
  },
  {
    icon: 'target',
    title: 'Target Keyword (optional)',
    text: 'Whether the page is actually optimized to rank for the phrase you care about.',
  },
]

const LIMITATIONS = [
  'It reads the page\u2019s HTML as a crawler would. Content that only appears after JavaScript runs isn\u2019t seen.',
  'Colour contrast can\u2019t be measured from HTML alone, so the report flags it for a manual check.',
  '\u201CRanking readiness\u201D is a heuristic score for on-page factors. It is not a live Google position, since real rankings also depend on backlinks, domain history and competition.',
  'Sites that block automated requests (or need a login) can\u2019t be audited.',
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function normalizeUrl(raw) {
  let v = raw.trim()
  if (!v) return null
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`
  try {
    const url = new URL(v)
    return url.hostname.includes('.') ? url.href : null
  } catch {
    return null
  }
}

const PCT_STYLES = {
  good: { text: 'text-emerald-700', border: 'border-emerald-700', bar: 'bg-emerald-600', badge: 'bg-emerald-50 text-emerald-700' },
  warn: { text: 'text-yellow-700', border: 'border-yellow-600', bar: 'bg-yellow-500', badge: 'bg-yellow-50 text-yellow-700' },
  bad: { text: 'text-red-600', border: 'border-red-600', bar: 'bg-red-500', badge: 'bg-red-50 text-red-600' },
}
const pctTone = (pct) => (pct >= 80 ? 'good' : pct >= 55 ? 'warn' : 'bad')
const tenTone = (v) => (v >= 8 ? 'good' : v >= 6 ? 'warn' : 'bad')

const STATUS = {
  pass: { icon: '\u2713', cls: 'text-emerald-600', label: 'Passed' },
  warn: { icon: '!', cls: 'text-yellow-600', label: 'Needs attention' },
  fail: { icon: '\u2715', cls: 'text-red-600', label: 'Failed' },
}

const IMPACT_TAG = {
  high: 'bg-red-50 text-red-600',
  medium: 'bg-yellow-50 text-yellow-700',
  low: 'bg-black/5 text-muted',
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------
function Stamp({ value, label, tone, tilt }) {
  const s = PCT_STYLES[tone]
  return (
    <div className={`border-2 rounded-md px-4 py-2.5 text-center min-w-[118px] ${s.text} ${s.border} ${tilt}`}>
      <div className="font-display font-bold text-2xl leading-none">{value}</div>
      <div className="font-mono text-[10px] uppercase tracking-wider mt-1.5">{label}</div>
    </div>
  )
}

function CategoryCard({ meta, score, checks, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen)
  const tone = PCT_STYLES[pctTone(score)]
  return (
    <div className="bg-white border border-black/10 rounded-lg mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-cream/40 transition-colors"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className="font-display font-bold text-ink text-[15px]">{meta.label}</span>
          <span className={`font-mono text-[11px] rounded-full px-2.5 py-0.5 shrink-0 ${tone.badge}`}>{score}/100</span>
        </span>
        <Icon name="chevron" className={`w-4 h-4 text-muted shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} strokeWidth={2} />
      </button>

      {open && (
        <div className="px-5 pb-4">
          {checks.map((c) => {
            const st = STATUS[c.status]
            return (
              <div key={c.id} className="py-3.5 border-t border-black/10 first:border-t-0">
                <div className="flex items-baseline gap-2">
                  <span className={`font-mono text-sm w-4 shrink-0 ${st.cls}`} aria-label={st.label}>{st.icon}</span>
                  <span className="font-semibold text-ink text-sm">{c.label}</span>
                  <span className="ml-auto font-mono text-[10px] uppercase text-muted shrink-0">{c.impact}</span>
                </div>
                <p className="text-[13.5px] text-muted mt-1 ml-6 leading-relaxed">{c.detail}</p>
                {c.fix && (
                  <div className="ml-6 mt-2 border-l-2 border-orange bg-paper px-3 py-2">
                    <b className="block font-mono text-[10px] uppercase tracking-wider text-orange mb-1">Fix</b>
                    <span className="text-[13.5px] text-ink/80 leading-relaxed">{c.fix}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h3 className="font-mono text-sm uppercase tracking-wider text-ink border-b border-ink pb-2 mt-10 mb-5">{children}</h3>
  )
}

function Report({ r, reportRef }) {
  const keys = Object.keys(r.categoryMeta)
  const recommendations = r.issues.filter((c) => c.fix)

  return (
    <div ref={reportRef} tabIndex={-1} className="outline-none mt-10 pt-8 border-t-[3px] border-double border-ink">
      {/* Letterhead */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="min-w-0">
          <h2 className="font-display font-bold text-xl text-ink leading-snug">{r.title}</h2>
          <p className="font-mono text-[11px] text-muted mt-2 break-all">{r.url}</p>
          <p className="font-mono text-[11px] text-muted mt-1">
            Audited {new Date(r.fetchedAt).toLocaleString()}
            {r.targetKeyword && (
              <>
                {' '}&middot; Target keyword: <b className="text-ink">{r.targetKeyword}</b>
              </>
            )}
          </p>
        </div>
        <div className="flex gap-4 flex-wrap shrink-0">
          <Stamp value={`${r.overallScore10.toFixed(1)}/10`} label="Overall score" tone={tenTone(r.overallScore10)} tilt="-rotate-2" />
          <Stamp value={r.rankingReadiness} label="Ranking readiness" tone={pctTone(r.rankingReadiness)} tilt="rotate-1" />
        </div>
      </div>
      <p className="font-mono text-[10.5px] text-muted leading-relaxed border-l-2 border-black/10 pl-3 mt-6">
        &ldquo;Ranking readiness&rdquo; is a heuristic composite of the on-page factors that influence organic performance
        (technical health, content quality, GEO signals). It is not a live Google position: real rank also depends on
        backlinks, domain history and competition, which can&apos;t be seen from a single page.
      </p>

      {/* At a glance */}
      <SectionTitle>At a glance</SectionTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-emerald-700 mb-3">Working in the page&apos;s favour</h4>
          <ul>
            {r.wins.slice(0, 6).map((c) => (
              <li key={c.id} className="flex gap-2 text-sm text-ink/90 py-2 border-b border-black/10 last:border-0">
                <span className="font-mono text-emerald-600 shrink-0" aria-hidden>{'\u2713'}</span>
                <span>{c.label} &mdash; {c.detail}</span>
              </li>
            ))}
            {r.wins.length === 0 && <li className="text-sm text-muted">No clean passes yet.</li>}
          </ul>
        </div>
        <div>
          <h4 className="font-mono text-[11px] uppercase tracking-wider text-red-600 mb-3">Working against it</h4>
          <ul>
            {r.issues.slice(0, 6).map((c) => (
              <li key={c.id} className="flex gap-2 text-sm text-ink/90 py-2 border-b border-black/10 last:border-0">
                <span className="font-mono text-red-600 shrink-0" aria-hidden>{'\u2715'}</span>
                <span>{c.label} &mdash; {c.detail}</span>
              </li>
            ))}
            {r.issues.length === 0 && <li className="text-sm text-muted">No issues found in this pass. Nice work.</li>}
          </ul>
        </div>
      </div>

      {/* Category scores */}
      <SectionTitle>Category scores</SectionTitle>
      <div className="space-y-3">
        {keys.map((key) => {
          const score = r.categoryScores[key]
          return (
            <div key={key} className="grid grid-cols-[minmax(0,1fr)_40px] sm:grid-cols-[210px_minmax(0,1fr)_40px] gap-x-3 gap-y-1.5 items-center">
              <div className="font-mono text-[11px] uppercase tracking-wide text-ink col-span-2 sm:col-span-1">{r.categoryMeta[key].label}</div>
              <div className="h-2.5 bg-black/10 rounded-sm overflow-hidden">
                <div className={`h-full rounded-sm ${PCT_STYLES[pctTone(score)].bar}`} style={{ width: `${score}%` }} />
              </div>
              <div className="font-mono text-[11px] text-muted text-right">{score}</div>
            </div>
          )
        })}
      </div>

      {/* Full breakdown */}
      <SectionTitle>Full breakdown</SectionTitle>
      {keys.map((key, i) => (
        <CategoryCard key={key} meta={r.categoryMeta[key]} score={r.categoryScores[key]} checks={r.categories[key]} defaultOpen={i === 0} />
      ))}

      {/* Recommendations */}
      <SectionTitle>Recommended improvements &mdash; highest impact first</SectionTitle>
      {recommendations.length === 0 ? (
        <p className="text-sm text-muted">Nothing outstanding. This page clears every check in this audit.</p>
      ) : (
        <ol>
          {recommendations.map((c, i) => (
            <li key={c.id} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3 py-4 border-b border-black/10">
              <span className="font-mono text-[13px] text-muted">{i + 1}</span>
              <div>
                <h4 className="font-display font-semibold text-ink text-[14.5px]">
                  {c.label}
                  <span className={`ml-2 align-middle font-mono text-[9px] uppercase tracking-wider rounded-full px-2 py-0.5 ${IMPACT_TAG[c.impact]}`}>
                    {c.impact} impact
                  </span>
                </h4>
                <p className="text-[13.5px] text-muted mt-1 leading-relaxed">{c.fix}</p>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-10 bg-navy text-white rounded-2xl px-6 py-7 md:px-8 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <p className="text-sm text-white/75 max-w-lg leading-relaxed">
          Want help turning this list into results? We can fix the issues, improve the page&apos;s speed and build
          the structured data that helps both search engines and AI answers.
        </p>
        <Link to="/contact" className="btn-primary shrink-0 self-start md:self-auto">
          Talk to us <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function SeoGeoCalculator() {
  const [url, setUrl] = useState('')
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState('idle') // idle | running | done | error
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [report, setReport] = useState(null)
  const reportRef = useRef(null)

  // When a report appears, bring it into view and move focus to it.
  useEffect(() => {
    if (status === 'done' && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      reportRef.current.focus({ preventScroll: true })
    }
  }, [status])

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'running') return

    const normalized = normalizeUrl(url)
    if (!normalized) {
      setError('Enter a valid web address, e.g. example.com/pricing')
      setStatus('error')
      return
    }

    setError('')
    setReport(null)
    setProgress('Fetching page\u2026')
    setStatus('running')
    trackEvent('seo_geo_audit_run', { has_keyword: Boolean(keyword.trim()) })

    try {
      const result = await auditUrl(normalized, { targetKeyword: keyword, onProgress: setProgress })
      setReport(result)
      setStatus('done')
    } catch (err) {
      setError(err && err.message ? err.message : 'The page could not be audited. Please check the address and try again.')
      setStatus('error')
    }
  }

  const running = status === 'running'

  return (
    <>
      <Seo
        title="Free SEO & GEO Audit Tool | Chaufal Tech"
        description="Audit any page for SEO, accessibility, performance and AI-search (GEO) readiness. Get a 1–10 score and a prioritized fix list. Free, no sign-up."
        path="/tools/seo-geo-calculator"
        jsonLd={[
          TOOL_SCHEMA,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: 'SEO / GEO Calculator', path: '/tools/seo-geo-calculator' },
          ]),
        ]}
      />

      {/* HERO */}
      <section className="bg-navy text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-blueprint [mask-image:linear-gradient(to_right,transparent,black)]" aria-hidden />
        <div className="section pt-36 pb-16 lg:pt-44 lg:pb-20 relative">
          <Link
            to="/work"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-orange transition-colors mb-6"
          >
            <Icon name="chevron" className="w-4 h-4 rotate-180" strokeWidth={2} />
            Back to Work
          </Link>
          <div>
            <span className="eyebrow">Free Tool</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mt-4 max-w-2xl">
            SEO / GEO Calculator
          </h1>
          <p className="text-white/70 mt-5 max-w-xl leading-relaxed">
            Analyze, optimize and track your content&apos;s visibility &mdash; across search engines and AI platforms.
            Audit any page and get a 1&ndash;10 score with a prioritized list of fixes.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-7 text-xs text-white/70">
            {['SEO', 'Accessibility', 'Core Web Vitals', 'AI-search readiness'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-orange text-orange flex items-center justify-center">
                  <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3.5} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* TOOL */}
      <section className="bg-cream/40 py-14 lg:py-16">
        <div className="section max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-6 md:p-10">
            <form onSubmit={handleSubmit} noValidate>
              <label htmlFor="audit-url" className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
                Page to inspect
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  id="audit-url"
                  type="text"
                  inputMode="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="example.com/page"
                  autoComplete="off"
                  spellCheck="false"
                  aria-describedby={status === 'error' ? 'audit-error' : undefined}
                  aria-invalid={status === 'error' && !report ? true : undefined}
                  className="flex-1 min-w-0 border border-black/20 rounded-lg px-4 py-3.5 font-mono text-sm focus:border-orange outline-none"
                />
                <button type="submit" disabled={running} className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                  {running ? 'Auditing\u2026' : 'Run audit'}
                </button>
              </div>

              <label htmlFor="audit-keyword" className="block font-mono text-[11px] uppercase tracking-wider text-muted mt-5 mb-2">
                Target keyword (optional)
              </label>
              <input
                id="audit-keyword"
                type="text"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="e.g. mens running shoes"
                autoComplete="off"
                spellCheck="false"
                className="w-full border border-black/20 rounded-lg px-4 py-3.5 font-mono text-sm focus:border-orange outline-none"
              />
              <p className="text-xs text-muted mt-2 leading-relaxed">
                Adds a section checking whether the page is actually optimized to rank for that phrase.
              </p>
            </form>

            <div aria-live="polite" className="mt-5">
              {status === 'error' && (
                <p id="audit-error" role="alert" className="text-sm text-red-600 leading-relaxed">
                  {error}
                </p>
              )}
              {running && (
                <div className="flex items-center gap-3 text-sm text-muted">
                  <span className="w-4 h-4 rounded-full border-2 border-orange border-t-transparent animate-spin shrink-0" aria-hidden />
                  <span>{progress}</span>
                </div>
              )}
            </div>

            <p className="text-xs text-muted leading-relaxed mt-5">
              To read a page, our server fetches it for you (websites can&apos;t be read directly from a browser). We
              don&apos;t store the page or your report.
            </p>

            {status === 'done' && report && <Report r={report} reportRef={reportRef} />}
          </div>
        </div>
      </section>

      {/* WHAT IT CHECKS */}
      <section className="section py-16 lg:py-20">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">What it checks</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">
            One audit. Everything that affects visibility<span className="text-orange">.</span>
          </h2>
          <p className="text-muted mt-4 leading-relaxed">
            Each check carries an impact weight (high, medium or low) that feeds the category scores and the overall
            1&ndash;10 score, so the biggest problems come first.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {WHAT_IT_CHECKS.map((c) => (
            <div key={c.title} className="bg-white border border-black/5 rounded-xl2 p-6 shadow-sm">
              <span className="w-11 h-11 rounded-full bg-orange/10 text-orange flex items-center justify-center">
                <Icon name={c.icon} className="w-5 h-5" />
              </span>
              <h3 className="font-display font-bold text-ink text-[15px] mt-4">{c.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* GOOD TO KNOW */}
      <section className="bg-navy text-white py-16 lg:py-20">
        <div className="section grid grid-cols-1 lg:grid-cols-[minmax(0,380px)_1fr] gap-10 lg:gap-16 items-start">
          <div>
            <span className="eyebrow">Good to know</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 leading-tight">
              What this tool can&apos;t see<span className="text-orange">.</span>
            </h2>
            <p className="text-white/60 mt-5 leading-relaxed">
              An audit of one page is a strong starting point, not the whole picture. Here is where its limits are.
            </p>
          </div>
          <ul className="space-y-4">
            {LIMITATIONS.map((text) => (
              <li key={text} className="flex items-start gap-3 text-sm text-white/80 leading-relaxed">
                <span className="w-5 h-5 rounded-full border border-orange text-orange flex items-center justify-center shrink-0 mt-0.5">
                  <Icon name="check" className="w-3 h-3" strokeWidth={3} />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBanner
        title="Want expert help with your results?"
        highlight="Let's Talk About It."
        subtitle="We can fix the issues this audit finds, improve your site's speed and build the structured data search engines and AI answers rely on."
      />
    </>
  )
}
