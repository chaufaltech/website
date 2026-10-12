import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import Seo from '../components/Seo.jsx'
import { SITE_URL, breadcrumbSchema } from '../lib/seo.js'

// ---------------------------------------------------------------------------
// SEO
// ---------------------------------------------------------------------------
const SEO_TITLE = 'How to Optimize Images for a Website | Chaufal Tech'
const SEO_DESCRIPTION =
  'Learn how to resize, compress and choose the right image format for your website. A practical guide to JPG, PNG, WebP, AVIF and responsive images.'
const GUIDE_PATH = '/guides/image-optimization'
const GUIDE_IMAGE = '/images/image-optimization-guide-hero-bg.png'
const UPDATED_ISO = '2026-10-04'

const FAQS = [
  {
    q: 'Is this image optimizer free?',
    a: 'Yes. The Chaufal Tech Image Optimizer is free to use, with no account or registration required.',
  },
  {
    q: 'Can I compress multiple images at once?',
    a: 'Yes. Add as many images as you like, choose your settings once, and optimize them all in a single session.',
  },
  {
    q: 'Are my images uploaded to your servers?',
    a: 'No. Images are resized, compressed and converted entirely inside your browser. They never leave your device.',
  },
  {
    q: 'Will compression reduce image quality?',
    a: 'Lossy compression (JPG, WebP, AVIF) removes some data, but at sensible settings the difference is rarely visible. Preview the result and lower the compression if you can see a difference.',
  },
  {
    q: 'What image formats are supported?',
    a: 'You can add JPG, PNG, WebP and AVIF images (up to 50 MB each) and export to JPG, PNG, WebP or AVIF.',
  },
  {
    q: 'Is this tool safe for private images?',
    a: 'Because nothing is uploaded, your images stay on your device. EXIF metadata such as GPS location and camera details is also removed from the exported files.',
  },
]

