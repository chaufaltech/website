import { useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import FaqList from '../components/FaqList.jsx'
import { SITE_URL, breadcrumbSchema } from '../lib/seo.js'
import { trackEvent } from '../lib/analytics.js'
import { copyText } from '../lib/clipboard.js'
import { MAX_PDF_BYTES, PdfPasswordError, buildText, extractPdf, textStats } from '../lib/pdfText.js'

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
const FAQS = [
  {
    q: 'Is the PDF to Text Converter free?',
    a: 'Yes. It is free to use, with no account or sign-up required.',
  },
  {
    q: 'Are my PDFs uploaded to your servers?',
    a: 'No. The conversion runs entirely in your browser, so your PDF never leaves your device. We don\u2019t receive, store or see your files or the text extracted from them.',
  },
  {
    q: 'Can it read scanned PDFs or photos of documents?',
    a: 'No. A scanned PDF is a picture of a page, with no text inside it, so there is nothing to extract. To read it you need OCR (optical character recognition), which this tool doesn\u2019t include. If the converter finds no text, it tells you so.',
  },
  {
    q: 'Will it keep formatting, tables and images?',
    a: 'It extracts plain text only. Images and styling such as fonts and colours are left out. Tables come out as lines of text, and pages with several columns may read in a different order. The \u201CJoin lines into paragraphs\u201D option tidies text that was broken into short lines.',
  },
  {
    q: 'Can I convert a password-protected PDF?',
    a: 'Yes, if you know the password. The tool asks for it, and it is used only inside your browser to open the file. It isn\u2019t sent anywhere.',
  },
  {
    q: 'Is there a file size or page limit?',
    a: 'Each file can be up to 50 MB. There is no page limit, but long documents take longer because pages are read one at a time. You can convert several PDFs in one go.',
  },
]

const TOOL_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'PDF to Text Converter',
  url: `${SITE_URL}/tools/pdf-to-text-converter`,
  description: 'Extract clean, editable text from PDF files in your browser. Nothing is uploaded.',
  applicationCategory: 'UtilitiesApplication',
  operatingSystem: 'Any (web browser)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  publisher: { '@type': 'Organization', name: 'Chaufal Tech', url: `${SITE_URL}/` },
}

const WHAT_YOU_GET = [
  { icon: 'file-text', title: 'Clean, Editable Text', text: 'Plain text you can paste anywhere, with line breaks and paragraphs kept.' },
  { icon: 'shield-check', title: '100% Private', text: 'The conversion happens in your browser. Your PDF is never uploaded.' },
  { icon: 'document', title: 'Page by Page', text: 'See pages, words and characters, with optional page markers in the text.' },
  { icon: 'upload', title: 'Copy or Download', text: 'Copy the text to your clipboard or save it as a .txt file.' },
  { icon: 'cloud-upload', title: 'Several Files at Once', text: 'Drop in a batch of PDFs and they are converted one after another.' },
  { icon: 'shield', title: 'Password-Protected PDFs', text: 'Enter the password and read the file locally, as long as you know it.' },
]

const STEPS = [
  { icon: 'upload', title: 'Add Your PDF', text: 'Drop one or more PDF files into the box, or click to browse.' },
  { icon: 'gear', title: 'Convert in Your Browser', text: 'The text is read page by page on your own device.' },
  { icon: 'file-text', title: 'Copy or Download', text: 'Copy the result, or save it as a plain text file.' },
]

const GOOD_TO_KNOW = [
  'Scanned PDFs (pictures of pages) have no text to extract. They need OCR, which isn\u2019t included.',
  'Images and styling are left out, since the result is plain text.',
  'Tables and multi-column pages can come out in a different order.',
]

