import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import FaqList from '../components/FaqList.jsx'
import { SITE_URL, breadcrumbSchema } from '../lib/seo.js'
import { trackEvent } from '../lib/analytics.js'
import { extractMetadata, normalizeUrl } from '../lib/metaExtract.js'

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
const FAQS = [
  {
    q: 'Is this tool free to use?',
    a: 'Yes. The URL Metadata Extractor is free, with no account or sign-up required.',
  },
  {
    q: 'What metadata does it extract?',
    a: 'The title, meta description, canonical URL, robots directives, language, viewport and character set; Open Graph and X (Twitter) card tags; favicons and app icons; hreflang alternates and feeds; JSON-LD structured data; the main headings; the page\u2019s head markup; and response details such as the status code and redirects.',
  },
  {
    q: 'How accurate is the metadata extraction?',
    a: 'It reads the page\u2019s HTML exactly as the server sends it, so what it reports is what crawlers and link previews see. The search and social previews are approximations, because Google and social networks may rewrite titles and snippets, or show a cached image.',
  },
  {
    q: 'Does it work for all websites?',
    a: 'It works for any public page that serves HTML to automated tools. Sites with bot protection or a login can\u2019t be read, and in that case the tool says so. Tags that JavaScript adds after the page loads aren\u2019t seen, because they aren\u2019t in the HTML the server sends.',
  },
  {
    q: 'Can I analyze multiple URLs at once?',
    a: 'It analyzes one URL at a time. Run it again for each page you want to check. To prevent abuse, each connection can run a limited number of checks every few minutes.',
  },
  {
    q: 'How often should I check my metadata?',
    a: 'Check it whenever you publish or redesign a page, change your URLs or templates, or migrate your site, and as a regular check-up, for example monthly or quarterly.',
  },
]

const TOOL_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'URL Metadata Extractor',
  url: `${SITE_URL}/tools/url-metadata-extractor`,
  description:
    'Extract and analyze the metadata of any URL: title, description, canonical, robots, Open Graph, Twitter cards, icons, hreflang and structured data.',
  applicationCategory: 'BusinessApplication',
  operatingSystem: 'Any (web browser)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Chaufal Tech', url: `${SITE_URL}/` },
}

const WHAT_YOU_GET = [
  { icon: 'file-text', title: 'Page Title & Description', text: 'See the exact title and meta description your page is using in search results.' },
  { icon: 'link', title: 'Canonical URL', text: 'Find the canonical URL and avoid duplicate content issues.' },
  { icon: 'globe', title: 'Open Graph Data', text: 'Get OG tags for better sharing on Facebook, LinkedIn and other platforms.' },
  { icon: 'message', title: 'X (Twitter) Cards', text: 'View Twitter card metadata for rich previews and engagement.' },
  { icon: 'image', title: 'Icons & Favicons', text: 'Check favicon, app icons and other image resources.' },
  { icon: 'code', title: 'Structured Data', text: 'View JSON-LD and schema markup, and spot invalid data.' },
  { icon: 'network', title: 'Social Previews', text: 'See how your page looks when shared on social media.' },
  { icon: 'browser', title: 'Raw HTML', text: 'Access the complete meta tags and head section.' },
]

const STEPS = [
  { icon: 'link', title: 'Enter URL', text: 'Paste the webpage URL you want to analyze.' },
  { icon: 'gear', title: 'Extract Metadata', text: 'Our tool fetches and parses the page, collecting all relevant metadata.' },
  { icon: 'file-text', title: 'View Results', text: 'Get a clean, organized report with all the details you need.' },
]

const WHY_POINTS = ['Better search visibility', 'Higher click-through rates', 'Improved social sharing']

