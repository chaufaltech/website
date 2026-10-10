import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const SITE_URL = 'https://www.chaufaltech.com'

// Pages that are built but kept out of the sitemap. Privacy Policy and Terms
// still contain placeholder text (and are marked noindex in their <Seo> tag);
// remove them from this list once the final wording is in.
const SITEMAP_EXCLUDE = new Set(['/404', '/privacy-policy', '/terms-of-service'])

let sitemapPaths = []

export default defineConfig({
  plugins: [react()],
  optimizeDeps: { exclude: ['@jsquash/avif'] },

  // Static site generation (vite-react-ssg): every route is rendered to real
  // HTML at build time so search engines and link previews see the content.
  ssgOptions: {
    entry: 'src/main.jsx',
    script: 'async',
    // '/404' is rendered through the catch-all route to produce 404.html,
    // which Vercel serves (with a real 404 status) for unknown URLs.
    includedRoutes(paths) {
      // Normalise to "/about"-style paths and skip wildcard / dynamic routes.
      const real = paths
        .filter((p) => !p.includes('*') && !p.includes(':'))
        .map((p) => (p.startsWith('/') ? p : `/${p}`))
      const all = [...new Set([...real, '/404'])]
      sitemapPaths = all.filter((p) => !SITEMAP_EXCLUDE.has(p))
      return all
    },
    // The default title and description in index.html would otherwise sit next
    // to each page's own, giving every page two of each. Remove them here so
    // each page ends up with exactly one (set by its <Seo> component).
    onBeforePageRender(_route, indexHTML) {
      return indexHTML
        .replace(/<title>[\s\S]*?<\/title>\s*/i, '')
        .replace(/<meta[^>]*name=["']description["'][^>]*>\s*/i, '')
    },
    // Write sitemap.xml next to the built pages.
    onFinished() {
      const today = new Date().toISOString().slice(0, 10)
      const urls = sitemapPaths
        .sort()
        .map((p) => `  <url>\n    <loc>${SITE_URL}${p === '/' ? '/' : p}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
        .join('\n')
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
      fs.writeFileSync(path.resolve('dist', 'sitemap.xml'), xml)
    },
  },
})