const GUIDE_SCHEMAS = [
  {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'How to Optimize Images for a Website',
    description: SEO_DESCRIPTION,
    image: `${SITE_URL}${GUIDE_IMAGE}`,
    datePublished: UPDATED_ISO,
    dateModified: UPDATED_ISO,
    mainEntityOfPage: `${SITE_URL}${GUIDE_PATH}`,
    author: { '@type': 'Organization', name: 'Chaufal Tech', url: `${SITE_URL}/` },
    publisher: {
      '@type': 'Organization',
      name: 'Chaufal Tech',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo/logo-icon.svg` },
    },
  },
  breadcrumbSchema([
    { name: 'Home', path: '/' },
    { name: 'Guides', path: '/guides' },
    { name: 'Image Optimization', path: GUIDE_PATH },
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
]

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------
const TOC = [
  { id: 'why-it-matters', label: 'Why image optimization matters' },
  { id: 'dimensions', label: 'Start with the right dimensions' },
  { id: 'formats', label: 'Choose the right image format' },
  { id: 'compression', label: 'Compression: lossy vs lossless' },
  { id: 'responsive-images', label: 'Responsive images' },
  { id: 'metadata', label: 'Metadata and privacy' },
  { id: 'workflow', label: 'A practical optimization workflow' },
  { id: 'core-web-vitals', label: 'Optimize for Core Web Vitals' },
  { id: 'common-mistakes', label: 'Common mistakes' },
  { id: 'faq', label: 'FAQ' },
]

const BENEFITS = [
  { icon: 'clock', title: 'Faster Load Times', description: 'Better user experience' },
  { icon: 'chart', title: 'Lower Page Weight', description: 'Uses less bandwidth' },
  { icon: 'image', title: 'Maintains Visual Quality', description: 'Looks great, just smaller' },
]

const FORMATS = [
  {
    name: 'JPEG',
    icon: 'image',
    tint: 'bg-orange/15 text-orange',
    bestFor: 'Photos and complex images',
    strengths: 'Small file size, wide support',
    tradeoffs: 'No transparency, some quality loss',
    transparency: false,
    animation: false,
  },
  {
    name: 'PNG',
    icon: 'document',
    tint: 'bg-sky-100 text-sky-600',
    bestFor: 'Graphics, logos, transparency',
    strengths: 'Lossless, high quality',
    tradeoffs: 'Larger file size',
    transparency: true,
    animation: false,
  },
  {
    name: 'WebP',
    icon: 'globe',
    tint: 'bg-emerald-100 text-emerald-600',
    bestFor: 'General web use',
    strengths: 'Smaller size, good quality',
    tradeoffs: 'Limited older browser support',
    transparency: true,
    animation: true,
  },
  {
    name: 'AVIF',
    icon: 'rocket',
    tint: 'bg-violet-100 text-violet-600',
    bestFor: 'Modern browsers',
    strengths: 'Excellent compression, high quality',
    tradeoffs: 'Slower to encode, limited older browser support',
    transparency: true,
    animation: true,
  },
]

const WORKFLOW = [
  { title: 'Choose dimensions', description: 'Set the right width and height.' },
  { title: 'Pick format', description: 'Use the best format for your needs.' },
  { title: 'Compress', description: 'Balance quality and file size.' },
  { title: 'Inspect result', description: 'Check size and visual quality.' },
  { title: 'Serve responsively', description: 'Use srcset or picture for different devices.' },
  { title: 'Monitor', description: 'Track performance and make adjustments.' },
]

const VITALS = [
  {
    abbr: 'LCP',
    name: 'Largest Contentful Paint',
    target: '≤ 2.5 s',
    note: 'Loading experience',
    tint: 'bg-emerald-100 text-emerald-600',
    tip: 'Your hero image is often the LCP element. Keep it small, and never lazy-load it.',
  },
  {
    abbr: 'INP',
    name: 'Interaction to Next Paint',
    target: '≤ 200 ms',
    note: 'Interactivity',
    tint: 'bg-sky-100 text-sky-600',
    tip: 'Smaller downloads and fewer large image decodes leave the browser freer to respond.',
  },
  {
    abbr: 'CLS',
    name: 'Cumulative Layout Shift',
    target: '≤ 0.1',
    note: 'Visual stability',
    tint: 'bg-violet-100 text-violet-600',
    tip: 'Set width and height on every image so the page does not jump as images load.',
  },
]

const MISTAKES = [
  { title: 'Uploading camera originals', text: 'A 4000px photo displayed at 800px wastes bandwidth on every visit.' },
  { title: 'Using PNG for photographs', text: 'PNG is lossless, so photos end up far larger than they need to be. Use JPG, WebP or AVIF.' },
  { title: 'Leaving out width and height', text: 'Without dimensions the browser cannot reserve space, which causes layout shift.' },
  { title: 'Lazy-loading the hero image', text: 'Lazy-load images below the fold, but load the main above-the-fold image straight away.' },
  { title: 'Re-compressing already compressed files', text: 'Each lossy save loses more detail. Always optimize from the original where you can.' },
  { title: 'Skipping alt text', text: 'Alt text helps accessibility and search engines understand what the image shows.' },
]

const RELATED = [
  {
    icon: 'image',
    tint: 'bg-orange/15 text-orange',
    title: 'Image Optimizer',
    description: 'Resize, compress and convert images in your browser.',
    to: '/tools/image-optimizer',
    cta: 'Open Tool',
  },
  {
    icon: 'chart',
    tint: 'bg-indigo-100 text-indigo-600',
    title: 'SEO / GEO Calculator',
    description: "Analyze, optimize and track your content's visibility across search engines and AI platforms.",
    to: '/tools/seo-geo-calculator',
    cta: 'Open Tool',
  },
  {
    icon: 'check-circle',
    tint: 'bg-emerald-100 text-emerald-600',
    title: 'QA Automation Tool',
    description: 'Simplify testing, improve reliability, and ship with confidence.',
    to: '/work',
    cta: 'Open Tool',
  },
  {
    icon: 'briefcase',
    tint: 'bg-amber/20 text-orange',
    title: 'Our Services',
    description: 'Custom solutions for your business needs.',
    to: '/services',
    cta: 'Explore Services',
  },
]

const PICTURE_SNIPPET = `<picture>
  <source type="image/avif"
    srcset="photo-400.avif 400w, photo-800.avif 800w, photo-1200.avif 1200w"
    sizes="(min-width: 1024px) 1200px, 100vw">
  <source type="image/webp"
    srcset="photo-400.webp 400w, photo-800.webp 800w, photo-1200.webp 1200w"
    sizes="(min-width: 1024px) 1200px, 100vw">
  <img src="photo-800.jpg" width="1200" height="800"
    alt="Mountain lake at sunrise" loading="lazy">
</picture>`

// ---------------------------------------------------------------------------
// Small visual helpers (illustrative — no external image assets needed)
// ---------------------------------------------------------------------------
function Mountain({ className = '' }) {
  return (
    <svg viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="guide-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6fa3d8" />
          <stop offset="1" stopColor="#f3cf9f" />
        </linearGradient>
      </defs>
      <rect width="160" height="100" fill="url(#guide-sky)" />
      <circle cx="112" cy="34" r="9" fill="#fff3d6" opacity="0.9" />
      <polygon points="0,66 38,28 70,60 100,34 160,70 160,100 0,100" fill="#5c7fa8" />
      <polygon points="38,28 31,38 38,35 44,40" fill="#fff" opacity="0.9" />
      <polygon points="100,34 94,43 100,41 106,45" fill="#fff" opacity="0.9" />
      <polygon points="0,78 50,50 96,76 130,58 160,80 160,100 0,100" fill="#2f4a6b" />
      <rect y="80" width="160" height="20" fill="#3d6b8f" opacity="0.85" />
    </svg>
  )
}

function SectionHeading({ number, title, className = '' }) {
  return (
    <h2 className={`font-display font-bold text-2xl md:text-[28px] text-ink leading-tight ${className}`}>
      <span className="text-orange mr-2">{number}.</span>
      {title}
    </h2>
  )
}

function Illustrative() {
  return <p className="text-[11px] text-muted/80 mt-3">Illustrative example. Real results depend on the image.</p>
}

function YesNo({ yes }) {
  return yes ? (
    <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
      <Icon name="check-circle" className="w-3.5 h-3.5" strokeWidth={2.2} /> Yes
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-red-500 font-medium">
      <span aria-hidden className="font-bold">×</span> No
    </span>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------
export default function ImageOptimizationGuide() {
  return (
    <>
      <Seo
        title={SEO_TITLE}
        description={SEO_DESCRIPTION}
        path={GUIDE_PATH}
        image={GUIDE_IMAGE}
        type="article"
        jsonLd={GUIDE_SCHEMAS}
      />
      {/* HERO */}
      <section className="bg-navy text-white overflow-hidden relative">
        <div className="section pt-36 pb-6 lg:pt-44 lg:pb-28 relative z-10">
          <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-xs text-white/50 mb-7">
            <Link to="/" className="hover:text-orange transition-colors">Home</Link>
            <span aria-hidden>/</span>
            <Link to="/guides" className="hover:text-orange transition-colors">Guides</Link>
            <span aria-hidden>/</span>
            <span className="text-white/70" aria-current="page">Image Optimization</span>
          </nav>

          <span className="eyebrow">Customer Guide</span>
          <h1 className="font-display font-bold text-4xl md:text-5xl leading-tight mt-4 max-w-xl">
            How to Optimize Images for a Website
          </h1>
          <p className="text-white/70 mt-5 max-w-lg leading-relaxed">
            Learn how resizing, choosing the right format, compressing intelligently,
            and serving responsive images can improve your website&apos;s performance —
            without sacrificing visual quality.
          </p>

          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-6 text-xs text-white/60">
            <li className="flex items-center gap-1.5">
              <Icon name="clock" className="w-3.5 h-3.5" /> Updated: Oct 4, 2026
            </li>
            <li className="flex items-center gap-1.5 text-sky-300">
              <Icon name="document" className="w-3.5 h-3.5" /> Practical guide
            </li>
            <li className="flex items-center gap-1.5">
              <Icon name="clock" className="w-3.5 h-3.5" /> 10 min read
            </li>
          </ul>
        </div>

        {/* The artwork is its own layer (not a CSS background) so it can sit
            to the right of the text instead of behind it. It stacks below the
            text on small screens and fades into the navy at its edges. */}
        <img
          src="/images/image-optimization-guide-hero-bg.png"
          alt=""
          aria-hidden="true"
          width="2172"
          height="724"
          className="block w-full h-auto pointer-events-none select-none lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2 lg:w-[85%] lg:max-w-none xl:w-[75%]"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)',
            maskImage:
              'linear-gradient(to right, transparent 0%, #000 30%), linear-gradient(to bottom, transparent 0%, #000 14%, #000 86%, transparent 100%)',
            WebkitMaskComposite: 'source-in',
            maskComposite: 'intersect',
          }}
        />
      </section>

      {/* TOC + QUICK TAKE */}
      <section className="section py-12 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          <nav aria-label="Table of contents" className="bg-white border border-orange/20 rounded-2xl p-6 md:p-7 shadow-sm">
            <h2 className="flex items-center gap-3 font-display font-bold text-ink">
              <Icon name="document" className="w-5 h-5 text-orange" />
              Table of Contents
            </h2>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-3 mt-5 sm:grid-flow-col sm:grid-rows-5">
              {TOC.map((item, i) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className="flex items-center gap-3 text-sm text-ink/80 hover:text-orange transition-colors">
                    <span className="w-5 h-5 rounded-full bg-orange text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {item.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <aside className="bg-sky-50 border border-sky-100 rounded-2xl p-6">
            <Icon name="bulb" className="w-6 h-6 text-sky-500" />
            <h2 className="font-display font-bold text-ink text-sm mt-3">Quick Take</h2>
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              The right balance of size, format and quality can make your website
              faster, leaner and more user-friendly.
            </p>
            <span className="block w-10 h-0.5 bg-orange rounded-full mt-4" />
          </aside>
        </div>
      </section>

      {/* 1. WHY IT MATTERS */}
      <section id="why-it-matters" className="section py-12 scroll-mt-28 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <SectionHeading number="1" title="Why Image Optimization Matters" />
          <p className="text-muted mt-4 leading-relaxed max-w-md">
            Large, unoptimized images can slow down your site, increase page weight
            and use more bandwidth. Optimized images load faster, improve user
            experience and help your site perform better in search results.
          </p>
          <div className="grid grid-cols-3 gap-4 mt-8 max-w-md">
            {BENEFITS.map((b, i) => (
              <div key={b.title} className={i > 0 ? 'border-l border-black/10 pl-4' : ''}>
                <span className="w-10 h-10 rounded-lg bg-orange/10 text-orange flex items-center justify-center">
                  <Icon name={b.icon} className="w-5 h-5" />
                </span>
                <h3 className="font-display font-semibold text-ink text-xs mt-3 leading-snug">{b.title}</h3>
                <p className="text-[11px] text-muted mt-1 leading-snug">{b.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <img
            src="/images/image-optimization-before-after.png"
            alt="Before optimization: a 2.4 MB image. After optimization: the same image at 420 KB. Download size drops from 2.4 MB to 420 KB and page weight from 4.8 MB to 1.2 MB, with the same visual quality."
            width="800"
            height="450"
            loading="lazy"
            className="w-full h-auto"
          />
          <Illustrative />
        </div>
      </section>

      {/* 2. DIMENSIONS */}
      <section id="dimensions" className="section py-12 scroll-mt-28 grid grid-cols-1 lg:grid-cols-[minmax(0,320px)_1fr] gap-10 items-center">
        <div>
          <SectionHeading number="2" title="Start with the Right Dimensions" />
          <p className="text-muted mt-4 leading-relaxed">
            Don&apos;t upload a 4000px image when your website only displays it at
            1200px. Resizing to the right dimensions reduces file size and improves
            loading speed without losing quality.
          </p>
        </div>

        <div className="min-w-0">
          {/* The artwork has small captions baked in, so on narrow screens it
              keeps a readable minimum width and scrolls inside this box
              (the page itself never scrolls sideways). */}
          <div className="overflow-x-auto">
            <img
              src="/images/image-optimization-right-dimensions.png"
              alt="Resizing workflow: an original 4000 × 2670 image (3.8 MB) is resized to its actual display size of 1200 × 800 (780 KB), then exported as responsive variants — desktop 1600 × 1067 (780 KB), tablet 1000 × 667 (420 KB) and mobile 640 × 427 (180 KB)."
              width="2170"
              height="725"
              loading="lazy"
              className="block w-full min-w-[620px] sm:min-w-0 h-auto"
            />
          </div>
          <Illustrative />
        </div>
      </section>

      {/* 3. FORMATS */}
      <section id="formats" className="section py-12 scroll-mt-28">
        <SectionHeading number="3" title="Choose the Right Image Format" />
        <p className="text-muted mt-3 max-w-xl leading-relaxed">
          Each format has its own strengths. The best choice depends on your image
          type, quality needs and browser support.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
          {FORMATS.map((f) => (
            <article key={f.name} className="bg-white border border-black/10 rounded-xl p-5 shadow-sm">
              <h3 className="flex items-center gap-3 font-display font-bold text-ink">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${f.tint}`}>
                  <Icon name={f.icon} className="w-[18px] h-[18px]" />
                </span>
                {f.name}
              </h3>
              <dl className="mt-5 space-y-3 text-xs">
                <div>
                  <dt className="font-semibold text-ink">Best for</dt>
                  <dd className="text-muted mt-0.5">{f.bestFor}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Strengths</dt>
                  <dd className="text-muted mt-0.5">{f.strengths}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-ink">Tradeoffs</dt>
                  <dd className="text-muted mt-0.5">{f.tradeoffs}</dd>
                </div>
                <div className="border-t border-black/5 pt-3">
                  <dt className="font-semibold text-ink">Transparency / Animation</dt>
                  <dd className="flex items-center gap-2 mt-1">
                    <YesNo yes={f.transparency} />
                    <span className="text-black/20" aria-hidden>/</span>
                    <YesNo yes={f.animation} />
                  </dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      </section>

      {/* 4 + 5 */}
      <section className="section py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* 4. COMPRESSION */}
        <div id="compression" className="scroll-mt-28">
          <SectionHeading number="4" title="Compression: Lossy vs Lossless" />
          <p className="text-muted mt-3 leading-relaxed">
            Lossy compression reduces file size by removing some data. Lossless keeps
            all the original information. The right setting helps you get a good
            balance between size and quality.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-4 mt-6 items-start">
            <img
              src="/images/image-compression-comparison.webp"
              alt="Side-by-side comparison of the same mountain lake photo: the original at 2.4 MB on the left and the compressed version at 684 KB on the right, with no visible loss in quality."
              width="1200"
              height="862"
              loading="lazy"
              className="block w-full h-auto rounded-xl"
            />
            <div className="bg-white border border-black/10 rounded-xl p-4 text-xs" aria-hidden="true">
              <p className="font-semibold text-ink">Choose your approach</p>
              <p className="flex items-center gap-2 text-muted mt-3">
                <span className="w-7 h-3.5 rounded-full bg-sky-500 relative"><span className="absolute right-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-white" /></span>
                Quality (recommended)
              </p>
              <p className="flex items-center gap-2 text-muted mt-2">
                <span className="w-7 h-3.5 rounded-full bg-black/10 relative"><span className="absolute left-0.5 top-0.5 w-2.5 h-2.5 rounded-full bg-white" /></span>
                Target file size
              </p>
              <p className="font-semibold text-ink mt-4">Quality</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="relative flex-1 h-1 rounded-full bg-black/10"><span className="absolute inset-y-0 left-0 w-4/5 rounded-full bg-orange" /><span className="absolute left-4/5 -top-1 w-3 h-3 rounded-full bg-orange" /></span>
                <span className="font-mono text-[10px]">80%</span>
              </div>
              <p className="text-muted mt-4">Estimated size</p>
              <p className="font-semibold text-ink">~ 684 KB (71% smaller)</p>
            </div>
          </div>
          <Illustrative />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5 text-sm">
            <div className="border-l-2 border-orange pl-4">
              <h3 className="font-display font-semibold text-ink">Lossy (JPG, WebP, AVIF)</h3>
              <p className="text-muted text-xs mt-1 leading-relaxed">Smaller files by discarding detail the eye barely notices. Best for photographs.</p>
            </div>
            <div className="border-l-2 border-sky-400 pl-4">
              <h3 className="font-display font-semibold text-ink">Lossless (PNG)</h3>
              <p className="text-muted text-xs mt-1 leading-relaxed">Every pixel preserved. Best for logos, screenshots and graphics with sharp edges.</p>
            </div>
          </div>
        </div>

        {/* 5. RESPONSIVE */}
        <div id="responsive-images" className="scroll-mt-28 lg:border-l lg:border-black/10 lg:pl-12">
          <SectionHeading number="5" title="Responsive Images" />
          <p className="text-muted mt-3 leading-relaxed">
            Serve different image sizes based on the device. This improves loading
            speed and saves bandwidth.
          </p>

          <img
            src="/images/image-responsive-devices.webp"
            alt="The same mountain lake photo shown on three devices: a 1280px desktop laptop, a 768px tablet and a 320px mobile phone, each served an image sized for its screen."
            width="1200"
            height="670"
            loading="lazy"
            className="block w-full h-auto mt-6"
          />

          <pre className="mt-6 max-w-full bg-sky-50 border border-sky-100 rounded-xl p-4 overflow-x-auto text-[11px] leading-relaxed text-ink/80">
            <code className="font-mono">{PICTURE_SNIPPET}</code>
          </pre>
          <p className="text-xs text-muted mt-3 leading-relaxed">
            The browser picks the first format it supports and the smallest file that
            still looks sharp on the visitor&apos;s screen.
          </p>
        </div>
      </section>

      {/* 6, 7, 8 */}
      <section className="section py-12 grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* 6. METADATA */}
        <div id="metadata" className="scroll-mt-28">
          <SectionHeading number="6" title="Remove Unnecessary Metadata" className="!text-xl" />
          <p className="text-muted text-sm mt-3 leading-relaxed">
            Images often contain EXIF data (camera settings, GPS location, etc.).
            Removing it helps protect privacy and reduces file size.
          </p>
          <img
            src="/images/image-metadata-before-after.webp"
            alt="Before and after removing metadata: the original photo carries EXIF data (camera model, GPS location, date and time, device info); the optimized photo has none."
            width="1200"
            height="670"
            loading="lazy"
            className="block w-full h-auto mt-5"
          />
        </div>

        {/* 7. WORKFLOW */}
        <div id="workflow" className="scroll-mt-28">
          <SectionHeading number="7" title="A Practical Workflow" className="!text-xl" />
          <p className="text-muted text-sm mt-3">Follow these steps for the best results.</p>
          <ol className="mt-5 space-y-4">
            {WORKFLOW.map((s, i) => (
              <li key={s.title} className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-orange text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display font-semibold text-ink text-sm">{s.title}</h3>
                  <p className="text-xs text-muted mt-0.5 leading-relaxed">{s.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 8. CORE WEB VITALS */}
        <div id="core-web-vitals" className="scroll-mt-28">
          <SectionHeading number="8" title="Optimize for Core Web Vitals" className="!text-xl" />
          <p className="text-muted text-sm mt-3 leading-relaxed">
            Image optimization can positively impact your Core Web Vitals. These are
            Google&apos;s targets for a &ldquo;good&rdquo; experience.
          </p>
          <div className="grid grid-cols-3 gap-2.5 mt-5">
            {VITALS.map((v) => (
              <div key={v.abbr} className="bg-white border border-black/10 rounded-xl p-3">
                <span className={`inline-flex px-2 h-7 rounded-md items-center text-[11px] font-bold ${v.tint}`}>{v.abbr}</span>
                <p className="text-[10px] text-muted mt-2 leading-snug">{v.name}</p>
                <p className="font-display font-bold text-ink text-base mt-2">{v.target}</p>
                <p className="text-[10px] text-muted">{v.note}</p>
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-2 text-xs text-muted leading-relaxed">
            {VITALS.map((v) => (
              <li key={v.abbr}>
                <strong className="text-ink">{v.abbr}:</strong> {v.tip}
              </li>
            ))}
          </ul>
          <p className="flex items-start gap-2.5 bg-sky-50 border border-sky-100 text-sky-800 rounded-lg px-3.5 py-3 text-xs leading-relaxed mt-4">
            <Icon name="bulb" className="w-4 h-4 shrink-0 mt-0.5" strokeWidth={2} />
            Image optimization can help, but these metrics depend on your full site
            setup, hosting and needs. Always measure your actual performance.
          </p>
        </div>
      </section>

      {/* 9. COMMON MISTAKES */}
      <section id="common-mistakes" className="section py-12 scroll-mt-28">
        <SectionHeading number="9" title="Common Mistakes" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {MISTAKES.map((m) => (
            <div key={m.title} className="border border-black/10 bg-white rounded-xl p-5">
              <h3 className="font-display font-semibold text-ink text-sm flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-red-100 text-red-500 text-xs font-bold flex items-center justify-center shrink-0 mt-px" aria-hidden>
                  ×
                </span>
                {m.title}
              </h3>
              <p className="text-xs text-muted mt-2 leading-relaxed pl-[30px]">{m.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="section py-8">
        <div className="relative bg-orange/10 border border-orange/20 rounded-2xl px-6 py-8 md:px-10 flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10 overflow-hidden">
          <img
            src="/images/image-optimizer-cta-icon.webp"
            alt=""
            aria-hidden="true"
            width="192"
            height="192"
            loading="lazy"
            className="w-20 h-20 rounded-full shadow-md shrink-0"
          />
          <div className="flex-1">
            <span className="eyebrow !text-[12px]">Put it into practice</span>
            <h2 className="font-display font-bold text-2xl text-ink mt-2">Optimize your images now</h2>
            <p className="text-sm text-muted mt-2 leading-relaxed max-w-xl">
              Use our free Image Optimizer to resize, compress and convert your
              images — directly in your browser. No uploads, no registration.
            </p>
          </div>
          <div className="flex flex-col items-start lg:items-end gap-3 shrink-0">
            <Link to="/tools/image-optimizer" className="btn-primary">
              Open Image Optimizer <span aria-hidden>→</span>
            </Link>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-ink/70">
              {['100% browser-based', 'No signup', 'Supports JPG, PNG, WebP, AVIF'].map((t) => (
                <li key={t} className="flex items-center gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-full border border-orange text-orange flex items-center justify-center">
                    <Icon name="check" className="w-2 h-2" strokeWidth={4} />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 10. FAQ */}
      <section id="faq" className="section py-12 scroll-mt-28">
        <h2 className="font-display font-bold text-2xl text-ink">Frequently Asked Questions</h2>
        <p className="text-sm text-muted mt-1">Quick answers to common questions.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 mt-6 items-start">
          {FAQS.map((f) => (
            <details key={f.q} className="group border border-black/10 bg-white rounded-lg">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-4 py-3.5 text-sm text-ink/80 [&::-webkit-details-marker]:hidden">
                {f.q}
                <Icon name="chevron" className="w-4 h-4 rotate-90 text-muted shrink-0" strokeWidth={2} />
              </summary>
              <p className="px-4 pb-4 text-sm text-muted leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* RELATED */}
      <section className="section py-12 pb-20">
        <h2 className="font-display font-bold text-2xl text-ink">Related Guides &amp; Tools</h2>
        <p className="text-sm text-muted mt-1">
          Explore more resources and tools to help you build faster, smarter and better.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
          {RELATED.map((r) => (
            <Link
              key={r.title}
              to={r.to}
              className="flex flex-col bg-white border border-black/5 rounded-xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <span className="flex items-center gap-3">
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${r.tint}`}>
                  <Icon name={r.icon} className="w-[18px] h-[18px]" />
                </span>
                <span className="font-display font-bold text-ink text-sm">{r.title}</span>
              </span>
              <span className="text-xs text-muted mt-3 leading-relaxed flex-1">{r.description}</span>
              <span className="inline-flex items-center gap-1.5 text-sky-600 text-xs font-semibold mt-4">
                {r.cta} <span aria-hidden>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}