const RELATED = [
  {
    icon: 'chart',
    tint: 'bg-indigo-100 text-indigo-600',
    title: 'SEO / GEO Calculator',
    description: 'Audit any page for SEO, accessibility, performance and AI-search readiness.',
    to: '/tools/seo-geo-calculator',
    cta: 'Open Tool',
  },
  {
    icon: 'image',
    tint: 'bg-orange/15 text-orange',
    title: 'Image Optimizer',
    description: 'Compress and resize images for better performance.',
    to: '/tools/image-optimizer',
    cta: 'Open Tool',
  },
  {
    icon: 'document',
    tint: 'bg-sky-100 text-sky-600',
    title: 'How to Optimize Images',
    description: 'A practical guide to formats, compression, responsive images and web performance.',
    to: '/guides/image-optimization',
    cta: 'Read Guide',
  },
  {
    icon: 'briefcase',
    tint: 'bg-emerald-100 text-emerald-600',
    title: 'Our Services',
    description: 'Websites, automation, modernization and consulting for your business.',
    to: '/services',
    cta: 'Explore Services',
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const STATUS = {
  pass: { icon: '\u2713', cls: 'text-emerald-600', label: 'Passed' },
  warn: { icon: '!', cls: 'text-yellow-600', label: 'Needs attention' },
  fail: { icon: '\u2715', cls: 'text-red-600', label: 'Problem' },
}

const isHttp = (u) => /^https?:\/\//i.test(u || '')

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    const area = document.createElement('textarea')
    area.value = text
    area.setAttribute('readonly', '')
    area.style.position = 'fixed'
    area.style.opacity = '0'
    document.body.appendChild(area)
    area.select()
    let ok = false
    try {
      ok = document.execCommand('copy')
    } catch {
      ok = false
    }
    document.body.removeChild(area)
    return ok
  }
}

