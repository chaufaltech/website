import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'

// Processing runs entirely in the browser (canvas + toBlob). Re-encoding
// through canvas also drops EXIF data (GPS, camera info, etc.), so metadata
// removal is always on. "Target file size" mode steps quality down until the
// result fits (or quality bottoms out).

const MAX_FILE_BYTES = 50 * 1024 * 1024

const EXTENSIONS = {
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/png': 'png',
  'image/avif': 'avif',
}

const WHY_FEATURES = [
  { icon: 'shield-check', title: 'Private by Design', description: 'Your images are processed locally in your browser.' },
  { icon: 'rocket', title: 'Fast & Simple', description: 'No account or complicated settings required.' },
  { icon: 'image', title: 'Batch Optimization', description: 'Optimize multiple images in one session.' },
  { icon: 'globe', title: 'Built for the Web', description: 'Resize and compress images before using them on your website.' },
]

const GUIDE_STEPS = [
  { title: 'Choose the right dimensions', description: "Don't upload a 4000px image when your website only displays it at 1200px." },
  { title: 'Pick the right format', description: 'JPEG, PNG, WebP or AVIF — each has its strengths.' },
  { title: 'Compress without losing quality', description: 'Reduce file size while keeping your images sharp.' },
  { title: 'Keep the aspect ratio', description: 'Avoid distortion and maintain a professional look.' },
  { title: 'Remove unnecessary metadata', description: 'Get rid of EXIF data to improve privacy and performance.' },
]

const FORMAT_ROWS = [
  { format: 'JPG', bestFor: 'Photographs', benefit: 'Small file size' },
  { format: 'PNG', bestFor: 'Transparency & graphics', benefit: 'High quality' },
  { format: 'WebP', bestFor: 'Web use', benefit: 'Better compression' },
  { format: 'AVIF', bestFor: 'Modern browsers', benefit: 'Highest compression' },
]

const MORE_TOOLS = [
  {
    icon: 'chart',
    title: 'SEO / GEO Calculator',
    description: "Analyze, optimize and track your content's visibility — across search engines and AI platforms.",
    tint: 'bg-indigo-100 text-indigo-600',
  },
  {
    icon: 'check-circle',
    title: 'QA Automation Tool',
    description: 'Simplify testing, improve reliability, and ship with confidence.',
    tint: 'bg-emerald-100 text-emerald-600',
  },
]