const RELATED = [
  {
    icon: 'link',
    tint: 'bg-sky-100 text-sky-600',
    title: 'URL Metadata Extractor',
    description: 'Fetch and analyze metadata from any URL in seconds.',
    to: '/tools/url-metadata-extractor',
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
    icon: 'chart',
    tint: 'bg-indigo-100 text-indigo-600',
    title: 'SEO / GEO Calculator',
    description: 'Audit any page for SEO, accessibility, performance and AI-search readiness.',
    to: '/tools/seo-geo-calculator',
    cta: 'Open Tool',
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
function formatSize(bytes) {
  return bytes > 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

const isPdf = (file) => file.type === 'application/pdf' || /\.pdf$/i.test(file.name)

// pdf.js is loaded only when someone converts a file, so it is not part of the page's
// first download, and it is never loaded while the site is pre-built.
let pdfjsPromise = null
function loadPdfjs() {
  if (!pdfjsPromise) {
    pdfjsPromise = Promise.all([import('pdfjs-dist'), import('pdfjs-dist/build/pdf.worker.min.mjs?url')])
      .then(([pdfjs, worker]) => {
        pdfjs.GlobalWorkerOptions.workerSrc = worker.default
        return pdfjs
      })
      .catch(() => {
        pdfjsPromise = null // allow a retry
        throw new Error('The PDF reader could not be loaded. Check your connection and try again, or update your browser.')
      })
  }
  return pdfjsPromise
}

function downloadText(text, fileName) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000)
}

// ---------------------------------------------------------------------------
// One file
// ---------------------------------------------------------------------------
function FileCard({ item, options, onRemove, onUnlock }) {
  const [password, setPassword] = useState('')
  const [note, setNote] = useState('')
  const text = useMemo(() => (item.pages ? buildText(item.pages, options) : ''), [item.pages, options])
  const stats = useMemo(() => textStats(text), [text])
  const baseName = item.file.name.replace(/\.pdf$/i, '') || 'document'
  const noText = item.status === 'done' && stats.words === 0

  async function handleCopy() {
    setNote((await copyText(text)) ? 'Copied to clipboard.' : 'Copy failed. Use Download instead.')
    window.setTimeout(() => setNote(''), 2500)
  }

  return (
    <li className="border border-black/10 rounded-xl p-4 md:p-5 bg-white">
      <div className="flex items-start gap-3">
        <span className="w-10 h-10 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0" aria-hidden>
          <Icon name="file-text" className="w-5 h-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink truncate" title={item.file.name}>{item.file.name}</p>
          <p className="font-mono text-[11px] text-muted mt-0.5">
            {formatSize(item.file.size)}
            {item.status === 'done' && item.pages ? ` \u00B7 ${item.pages.length} page${item.pages.length === 1 ? '' : 's'}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          aria-label={`Remove ${item.file.name}`}
          className="text-muted hover:text-ink text-xl leading-none shrink-0 px-1"
        >
          &times;
        </button>
      </div>

      <div aria-live="polite">
        {(item.status === 'queued' || item.status === 'working') && (
          <div className="mt-4">
            <p className="text-xs text-muted">
              {item.status === 'queued'
                ? 'Waiting\u2026'
                : item.progress.total
                  ? `Reading page ${item.progress.page} of ${item.progress.total}\u2026`
                  : 'Opening the PDF\u2026'}
            </p>
            <div
              className="h-1.5 bg-black/10 rounded-full overflow-hidden mt-2"
              role="progressbar"
              aria-label={`Converting ${item.file.name}`}
              aria-valuemin={0}
              aria-valuemax={item.progress.total || 1}
              aria-valuenow={item.progress.page}
            >
              <div className="h-full bg-orange transition-all" style={{ width: `${item.progress.total ? (item.progress.page / item.progress.total) * 100 : 5}%` }} />
            </div>
          </div>
        )}

        {item.status === 'error' && (
          <p role="alert" className="text-sm text-red-600 mt-4 leading-relaxed">{item.error}</p>
        )}
      </div>

      {item.status === 'password' && (
        <form
          className="mt-4"
          onSubmit={(e) => {
            e.preventDefault()
            if (password) onUnlock(item.id, password)
          }}
        >
          <label htmlFor={`pw-${item.id}`} className="block text-sm font-medium text-ink/80">
            This PDF is password protected. Enter the password to open it.
          </label>
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <input
              id={`pw-${item.id}`}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              aria-describedby={item.passwordWrong ? `pw-err-${item.id}` : undefined}
              aria-invalid={item.passwordWrong ? true : undefined}
              className="flex-1 min-w-0 border border-black/20 rounded-lg px-4 py-2.5 text-sm focus:border-orange outline-none"
            />
            <button type="submit" disabled={!password} className="btn-primary text-sm py-2.5 px-5 justify-center disabled:opacity-60 disabled:cursor-not-allowed">
              Unlock
            </button>
          </div>
          {item.passwordWrong && (
            <p id={`pw-err-${item.id}`} role="alert" className="text-sm text-red-600 mt-2">That password is incorrect. Try again.</p>
          )}
          <p className="text-xs text-muted mt-2">The password is used only in your browser to open the file.</p>
        </form>
      )}

      {item.status === 'done' && (
        <div className="mt-4">
          {noText ? (
            <p role="note" className="text-sm text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 leading-relaxed">
              <b className="block mb-0.5">No selectable text found</b>
              This PDF is probably a scan or a set of images, so there is no text inside it to extract. This tool
              can&apos;t read images (OCR isn&apos;t included).
            </p>
          ) : (
            <>
              <p className="font-mono text-[11px] text-muted">
                {stats.words.toLocaleString()} words &middot; {stats.characters.toLocaleString()} characters
              </p>
              <label htmlFor={`text-${item.id}`} className="sr-only">Extracted text from {item.file.name}</label>
              <textarea
                id={`text-${item.id}`}
                readOnly
                value={text}
                rows={10}
                className="mt-2 w-full border border-black/15 rounded-lg px-4 py-3 text-sm leading-relaxed font-mono text-[13px] text-ink bg-paper focus:border-orange outline-none resize-y"
              />
              <div className="flex flex-wrap items-center gap-3 mt-3">
                <button type="button" onClick={handleCopy} className="btn-primary text-sm py-2.5 px-5">
                  Copy text
                </button>
                <button type="button" onClick={() => downloadText(text, `${baseName}.txt`)} className="btn-outline-light text-sm py-2.5 px-5">
                  Download .txt
                </button>
                <span className="text-xs text-emerald-700" role="status" aria-live="polite">{note}</span>
              </div>
            </>
          )}
        </div>
      )}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function PdfToText() {
  const [files, setFiles] = useState([]) // [{ id, file, status, progress, pages, error, passwordWrong }]
  const [notice, setNotice] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [separators, setSeparators] = useState(true)
  const [join, setJoin] = useState(false)
  const inputRef = useRef(null)
  const dropRef = useRef(null)
  const counter = useRef(0)

  const options = useMemo(() => ({ separators, join }), [separators, join])
  const patch = (id, changes) => setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, ...changes } : f)))

  async function convert(item, password) {
    patch(item.id, { status: 'working', error: '', progress: { page: 0, total: 0 }, passwordWrong: false })
    try {
      const pdfjs = await loadPdfjs()
      const data = new Uint8Array(await item.file.arrayBuffer())
      const pages = await extractPdf(pdfjs, data, {
        password,
        onProgress: (page, total) => patch(item.id, { progress: { page, total } }),
      })
      patch(item.id, { status: 'done', pages })
    } catch (err) {
      if (err instanceof PdfPasswordError) patch(item.id, { status: 'password', passwordWrong: err.incorrect })
      else patch(item.id, { status: 'error', error: err && err.message ? err.message : 'This PDF could not be converted.' })
    }
  }

  async function handleFiles(fileList) {
    const incoming = Array.from(fileList || [])
    if (!incoming.length) return
    const pdfs = incoming.filter(isPdf)
    const tooBig = pdfs.filter((f) => f.size > MAX_PDF_BYTES)
    const valid = pdfs.filter((f) => f.size <= MAX_PDF_BYTES)

    const problems = []
    if (incoming.length > pdfs.length) problems.push('Only PDF files can be converted, so other files were skipped.')
    if (tooBig.length) problems.push(`${tooBig.length} file${tooBig.length > 1 ? 's' : ''} over 50 MB skipped.`)
    setNotice(problems.join(' '))
    if (!valid.length) return

    trackEvent('pdf_to_text_convert', { files: valid.length })
    const items = valid.map((file) => {
      counter.current += 1
      return { id: `pdf-${counter.current}`, file, status: 'queued', progress: { page: 0, total: 0 }, pages: null, error: '', passwordWrong: false }
    })
    setFiles((prev) => [...prev, ...items])
    for (const item of items) {
      // One at a time keeps memory use and the page's responsiveness in check.
      // eslint-disable-next-line no-await-in-loop
      await convert(item)
    }
  }

  function removeFile(id) {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  function unlock(id, password) {
    const item = files.find((f) => f.id === id)
    if (item) convert(item, password)
  }

  function goToTool() {
    document.getElementById('converter')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.setTimeout(() => dropRef.current?.focus({ preventScroll: true }), 400)
  }

  return (
    <>
      <Seo
        title="Free PDF to Text Converter | Chaufal Tech"
        description="Convert PDF to text online for free. Extract clean, editable text from PDF files in your browser. Nothing is uploaded and no sign-up is needed."
        path="/tools/pdf-to-text-converter"
        jsonLd={[
          TOOL_SCHEMA,
          breadcrumbSchema([
            { name: 'Home', path: '/' },
            { name: 'Tools', path: '/tools' },
            { name: 'PDF to Text Converter', path: '/tools/pdf-to-text-converter' },
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
        <div className="absolute inset-0 bg-blueprint [mask-image:linear-gradient(to_right,transparent,black)]" aria-hidden />
        <div className="section pt-36 pb-16 lg:pt-44 lg:pb-20 relative">
          <Link to="/tools" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-orange transition-colors mb-6">
            <Icon name="chevron" className="w-4 h-4 rotate-180" strokeWidth={2} />
            Back to Tools
          </Link>
          <div>
            <span className="eyebrow">Free Tool</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mt-4 max-w-2xl">PDF to Text Converter</h1>
          <p className="text-white/70 mt-5 max-w-xl leading-relaxed">
            Extract clean, editable text from PDF files with ease. The conversion runs in your browser, so your
            files are never uploaded.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2 mt-7 text-xs text-white/80">
            {['Private by design', 'Works in your browser', 'Copy or download', 'Free to use'].map((t) => (
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
      <section id="converter" className="bg-cream/40 py-12 lg:py-14 scroll-mt-20">
        <div className="section max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-black/5 p-6 md:p-10">
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-6">
              <Icon name="shield-check" className="w-4 h-4 shrink-0" strokeWidth={2} />
              Processed in your browser. Your PDFs are never uploaded.
            </div>

            <div
              ref={dropRef}
              role="button"
              tabIndex={0}
              aria-label="Add PDF files. Drop files here or press Enter to browse."
              onClick={() => inputRef.current?.click()}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  inputRef.current?.click()
                }
              }}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(true)
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault()
                setDragOver(false)
                handleFiles(e.dataTransfer.files)
              }}
              className={`border-2 border-dashed rounded-xl px-6 py-12 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-orange bg-orange/10' : 'border-orange/40 bg-orange/5 hover:bg-orange/10'
              }`}
            >
              <Icon name="cloud-upload" className="w-9 h-9 text-ink mx-auto mb-3" strokeWidth={1.5} />
              <p className="font-semibold text-ink text-sm">Drop PDF files here</p>
              <p className="text-xs text-muted mt-1">or click to browse</p>
              <p className="text-xs text-muted mt-3">PDF files only, up to 50 MB each</p>
              <input
                ref={inputRef}
                type="file"
                accept="application/pdf,.pdf"
                multiple
                hidden
                onChange={(e) => {
                  handleFiles(e.target.files)
                  e.target.value = ''
                }}
              />
            </div>

            {notice && <p role="status" className="text-xs text-red-600 mt-3">{notice}</p>}

            <fieldset className="mt-6 space-y-2.5">
              <legend className="font-mono text-[11px] uppercase tracking-wider text-muted mb-2">Options</legend>
              <label className="flex items-center gap-2.5 text-sm text-ink/80 cursor-pointer">
                <input type="checkbox" checked={separators} onChange={(e) => setSeparators(e.target.checked)} className="accent-navy" />
                Mark where each page starts (&ldquo;--- Page 2 ---&rdquo;)
              </label>
              <label className="flex items-center gap-2.5 text-sm text-ink/80 cursor-pointer">
                <input type="checkbox" checked={join} onChange={(e) => setJoin(e.target.checked)} className="accent-navy" />
                Join lines into paragraphs
              </label>
            </fieldset>

            {files.length > 0 && (
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-ink text-sm">Your files ({files.length})</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setFiles([])
                      setNotice('')
                    }}
                    className="text-xs font-medium text-sky-700 underline underline-offset-2 hover:text-orange"
                  >
                    Clear all
                  </button>
                </div>
                <ul className="mt-4 space-y-4">
                  {files.map((item) => (
                    <FileCard key={item.id} item={item} options={options} onRemove={removeFile} onUnlock={unlock} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="section py-14 lg:py-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="eyebrow justify-center">What you&apos;ll get</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink">Simple, Private PDF Text Extraction</h2>
          <p className="text-muted mt-4 leading-relaxed">
            Turn a PDF into text you can search, edit and reuse, without installing anything or sending your files
            to anyone.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
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
            <h2 className="font-display font-bold text-2xl md:text-3xl text-ink mt-3 leading-tight">Get Your Text in 3 Simple Steps</h2>
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
                  {i < STEPS.length - 1 && <span className="hidden sm:block absolute top-4 -right-5 text-sky-600" aria-hidden>&rarr;</span>}
                </li>
              ))}
            </ol>
          </div>

          <aside className="bg-white/70 border border-sky-100 rounded-2xl p-6">
            <h3 className="flex items-center gap-2.5 font-display font-bold text-ink text-sm">
              <span className="w-6 h-6 rounded-full bg-sky-600 text-white text-xs font-bold flex items-center justify-center" aria-hidden>i</span>
              Good to know
            </h3>
            <ul className="mt-4 space-y-2.5">
              {GOOD_TO_KNOW.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13px] text-ink/80 leading-snug">
                  <span className="w-4 h-4 rounded-full bg-orange text-ink flex items-center justify-center shrink-0 mt-0.5">
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
        <div className="relative bg-navy text-white rounded-2xl px-6 py-8 md:px-10 flex flex-col md:flex-row md:items-center gap-6 md:gap-8 overflow-hidden">
          <div className="absolute inset-0 bg-blueprint opacity-40 [mask-image:linear-gradient(to_right,transparent,black)]" aria-hidden />
          <span className="relative w-14 h-14 rounded-full bg-white/10 border border-white/15 text-orange flex items-center justify-center shrink-0">
            <Icon name="file-text" className="w-7 h-7" strokeWidth={1.6} />
          </span>
          <div className="relative flex-1">
            <h2 className="font-display font-bold text-xl md:text-2xl">Need text out of a PDF?</h2>
            <p className="text-sm text-white/70 mt-2 leading-relaxed max-w-xl">
              Drop it in and copy the text in seconds. Free, private and no sign-up.
            </p>
          </div>
          <button type="button" onClick={goToTool} className="relative btn-primary shrink-0 self-start md:self-auto">
            Convert a PDF <span aria-hidden>&rarr;</span>
          </button>
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