// Images come from the site being inspected. They're only used as <img>, with no referrer sent.
function RemoteImage({ src, className = '', alt = '' }) {
  const [failed, setFailed] = useState(false)
  if (!isHttp(src) || failed) {
    return (
      <div className={`flex items-center justify-center bg-black/5 text-xs text-muted ${className}`}>
        {src && failed ? 'Image could not be loaded' : 'No image set'}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  )
}

function Panel({ title, badge, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="bg-white border border-black/10 rounded-lg mb-3 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-cream/40 transition-colors"
      >
        <span className="flex items-center gap-3 min-w-0">
          <span className="font-display font-bold text-ink text-[15px]">{title}</span>
          {badge ? <span className="font-mono text-[11px] rounded-full px-2.5 py-0.5 shrink-0 bg-black/5 text-muted">{badge}</span> : null}
        </span>
        <Icon name="chevron" className={`w-4 h-4 text-muted shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} strokeWidth={2} />
      </button>
      {open && <div className="px-5 pb-5 pt-1">{children}</div>}
    </div>
  )
}

function Rows({ rows }) {
  return (
    <dl className="divide-y divide-black/10">
      {rows.map(([label, value, mono]) => (
        <div key={label} className="grid grid-cols-1 sm:grid-cols-[170px_minmax(0,1fr)] gap-x-4 gap-y-1 py-2.5">
          <dt className="font-mono text-[11px] uppercase tracking-wide text-muted pt-0.5">{label}</dt>
          <dd className={`text-sm break-words min-w-0 ${mono ? 'font-mono text-[13px]' : ''} ${value ? 'text-ink' : 'text-muted italic'}`}>
            {value || 'Not set'}
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Empty({ children }) {
  return <p className="text-sm text-muted">{children}</p>
}

// ---------------------------------------------------------------------------
// Previews
// ---------------------------------------------------------------------------
function GooglePreview({ p }) {
  return (
    <div className="bg-white border border-black/10 rounded-xl p-4 max-w-xl">
      <p className="text-xs text-muted break-all">{p.displayUrl}</p>
      <p className="text-[19px] leading-snug text-[#1a0dab] mt-1 break-words">{p.title}</p>
      <p className="text-sm text-ink/70 mt-1 leading-relaxed break-words">{p.description || 'No meta description. Search engines will choose their own text.'}</p>
    </div>
  )
}

function SocialPreview({ title, domain, description, image, large = true, note }) {
  return (
    <div>
      <div className="border border-black/10 rounded-xl overflow-hidden bg-white max-w-md">
        <RemoteImage src={image} className={`w-full ${large ? 'aspect-[1.91/1]' : 'aspect-[16/9]'}`} />
        <div className="px-4 py-3 border-t border-black/10 bg-paper">
          <p className="font-mono text-[10px] uppercase tracking-wide text-muted truncate">{domain}</p>
          <p className="font-semibold text-sm text-ink mt-1 leading-snug break-words">{title || 'No title'}</p>
          <p className="text-xs text-muted mt-1 leading-relaxed line-clamp-2 break-words">{description}</p>
        </div>
      </div>
      {note && <p className="text-xs text-muted mt-2 max-w-md">{note}</p>}
    </div>
  )
}

function HeadHtml({ html, truncated }) {
  const [note, setNote] = useState('')
  async function copy() {
    setNote((await copyText(html)) ? 'Copied.' : 'Copy failed.')
    window.setTimeout(() => setNote(''), 2000)
  }
  if (!html) return <Empty>No &lt;head&gt; markup found.</Empty>
  return (
    <div>
      <p className="text-xs text-muted leading-relaxed">
        The page&apos;s head markup with each tag on its own line. Scripts (other than JSON-LD) and styles are left out.
        {truncated ? ' Very long, so it has been shortened.' : ''}
      </p>
      <pre className="mt-3 max-h-80 overflow-auto bg-paper border border-black/10 rounded-lg p-3 text-[11.5px] leading-relaxed text-ink/80 whitespace-pre" tabIndex={0} aria-label="Raw head HTML">
        <code className="font-mono">{html}</code>
      </pre>
      <div className="mt-3 flex items-center gap-3">
        <button type="button" onClick={copy} className="btn-outline-light text-xs py-2 px-4">Copy HTML</button>
        <span className="text-xs text-emerald-700" role="status" aria-live="polite">{note}</span>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Results
// ---------------------------------------------------------------------------
function Results({ r, reportRef, options = {} }) {
  const [copied, setCopied] = useState('')
  const open = Boolean(options.expandAll)
  const checks = options.issuesOnly ? r.checks.filter((c) => c.status !== 'pass') : r.checks

  async function handleCopy() {
    const ok = await copyText(JSON.stringify(r, null, 2))
    setCopied(ok ? 'Copied to clipboard.' : 'Copy failed. Use Download instead.')
    window.setTimeout(() => setCopied(''), 2500)
  }

  function handleDownload() {
    const blob = new Blob([JSON.stringify(r, null, 2)], { type: 'application/json' })
    const link = document.createElement('a')
    const name = (() => {
      try {
        return new URL(r.url).hostname.replace(/[^a-z0-9.-]/gi, '-')
      } catch {
        return 'page'
      }
    })()
    link.href = URL.createObjectURL(blob)
    link.download = `metadata-${name}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
  }

  const b = r.basic
  const og = r.openGraph
  const tw = r.twitter
  const redirected = r.response.redirects.length > 0

  return (
    <div ref={reportRef} tabIndex={-1} className="outline-none mt-10 pt-8 border-t-[3px] border-double border-ink">
      {/* Summary */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">
        <div className="min-w-0">
          <h2 className="font-display font-bold text-xl text-ink leading-snug break-words">{b.title || r.url}</h2>
          <p className="font-mono text-[11px] text-muted mt-2 break-all">{r.url}</p>
          <p className="font-mono text-[11px] text-muted mt-1">
            Read {new Date(r.fetchedAt).toLocaleString()} &middot; HTTP {r.response.status}
            {r.response.contentType ? ` \u00B7 ${r.response.contentType.split(';')[0]}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button type="button" onClick={handleCopy} className="btn-outline-light text-sm py-2.5 px-5">
            Copy JSON
          </button>
          <button type="button" onClick={handleDownload} className="btn-outline-light text-sm py-2.5 px-5">
            Download JSON
          </button>
        </div>
      </div>
      <p className="text-xs text-emerald-700 mt-3 min-h-[1rem]" role="status" aria-live="polite">{copied}</p>

      {r.accessDenied && (
        <div role="note" className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3.5 text-sm leading-relaxed">
          <b className="block mb-1">This site denied access to our server</b>
          The site&apos;s bot protection blocked our automated request and returned an &ldquo;access denied&rdquo; or
          bot-check page. The metadata below belongs to <em>that page</em>, not the site&apos;s real page, so
          don&apos;t rely on it.
        </div>
      )}
      {r.truncated && (
        <p className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 mt-4 leading-relaxed">
          This page is very large, so only the first part of it was read. Some tags near the end may be missing.
        </p>
      )}
      {redirected && (
        <p className="text-xs text-sky-800 bg-sky-50 border border-sky-100 rounded-lg px-4 py-3 mt-4 leading-relaxed break-words">
          The address you entered redirected {r.response.redirects.length} time{r.response.redirects.length > 1 ? 's' : ''}.
          The metadata below is from the final page: <span className="font-mono">{r.url}</span>
        </p>
      )}

      {/* Analysis */}
      <h3 className="font-mono text-sm uppercase tracking-wider text-ink border-b border-ink pb-2 mt-10 mb-5">
        Analysis &middot; {r.summary.pass} passed &middot; {r.summary.warn} to review &middot; {r.summary.fail} problem{r.summary.fail === 1 ? '' : 's'}
      </h3>
      <div>
        {checks.length === 0 && <p className="text-sm text-emerald-700 py-2">Everything passed. There is nothing to fix.</p>}
        {checks.map((c) => {
          const st = STATUS[c.status]
          return (
            <div key={c.id} className="py-3.5 border-b border-black/10 last:border-b-0">
              <div className="flex items-baseline gap-2">
                <span className={`font-mono text-sm w-4 shrink-0 ${st.cls}`} aria-label={st.label}>{st.icon}</span>
                <span className="font-semibold text-ink text-sm">{c.label}</span>
              </div>
              <p className="text-[13.5px] text-muted mt-1 ml-6 leading-relaxed break-words">{c.detail}</p>
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

      {/* Details */}
      <h3 className="font-mono text-sm uppercase tracking-wider text-ink border-b border-ink pb-2 mt-10 mb-5">Extracted metadata</h3>

      <Panel title="Basic tags" defaultOpen>
        <Rows
          rows={[
            ['Title', b.title],
            ['Description', b.description],
            ['Canonical', b.canonical, true],
            ['Meta robots', b.robots],
            ['X-Robots-Tag', b.xRobotsTag],
            ['Language', b.language],
            ['Charset', b.charset],
            ['Viewport', b.viewport, true],
            ['Theme colour', b.themeColor],
            ['Author', b.author],
            ['Keywords', b.keywords],
            ['Generator', b.generator],
          ]}
        />
      </Panel>

      <Panel title="Previews" defaultOpen>
        <div className="space-y-8">
          <div>
            <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted mb-3">Google search result</h4>
            <GooglePreview p={r.previews.google} />
            <p className="text-xs text-muted mt-2 max-w-xl">An approximation. Google decides the final title and snippet.</p>
          </div>
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted mb-3">Facebook / LinkedIn / WhatsApp</h4>
              <SocialPreview
                {...r.previews.facebook}
                note={r.previews.facebook.usesFallback ? 'Some Open Graph tags are missing, so the page title and description are used instead.' : ''}
              />
            </div>
            <div>
              <h4 className="font-mono text-[11px] uppercase tracking-wider text-muted mb-3">X (Twitter){r.previews.x.card ? ` \u00B7 ${r.previews.x.card}` : ''}</h4>
              <SocialPreview
                {...r.previews.x}
                large={r.previews.x.card !== 'summary'}
                note={r.previews.x.usesFallback ? 'Some X card tags are missing, so Open Graph or page values are used instead.' : ''}
              />
            </div>
          </div>
        </div>
      </Panel>

      <Panel title="Open Graph" defaultOpen={open} badge={`${og.list.length} tag${og.list.length === 1 ? '' : 's'}`}>
        {og.list.length ? <Rows rows={og.list.map((m) => [m.property, m.content, true])} /> : <Empty>No Open Graph tags found.</Empty>}
      </Panel>

      <Panel title="X / Twitter card" defaultOpen={open} badge={`${tw.list.length} tag${tw.list.length === 1 ? '' : 's'}`}>
        {tw.list.length ? <Rows rows={tw.list.map((m) => [m.name, m.content, true])} /> : <Empty>No twitter: tags found.</Empty>}
      </Panel>

      <Panel title="Icons" defaultOpen={open} badge={String(r.icons.length)}>
        {r.icons.length ? (
          <ul className="divide-y divide-black/10">
            {r.icons.map((icon) => (
              <li key={`${icon.rel}-${icon.href}-${icon.sizes}`} className="flex items-center gap-4 py-3">
                {/icon/i.test(icon.rel) && !/mask/i.test(icon.rel) ? (
                  <RemoteImage src={icon.href} className="w-8 h-8 rounded shrink-0" />
                ) : (
                  <span className="w-8 h-8 rounded bg-black/5 shrink-0" aria-hidden />
                )}
                <div className="min-w-0">
                  <p className="font-mono text-[11px] uppercase tracking-wide text-muted">
                    {icon.rel}
                    {icon.sizes ? ` \u00B7 ${icon.sizes}` : ''}
                    {icon.type ? ` \u00B7 ${icon.type}` : ''}
                  </p>
                  <p className="font-mono text-[13px] text-ink break-all">{icon.href}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <Empty>No icon links found. Browsers will look for /favicon.ico.</Empty>
        )}
      </Panel>

      <Panel title="Alternates, feeds & related links" defaultOpen={open} badge={String(r.alternates.length + r.feeds.length + r.related.length)}>
        {r.alternates.length + r.feeds.length + r.related.length === 0 ? (
          <Empty>No hreflang, feed or related links found.</Empty>
        ) : (
          <Rows
            rows={[
              ...r.alternates.map((a) => [`hreflang: ${a.hreflang}`, a.href, true]),
              ...r.feeds.map((f) => [f.title ? `Feed: ${f.title}` : 'Feed', f.href, true]),
              ...r.related.map((l) => [l.rel, l.href, true]),
            ]}
          />
        )}
      </Panel>

      <Panel title="Structured data (JSON-LD)" defaultOpen={open} badge={String(r.structuredData.length)}>
        {r.structuredData.length === 0 ? (
          <Empty>No JSON-LD structured data found.</Empty>
        ) : (
          <div className="space-y-5">
            {r.structuredData.map((block, i) => (
              <div key={i}>
                <p className="text-sm font-semibold text-ink">
                  Block {i + 1}
                  <span className={`ml-2 font-mono text-[10px] uppercase tracking-wider rounded-full px-2 py-0.5 align-middle ${block.valid ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                    {block.valid ? 'valid JSON' : 'invalid JSON'}
                  </span>
                </p>
                {block.valid ? (
                  <p className="text-xs text-muted mt-1">Types: {block.types.length ? block.types.join(', ') : 'none declared'}</p>
                ) : (
                  <p className="text-xs text-red-600 mt-1 break-words">{block.error}</p>
                )}
                <pre className="mt-2 max-h-72 overflow-auto bg-paper border border-black/10 rounded-lg p-3 text-[11.5px] leading-relaxed text-ink/80" tabIndex={0} aria-label={`JSON-LD block ${i + 1}`}>
                  <code className="font-mono">{block.valid ? JSON.stringify(block.data, null, 2) : block.raw}</code>
                </pre>
              </div>
            ))}
          </div>
        )}
      </Panel>

      <Panel title="Headings" defaultOpen={open} badge={`H1 \u00D7 ${r.headings.counts.h1}`}>
        <Rows
          rows={[
            ['H1', r.headings.h1.join(' | ')],
            ['Count', `${r.headings.counts.h1} H1 \u00B7 ${r.headings.counts.h2} H2 \u00B7 ${r.headings.counts.h3} H3`],
          ]}
        />
      </Panel>

      {typeof r.headHtml === 'string' && (
        <Panel title="Raw head HTML" defaultOpen={open} badge={`${r.headHtml ? r.headHtml.split('\n').length : 0} lines`}>
          <HeadHtml html={r.headHtml} truncated={Boolean(r.headHtmlTruncated)} />
        </Panel>
      )}

      <Panel title="All meta tags" defaultOpen={open} badge={String(r.allMeta.length)}>
        {r.allMeta.length ? <Rows rows={r.allMeta.map((m) => [m.key, m.content, true])} /> : <Empty>No meta tags found.</Empty>}
      </Panel>

      <Panel title="Response" defaultOpen={open}>
        <Rows
          rows={[
            ['Requested URL', r.inputUrl, true],
            ['Final URL', r.url, true],
            ['Status', `${r.response.status} ${r.response.statusText}`.trim()],
            ['Content type', r.response.contentType],
            ...r.response.redirects.map((h, i) => [`Redirect ${i + 1}`, `${h.status} \u2192 ${h.url}`, true]),
          ]}
        />
      </Panel>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function UrlMetadataExtractor() {
  const [url, setUrl] = useState('')
  const [status, setStatus] = useState('idle') // idle | running | done | error
  const [progress, setProgress] = useState('')
  const [error, setError] = useState('')
  const [result, setResult] = useState(null)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [issuesOnly, setIssuesOnly] = useState(false)
  const [expandAll, setExpandAll] = useState(false)
  const resultRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    if (status === 'done' && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
      resultRef.current.focus({ preventScroll: true })
    }
  }, [status])

  function goToTool() {
    document.getElementById('extractor')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => inputRef.current?.focus({ preventScroll: true }), 400)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (status === 'running') return

    const normalized = normalizeUrl(url)
    if (!normalized) {
      setError('Enter a valid web address, e.g. example.com/pricing')
      setStatus('error')
      inputRef.current?.focus()
      return
    }

    setError('')
    setResult(null)
    setProgress('Fetching page\u2026')
    setStatus('running')
    trackEvent('url_metadata_extract_run')

    try {
      setResult(await extractMetadata(normalized, { onProgress: setProgress }))
      setStatus('done')
    } catch (err) {
      setError(err && err.message ? err.message : 'The page could not be read. Please check the address and try again.')
      setStatus('error')
    }
  }

  const running = status === 'running'

  return (
    <>
      <Seo
        title="Free URL Metadata Extractor | Chaufal Tech"
        description="Extract and analyze the metadata of any URL: title, description, canonical, Open Graph, X cards, icons, hreflang and structured data. Free, no sign-up."
        path="/tools/url-metadata-extractor"
        image="/images/url-metadata-extractor-og.jpg"
        jsonLd={[
          TOOL_SCHEMA,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Work', path: '/work' },
            { name: 'URL Metadata Extractor', path: '/tools/url-metadata-extractor' },
          ]),
          {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQS.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          },
        ]}
      />

      {/* HERO */}
      <section className="bg-navy text-white overflow-hidden relative">
        <div className="section pt-36 pb-6 lg:pt-44 lg:pb-24 relative z-10">
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
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mt-4 max-w-md">
            URL Metadata Extractor
          </h1>
          <p className="text-white/75 mt-5 max-w-md leading-relaxed">
            Get instant SEO insights from any webpage. Extract and analyze title, description, canonical URL, Open
            Graph data, X cards, icons and structured data &mdash; all in one place.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-7 text-xs text-white/80">
            {['Fast & Accurate', 'SEO Friendly', 'No Installation', 'Free to Use'].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full border border-orange text-orange flex items-center justify-center">
                  <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3.5} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>

        {/* The artwork is its own layer (not a CSS background) so it sits to the right of
            the text instead of behind it. It stacks below the text on small screens and
            fades into the navy at its edges. */}
        <img
          src="/images/url-metadata-extractor-hero-bg.webp"
          alt=""
          aria-hidden="true"
          width="1920"
          height="714"
          fetchPriority="high"
          className="block w-full h-auto pointer-events-none select-none lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[82%] lg:max-w-none xl:w-[75%]"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, #000 28%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, #000 28%), linear-gradient(to bottom, transparent 0%, #000 12%, #000 88%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
            maskComposite: 'intersect',
          }}
        />
      </section>

      {/* TOOL */}
      <section id="extractor" className="bg-cream/40 py-12 lg:py-14 scroll-mt-20">
        <div className="section">
          <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-6 md:p-8">
            <form onSubmit={handleSubmit} noValidate className="flex items-start gap-4">
              <span className="hidden sm:flex w-10 h-10 rounded-full bg-sky-50 text-sky-700 items-center justify-center shrink-0 mt-6" aria-hidden>
                <Icon name="globe" className="w-5 h-5" />
              </span>
              <div className="flex-1 min-w-0">
                <label htmlFor="meta-url" className="block font-mono text-[11px] uppercase tracking-wider text-muted mb-2">
                  Enter URL to analyze
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    ref={inputRef}
                    id="meta-url"
                    type="text"
                    inputMode="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://example.com/page"
                    autoComplete="off"
                    spellCheck="false"
                    aria-describedby={status === 'error' ? 'meta-error' : undefined}
                    aria-invalid={status === 'error' && !result ? true : undefined}
                    className="flex-1 min-w-0 border border-black/20 rounded-lg px-4 py-3.5 font-mono text-sm focus:border-orange outline-none"
                  />
                  <button type="submit" disabled={running} className="btn-primary justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                    {running ? 'Reading\u2026' : <>Extract Metadata <span aria-hidden>&rarr;</span></>}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAdvanced((v) => !v)}
                  aria-expanded={showAdvanced}
                  aria-controls="meta-advanced"
                  className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium text-sky-700 hover:text-orange transition-colors"
                >
                  <span aria-hidden>{showAdvanced ? '\u2212' : '+'}</span> Advanced options (optional)
                  <Icon name="chevron" className={`w-3 h-3 transition-transform ${showAdvanced ? '-rotate-90' : 'rotate-90'}`} strokeWidth={2.5} />
                </button>
                {showAdvanced && (
                  <fieldset id="meta-advanced" className="mt-3 space-y-2.5">
                    <legend className="sr-only">Display options</legend>
                    <label className="flex items-center gap-2.5 text-sm text-ink/80 cursor-pointer">
                      <input type="checkbox" checked={issuesOnly} onChange={(e) => setIssuesOnly(e.target.checked)} className="accent-navy" />
                      Show only items that need attention in the analysis
                    </label>
                    <label className="flex items-center gap-2.5 text-sm text-ink/80 cursor-pointer">
                      <input type="checkbox" checked={expandAll} onChange={(e) => setExpandAll(e.target.checked)} className="accent-navy" />
                      Expand all sections of the results
                    </label>
                  </fieldset>
                )}
              </div>
            </form>

            <div aria-live="polite" className="mt-5">
              {status === 'error' && (
                <p id="meta-error" role="alert" className="text-sm text-red-600 leading-relaxed">
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

            <p className="mt-5 flex items-start gap-3 bg-sky-50 border border-sky-100 rounded-lg px-4 py-3 text-xs text-sky-800 leading-relaxed">
              <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-px" aria-hidden>i</span>
              <span>
                Paste any public URL and we&apos;ll fetch and analyze the page&apos;s metadata, Open Graph tags, Twitter
                cards, structured data and more. Our server fetches the page for you (websites can&apos;t be read
                directly from a browser) and we don&apos;t store the page or the results.
              </span>
            </p>

            {status === 'done' && result && (
              <Results key={`${result.fetchedAt}-${expandAll}-${issuesOnly}`} r={result} reportRef={resultRef} options={{ issuesOnly, expandAll }} />
            )}
          </div>
        </div>
      </section>

      {/* WHAT YOU'LL GET */}
      <section className="section py-14 lg:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">What you&apos;ll get</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">Complete Metadata, All in One Place</h2>
          <p className="text-muted mt-4 leading-relaxed">
            No more manual checks or guesswork. Get detailed metadata and SEO insights in seconds, so you can optimize
            your content and improve search visibility.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
          {WHAT_YOU_GET.map((c) => (
            <div key={c.title} className="bg-white border border-black/5 rounded-xl2 p-6 shadow-sm">
              <span className="w-11 h-11 rounded-full bg-sky-50 text-sky-700 flex items-center justify-center">
                <Icon name={c.icon} className="w-5 h-5" />
              </span>
              <h3 className="font-display font-bold text-ink text-[15px] mt-4">{c.title}</h3>
              <p className="text-sm text-muted mt-2 leading-relaxed">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section pb-10 lg:pb-12">
        <div className="bg-sky-50 border border-sky-100 rounded-2xl p-6 md:p-8 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 lg:gap-12 items-start">
          <div>
            <span className="eyebrow">How it works</span>
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink mt-3 leading-tight">Get Results in 3 Simple Steps</h2>
            <ol className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 mt-8">
              {STEPS.map((step, i) => (
                <li key={step.title} className="relative flex sm:block gap-4">
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="w-7 h-7 rounded-full bg-orange text-ink text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                    <span className="w-11 h-11 rounded-full bg-white text-sky-700 flex items-center justify-center shrink-0 shadow-sm">
                      <Icon name={step.icon} className="w-5 h-5" />
                    </span>
                  </div>
                  <div className="sm:mt-4">
                    <h3 className="font-display font-bold text-ink text-[15px]">{step.title}</h3>
                    <p className="text-sm text-muted mt-1.5 leading-relaxed">{step.text}</p>
                  </div>
                  {i < STEPS.length - 1 && (
                    <span className="hidden sm:block absolute top-4 -right-5 text-sky-600" aria-hidden>&rarr;</span>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <aside className="bg-white/70 border border-sky-100 rounded-2xl p-6">
            <h3 className="flex items-center gap-2.5 font-display font-bold text-ink text-sm">
              <span className="text-orange" aria-hidden><Icon name="bulb" className="w-5 h-5" strokeWidth={2} /></span>
              Why it matters for SEO
            </h3>
            <p className="text-xs text-muted mt-3 leading-relaxed">
              Correct metadata helps search engines understand your content, improves click-through rates, and enhances
              social sharing and rich previews.
            </p>
            <ul className="mt-4 space-y-2.5">
              {WHY_POINTS.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-[13px] text-ink/80">
                  <span className="w-4 h-4 rounded-full bg-orange text-ink flex items-center justify-center shrink-0">
                    <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* CTA */}
      <section className="section pb-12 lg:pb-14">
        <div className="relative bg-navy text-white rounded-2xl px-6 py-8 md:px-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-8 overflow-hidden">
          <div className="absolute inset-0 bg-blueprint opacity-40 [mask-image:linear-gradient(to_right,transparent,black)]" aria-hidden />
          <span className="relative w-16 h-16 rounded-full border-2 border-white/80 text-orange flex items-center justify-center shrink-0">
            <Icon name="target" className="w-8 h-8" strokeWidth={1.6} />
          </span>
          <div className="relative lg:w-[300px] shrink-0">
            <h2 className="font-display font-bold text-lg leading-snug">Get the most from your metadata.</h2>
            <p className="font-display font-bold text-xl text-orange leading-snug">Use the tool. Improve your SEO.</p>
          </div>
          <p className="relative flex-1 text-sm text-white/70 leading-relaxed lg:border-l lg:border-white/15 lg:pl-8">
            Analyze your competitor&apos;s pages, check what&apos;s missing, and make your content stand out in search
            results.
          </p>
          <div className="relative flex flex-col items-start lg:items-center gap-3 shrink-0">
            <button type="button" onClick={goToTool} className="btn-primary">
              Try It Now <span aria-hidden>&rarr;</span>
            </button>
            <p className="flex items-center gap-2 text-xs text-white/70">
              <span className="w-4 h-4 rounded-full border border-orange text-orange flex items-center justify-center shrink-0">
                <Icon name="check" className="w-2.5 h-2.5" strokeWidth={3.5} />
              </span>
              No registration required. Free to use.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section pb-14 lg:pb-16">
        <span className="eyebrow">Frequently asked questions</span>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-ink mt-3">Quick Answers</h2>
        <FaqList
          items={FAQS.map((f) => ({ q: f.q, a: f.a }))}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-3 mt-6 items-start"
          itemClassName="shadow-sm"
        />
      </section>

      {/* RELATED */}
      <section className="section pb-20">
        <h2 className="font-display font-bold text-2xl text-ink">Related Tools &amp; Resources</h2>
        <p className="text-sm text-muted mt-1">Explore more tools to help you build a faster, smarter and better website.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {RELATED.map((rel) => (
            <Link
              key={rel.title}
              to={rel.to}
              className="flex flex-col bg-white border border-black/5 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${rel.tint}`}>
                  <Icon name={rel.icon} className="w-[18px] h-[18px]" />
                </span>
                <span className="font-display font-bold text-ink text-sm">{rel.title}</span>
              </span>
              <span className="text-xs text-muted mt-3 leading-relaxed flex-1">{rel.description}</span>
              <span className="inline-flex items-center gap-1.5 text-sky-600 text-xs font-semibold mt-4">
                {rel.cta} <span aria-hidden>&rarr;</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}