function formatSize(bytes) {
  return bytes > 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(2)} MB`
    : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

function canEncode(mime) {
  try {
    return document.createElement('canvas').toDataURL(mime).startsWith(`data:${mime}`)
  } catch {
    return false
  }
}

// Work out the output size from the resize settings.
function targetSize(img, resizeMode, width, height, maintainRatio) {
  const nw = img.naturalWidth
  const nh = img.naturalHeight
  if (resizeMode === 'original' || (!width && !height)) return { w: nw, h: nh }

  if (width && height) {
    if (!maintainRatio) return { w: width, h: height }
    // Fit inside the width x height box without distorting.
    const scale = Math.min(width / nw, height / nh)
    return { w: Math.max(1, Math.round(nw * scale)), h: Math.max(1, Math.round(nh * scale)) }
  }
  if (width) {
    return { w: width, h: maintainRatio ? Math.max(1, Math.round(width * (nh / nw))) : nh }
  }
  return { w: maintainRatio ? Math.max(1, Math.round(height * (nw / nh))) : nw, h: height }
}

async function processImage(img, { w, h }, format, mode, quality, targetKB) {
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')

  // JPEG has no transparency; fill white so transparent areas don't turn black.
  if (format === 'image/jpeg') {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, h)
  }
  ctx.drawImage(img, 0, 0, w, h)

  const getBlob = (q) => new Promise((resolve) => canvas.toBlob(resolve, format, q))

  if (format === 'image/png') return getBlob()
  if (mode === 'quality') return getBlob(quality / 100)

  let q = 0.95
  let blob = await getBlob(q)
  while (blob && blob.size / 1024 > targetKB && q > 0.1) {
    q -= 0.05
    blob = await getBlob(q)
  }
  return blob
}

function downloadBlob(url, filename) {
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

export default function ImageOptimizer() {
  const [files, setFiles] = useState([]) // [{id, file, img, url}]
  const [results, setResults] = useState({}) // id -> { url, bytes, w, h, format }
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [notice, setNotice] = useState('')

  const [resizeMode, setResizeMode] = useState('original') // original | custom
  const [width, setWidth] = useState('')
  const [height, setHeight] = useState('')
  const [maintainRatio, setMaintainRatio] = useState(true)
  const [format, setFormat] = useState('auto')
  const [compression, setCompression] = useState('quality') // quality | size
  const [quality, setQuality] = useState(80)
  const [targetKB, setTargetKB] = useState('200')

  const fileInputRef = useRef(null)
  const filesRef = useRef([])
  const resultsRef = useRef({})
  filesRef.current = files
  resultsRef.current = results

  const avifSupported = useMemo(() => canEncode('image/avif'), [])

  // Release every object URL when leaving the page.
  useEffect(() => {
    return () => {
      filesRef.current.forEach((item) => URL.revokeObjectURL(item.url))
      Object.values(resultsRef.current).forEach((r) => r?.url && URL.revokeObjectURL(r.url))
    }
  }, [])

  // Optimized results no longer match once the settings change, so clear them.
  useEffect(() => {
    clearResults()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resizeMode, width, height, maintainRatio, format, compression, quality, targetKB])

  function clearResults() {
    Object.values(resultsRef.current).forEach((r) => r?.url && URL.revokeObjectURL(r.url))
    setResults({})
  }

  function handleFiles(fileList) {
    const incoming = Array.from(fileList || [])
    const images = incoming.filter((f) => f.type.startsWith('image/'))
    const tooBig = images.filter((f) => f.size > MAX_FILE_BYTES)
    const valid = images.filter((f) => f.size <= MAX_FILE_BYTES)

    const problems = []
    if (incoming.length > images.length) problems.push('Some files were skipped because they are not images.')
    if (tooBig.length) problems.push(`${tooBig.length} file${tooBig.length > 1 ? 's' : ''} over 50 MB skipped.`)
    setNotice(problems.join(' '))
    if (!valid.length) return

    setLoading(true)
    Promise.all(
      valid.map(
        (file, index) =>
          new Promise((resolve) => {
            const url = URL.createObjectURL(file)
            const img = new Image()
            img.onload = () => resolve({ id: `${Date.now()}-${index}-${file.name}`, file, img, url })
            img.onerror = () => {
              URL.revokeObjectURL(url)
              resolve(null)
            }
            img.src = url
          })
      )
    ).then((loaded) => {
      const ok = loaded.filter(Boolean)
      if (ok.length < valid.length) {
        setNotice((n) => `${n} ${valid.length - ok.length} image(s) could not be read.`.trim())
      }
      clearResults()
      setFiles((prev) => [...prev, ...ok])
      setLoading(false)
    })
  }

  function removeFile(id) {
    const item = files.find((f) => f.id === id)
    if (item) URL.revokeObjectURL(item.url)
    const r = results[id]
    if (r?.url) URL.revokeObjectURL(r.url)
    setFiles((prev) => prev.filter((f) => f.id !== id))
    setResults((prev) => {
      const { [id]: _removed, ...rest } = prev
      return rest
    })
  }

  function clearAll() {
    files.forEach((item) => URL.revokeObjectURL(item.url))
    clearResults()
    setFiles([])
    setNotice('')
  }

  async function handleOptimize() {
    if (!files.length || processing) return
    setProcessing(true)
    clearResults()

    const w = resizeMode === 'custom' && width && parseInt(width, 10) > 0 ? parseInt(width, 10) : null
    const h = resizeMode === 'custom' && height && parseInt(height, 10) > 0 ? parseInt(height, 10) : null
    const kb = targetKB && parseInt(targetKB, 10) >= 1 ? parseInt(targetKB, 10) : 1
    const outFormat = format === 'auto' ? 'image/webp' : format

    for (const item of files) {
      const size = targetSize(item.img, resizeMode, w, h, maintainRatio)
      const blob = await processImage(item.img, size, outFormat, compression, quality, kb)
      if (!blob) continue
      setResults((prev) => ({
        ...prev,
        [item.id]: { url: URL.createObjectURL(blob), bytes: blob.size, w: size.w, h: size.h, format: outFormat },
      }))
    }
    setProcessing(false)
  }

  function nameFor(item, result) {
    const base = item.file.name.replace(/\.[^.]+$/, '') || 'image'
    return `${base}_opt.${EXTENSIONS[result.format]}`
  }

  function downloadOne(item) {
    const result = results[item.id]
    if (result?.url) downloadBlob(result.url, nameFor(item, result))
  }

  function downloadAll() {
    files.forEach((item) => downloadOne(item))
  }

  const isPng = format === 'image/png'
  const doneCount = files.filter((f) => results[f.id]?.url).length
  const allDone = files.length > 0 && doneCount === files.length
  const totalBefore = files.reduce((sum, f) => sum + f.file.size, 0)
  const totalAfter = files.reduce((sum, f) => sum + (results[f.id]?.bytes || 0), 0)

  let optimizeLabel = 'Optimize Images'
  if (processing) optimizeLabel = `Optimizing… (${doneCount}/${files.length})`

  return (
    <>
      {/* HERO */}
      <section className="bg-navy text-white overflow-hidden relative bg-[url('/images/image-optimizer-hero-bg.png')] bg-cover bg-right lg:bg-center bg-no-repeat">
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,27,42,1)_0%,rgba(13,27,42,0.9)_45%,rgba(13,27,42,0.5)_70%,rgba(13,27,42,0.1)_100%)]"
          aria-hidden
        />
        <div className="section pt-36 pb-16 lg:pt-44 lg:pb-24 relative">
          <Link
            to="/work"
            className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-orange transition-colors mb-6"
          >
            <Icon name="chevron" className="w-4 h-4 rotate-180" strokeWidth={2} />
            Back to Work
          </Link>
          <div>
            <span className="eyebrow">Our Tool</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mt-4 max-w-xl">
            Free Image Optimizer
            <br />
            &amp; Compressor
          </h1>
          <p className="text-white/70 mt-5 max-w-lg leading-relaxed">
            Resize, compress and convert images directly in your browser. Optimize
            JPG, PNG and WebP images without uploading them to a server — faster,
            easier and safer.
          </p>
          <div className="inline-flex items-center gap-3 mt-7 border border-emerald-400/40 bg-emerald-400/10 text-emerald-300 rounded-full px-4 py-2 text-xs font-semibold">
            <Icon name="shield-check" className="w-4 h-4" strokeWidth={2} />
            <span>100% browser-based</span>
            <span className="w-1 h-1 rounded-full bg-emerald-300" aria-hidden />
            <span>Your images stay on your device</span>
          </div>
        </div>
      </section>

      {/* TOOL */}
      <section className="bg-cream/40 py-14 lg:py-16">
        <div className="section">
          <div className="bg-white rounded-2xl shadow-lg border border-black/5 overflow-hidden grid lg:grid-cols-[1fr_380px]">
            {/* LEFT: upload + file list */}
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-2.5 mb-6">
                <Icon name="shield-check" className="w-4 h-4 shrink-0" strokeWidth={2} />
                Processed locally in your browser. No uploads. No account. No registration.
              </div>

              <div
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    fileInputRef.current?.click()
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
                <p className="font-semibold text-ink text-sm">Drop images here</p>
                <p className="text-xs text-muted mt-1">or click to browse</p>
                <p className="text-xs text-muted mt-3">Supports JPG, PNG, WebP, AVIF (up to 50MB per file)</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => {
                    handleFiles(e.target.files)
                    e.target.value = ''
                  }}
                />
              </div>

              {notice && <p className="text-xs text-red-600 mt-3" role="status">{notice}</p>}

              {/* FILE LIST */}
              <div className="mt-8">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-bold text-ink text-sm">
                    Your Images ({files.length})
                  </h2>
                  {files.length > 0 && (
                    <button
                      type="button"
                      onClick={clearAll}
                      className="text-xs font-medium text-sky-600 underline underline-offset-2 hover:text-orange"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {loading && <p className="text-xs text-muted mt-4">Loading images…</p>}

                {files.length === 0 && !loading && (
                  <p className="text-sm text-muted mt-4">No images yet. Add some above to get started.</p>
                )}

                <ul className="mt-4 space-y-3">
                  {files.map((item) => {
                    const result = results[item.id]
                    const saved = result ? Math.round((1 - result.bytes / item.file.size) * 100) : 0
                    return (
                      <li
                        key={item.id}
                        className="flex items-center gap-4 border border-black/10 rounded-lg p-2.5 pr-4"
                      >
                        <img
                          src={item.url}
                          alt=""
                          className="w-[70px] h-[46px] object-cover rounded-md border border-black/10 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-ink truncate" title={item.file.name}>
                            {item.file.name}
                          </p>
                          <p className="font-mono text-[11px] text-muted mt-0.5">
                            {item.img.naturalWidth} × {item.img.naturalHeight} • {formatSize(item.file.size)}
                            {result && (
                              <>
                                {' → '}
                                <span className="text-emerald-700 font-semibold">
                                  {result.w} × {result.h} • {formatSize(result.bytes)}
                                </span>
                                <span className={saved > 0 ? 'text-emerald-700' : 'text-red-600'}>
                                  {' '}({saved > 0 ? `−${saved}%` : `+${Math.abs(saved)}%`})
                                </span>
                              </>
                            )}
                          </p>
                        </div>
                        {result && (
                          <button
                            type="button"
                            onClick={() => downloadOne(item)}
                            aria-label={`Download optimized ${item.file.name}`}
                            className="text-orange hover:text-ink transition-colors shrink-0"
                          >
                            <Icon name="upload" className="w-4 h-4 rotate-180" strokeWidth={2} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => removeFile(item.id)}
                          aria-label={`Remove ${item.file.name}`}
                          className="text-muted hover:text-ink text-lg leading-none shrink-0"
                        >
                          ×
                        </button>
                      </li>
                    )
                  })}
                </ul>

                {/* RESULTS NOTE */}
                {files.length > 0 && (
                  <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-sky-50 border border-sky-100 rounded-lg px-4 py-3 text-xs text-sky-800">
                    <span className="flex items-center gap-2">
                      <Icon name="image" className="w-4 h-4 shrink-0" strokeWidth={2} />
                      {allDone
                        ? `Saved ${formatSize(Math.max(0, totalBefore - totalAfter))} across ${files.length} image${files.length > 1 ? 's' : ''} (${formatSize(totalBefore)} → ${formatSize(totalAfter)}).`
                        : 'Results will appear here after optimization.'}
                    </span>
                    {allDone && (
                      <button
                        type="button"
                        onClick={downloadAll}
                        className="font-semibold text-orange hover:underline shrink-0 text-left"
                      >
                        Download all
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: settings */}
            <aside className="bg-paper border-t lg:border-t-0 lg:border-l border-black/5 p-6 md:p-8">
              <h2 className="flex items-center gap-2 font-display font-bold text-ink">
                <Icon name="gear" className="w-4 h-4" strokeWidth={2} />
                Settings
              </h2>

              <div className="bg-white border border-black/5 rounded-xl p-5 mt-4 space-y-6">
                {/* RESIZE */}
                <fieldset>
                  <legend className="text-sm font-semibold text-ink">Resize</legend>
                  <label className="flex items-center gap-2.5 text-sm text-ink/80 mt-3 cursor-pointer">
                    <input
                      type="radio"
                      name="resize"
                      checked={resizeMode === 'original'}
                      onChange={() => setResizeMode('original')}
                      className="accent-navy"
                    />
                    Keep original dimensions
                  </label>
                  <label className="flex items-center gap-2.5 text-sm text-ink/80 mt-2.5 cursor-pointer">
                    <input
                      type="radio"
                      name="resize"
                      checked={resizeMode === 'custom'}
                      onChange={() => setResizeMode('custom')}
                      className="accent-navy"
                    />
                    Resize to
                  </label>
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="number"
                      min="1"
                      aria-label="Width in pixels"
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      disabled={resizeMode !== 'custom'}
                      placeholder="1920"
                      className="w-full min-w-0 border border-black/15 rounded-lg px-3 py-2 text-sm focus:border-orange outline-none disabled:bg-black/[0.03] disabled:text-muted"
                    />
                    <span className="text-muted text-sm" aria-hidden>×</span>
                    <input
                      type="number"
                      min="1"
                      aria-label="Height in pixels"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      disabled={resizeMode !== 'custom'}
                      placeholder="1280"
                      className="w-full min-w-0 border border-black/15 rounded-lg px-3 py-2 text-sm focus:border-orange outline-none disabled:bg-black/[0.03] disabled:text-muted"
                    />
                    <button
                      type="button"
                      onClick={() => setMaintainRatio((v) => !v)}
                      disabled={resizeMode !== 'custom'}
                      aria-pressed={maintainRatio}
                      aria-label="Lock aspect ratio"
                      className={`shrink-0 p-1.5 rounded-md transition-colors disabled:opacity-40 ${
                        maintainRatio ? 'text-orange' : 'text-muted'
                      }`}
                    >
                      <Icon name="link" className="w-4 h-4" strokeWidth={2} />
                    </button>
                  </div>
                  <label className="flex items-center gap-2.5 text-sm text-ink/80 mt-4 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={maintainRatio}
                      onChange={(e) => setMaintainRatio(e.target.checked)}
                      className="accent-navy"
                    />
                    Maintain aspect ratio
                  </label>
                </fieldset>

                {/* FORMAT */}
                <div className="border-t border-black/5 pt-5">
                  <label htmlFor="opt-format" className="text-sm font-semibold text-ink">
                    Output format
                  </label>
                  <select
                    id="opt-format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="mt-2.5 w-full border border-black/15 rounded-lg px-3 py-2.5 text-sm focus:border-orange outline-none bg-white"
                  >
                    <option value="auto">Auto (Recommended)</option>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/webp">WebP</option>
                    <option value="image/png">PNG</option>
                    {avifSupported && <option value="image/avif">AVIF</option>}
                  </select>
                  {format === 'auto' && (
                    <p className="text-[11px] text-muted mt-2">Auto converts to WebP for the best size-to-quality balance.</p>
                  )}
                </div>

                {/* COMPRESSION */}
                <fieldset className="border-t border-black/5 pt-5">
                  <legend className="text-sm font-semibold text-ink">Compression</legend>

                  {isPng ? (
                    <p className="text-xs text-muted bg-black/[0.03] border-l-4 border-black/10 rounded px-3 py-2.5 mt-3">
                      <strong>Note:</strong> PNG uses lossless export, so quality and
                      target size don&apos;t apply.
                    </p>
                  ) : (
                    <>
                      <label className="flex items-center gap-2.5 text-sm text-ink/80 mt-3 cursor-pointer">
                        <input
                          type="radio"
                          name="compression"
                          checked={compression === 'quality'}
                          onChange={() => setCompression('quality')}
                          className="accent-navy"
                        />
                        Quality
                      </label>
                      <div className="flex items-center gap-3 mt-2.5">
                        <input
                          type="range"
                          min="1"
                          max="100"
                          aria-label="Quality percentage"
                          value={quality}
                          disabled={compression !== 'quality'}
                          onChange={(e) => setQuality(Number(e.target.value))}
                          className="w-full accent-navy disabled:opacity-40"
                        />
                        <span className="font-mono text-xs text-ink border border-black/15 rounded px-2 py-1 shrink-0 w-14 text-center">
                          {quality}%
                        </span>
                      </div>

                      <label className="flex items-center gap-2.5 text-sm text-ink/80 mt-4 cursor-pointer">
                        <input
                          type="radio"
                          name="compression"
                          checked={compression === 'size'}
                          onChange={() => setCompression('size')}
                          className="accent-navy"
                        />
                        Target file size
                      </label>
                      <div className="flex items-center gap-2 mt-2.5">
                        <input
                          type="number"
                          min="1"
                          aria-label="Target file size in KB"
                          value={targetKB}
                          disabled={compression !== 'size'}
                          onChange={(e) => setTargetKB(e.target.value)}
                          className="w-full min-w-0 border border-black/15 rounded-lg px-3 py-2 text-sm focus:border-orange outline-none disabled:bg-black/[0.03] disabled:text-muted"
                        />
                        <span className="text-xs text-muted shrink-0">KB</span>
                      </div>
                    </>
                  )}
                </fieldset>

                {/* PRIVACY */}
                <div className="border-t border-black/5 pt-5">
                  <label className="flex items-center gap-2.5 text-sm text-ink/80">
                    <input type="checkbox" checked disabled className="accent-navy" />
                    Remove EXIF metadata
                  </label>
                  <p className="text-[11px] text-muted mt-1.5 ml-[26px]">
                    Always on — GPS and camera info are stripped when images are re-encoded.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOptimize}
                disabled={!files.length || loading || processing}
                className="btn-primary w-full justify-center mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Icon name="image" className="w-4 h-4" strokeWidth={2} />
                {optimizeLabel}
              </button>
            </aside>
          </div>
        </div>
      </section>

      {/* WHY USE */}
      <section className="bg-navy text-white py-16 lg:py-20">
        <div className="section grid lg:grid-cols-[minmax(0,320px)_1fr] gap-12 items-center">
          <div>
            <span className="eyebrow">Why use Chaufal Image Optimizer?</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 leading-tight">
              Fast. Secure. Simple<span className="text-orange">.</span>
            </h2>
            <p className="text-white/60 mt-4 leading-relaxed max-w-xs">
              Everything you need to optimize your images — right in your browser.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-8 lg:divide-x divide-white/10">
            {WHY_FEATURES.map((f, i) => (
              <div key={f.title} className={i > 0 ? 'lg:pl-6' : ''}>
                <div className="w-12 h-12 rounded-xl border border-orange/40 bg-orange/10 text-orange flex items-center justify-center">
                  <Icon name={f.icon} className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-sm mt-4">{f.title}</h3>
                <p className="text-xs text-white/55 mt-2 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GUIDE */}
      <section id="guide" className="section py-16 lg:py-20 scroll-mt-28 grid lg:grid-cols-[minmax(0,1fr)_1.1fr_1.1fr] gap-10 lg:gap-12 items-start">
        <div>
          <span className="eyebrow">The Complete Guide</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl mt-3 text-ink leading-tight">
            How to Optimize Images for a Website
          </h2>
          <p className="text-muted mt-5 leading-relaxed">
            Optimizing images helps your website load faster, uses less bandwidth and
            provides a better experience for your visitors. Here&apos;s everything you
            need to know about image optimization.
          </p>
          <a href="#guide-steps" className="btn-outline-light mt-7 text-sm py-2.5 px-5 !border-orange/60 !text-orange">
            Read the full guide <span aria-hidden>→</span>
          </a>
        </div>

        <ol id="guide-steps" className="space-y-5 scroll-mt-28">
          {GUIDE_STEPS.map((s, i) => (
            <li key={s.title} className="flex items-start gap-4">
              <span className="w-7 h-7 rounded-full bg-orange text-white text-xs font-bold flex items-center justify-center shrink-0">
                {i + 1}
              </span>
              <div>
                <h3 className="font-display font-semibold text-ink text-sm">{s.title}</h3>
                <p className="text-xs text-muted mt-1 leading-relaxed">{s.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="bg-white border border-black/10 rounded-2xl p-5 md:p-6 shadow-sm">
          <h3 className="font-display font-bold text-ink text-sm">Image Formats Comparison</h3>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs min-w-[320px]">
              <thead>
                <tr className="bg-black/[0.03] text-ink/80">
                  <th className="font-semibold px-3 py-2">Format</th>
                  <th className="font-semibold px-3 py-2">Best for</th>
                  <th className="font-semibold px-3 py-2">Key benefit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 text-ink/80">
                {FORMAT_ROWS.map((r) => (
                  <tr key={r.format}>
                    <td className="font-semibold px-3 py-3">{r.format}</td>
                    <td className="px-3 py-3">{r.bestFor}</td>
                    <td className="px-3 py-3">{r.benefit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="flex items-start gap-2.5 bg-sky-50 border border-sky-100 text-sky-800 rounded-lg px-3.5 py-3 text-xs leading-relaxed mt-4">
            <Icon name="bulb" className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
            WebP and AVIF offer better compression than JPG and PNG, making them
            ideal for modern websites.
          </p>
        </div>
      </section>

      {/* MORE TOOLS */}
      <section className="bg-cream/40 border-t border-black/5 py-14">
        <div className="section grid lg:grid-cols-[minmax(0,1fr)_2fr] gap-8 items-center">
          <div>
            <h2 className="font-display font-bold text-xl md:text-2xl text-ink">
              More Free Tools from Chaufal Tech
            </h2>
            <p className="text-sm text-muted mt-3 leading-relaxed max-w-xs">
              Explore our growing collection of free online tools to help you work
              smarter and faster.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {MORE_TOOLS.map((t) => (
              <Link
                key={t.title}
                to="/work"
                className="flex items-start gap-4 bg-white border border-black/5 rounded-xl p-5 shadow-sm hover:shadow-lg transition-shadow"
              >
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.tint}`}>
                  <Icon name={t.icon} className="w-5 h-5" />
                </span>
                <span>
                  <span className="block font-display font-bold text-ink text-sm">{t.title}</span>
                  <span className="block text-xs text-muted mt-1.5 leading-relaxed">{t.description}</span>
                  <span className="inline-flex items-center gap-1.5 text-sky-600 text-xs font-semibold mt-3">
                    Open Tool <span aria-hidden>→</span>
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}