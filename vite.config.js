import fs from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const SITE_URL = 'https://www.chaufaltech.com'

// `npm run dev` only serves the front end; the files in /api are Vercel serverless
// functions. This runs them locally too (contact form, SEO / GEO Calculator), so
// they work on http://localhost without the Vercel CLI. It only applies to the dev
// server; builds and production are unaffected. Secrets (e.g. PSI_API_KEY) are read
// from your local .env file.
function localApiRoutes() {
  let env = {}
  return {
    name: 'local-api-routes',
    configResolved(config) {
      env = loadEnv(config.mode, config.root, '')
    },
    configureServer(server) {
      for (const [key, value] of Object.entries(env)) {
        if (process.env[key] === undefined) process.env[key] = value
      }

      server.middlewares.use(async (req, res, next) => {
        const match = /^\/api\/([a-z0-9-]+)(?:\?.*)?$/i.exec(req.url || '')
        if (!match || !fs.existsSync(path.resolve('api', `${match[1]}.js`))) return next()

        const send = (status, body) => {
          res.statusCode = status
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(body))
        }

        try {
          // Same helpers Vercel gives its functions.
          let raw = ''
          for await (const chunk of req) raw += chunk
          req.body = raw && /json/i.test(req.headers['content-type'] || '') ? JSON.parse(raw) : raw || undefined
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          res.json = (body) => send(res.statusCode || 200, body)

          const mod = await server.ssrLoadModule(`/api/${match[1]}.js`)
          await mod.default(req, res)
        } catch (err) {
          console.error(`[local api] /api/${match[1]} failed:`, err)
          if (!res.headersSent) send(500, { error: 'The local API route failed. Check the terminal for details.' })
        }
      })
    },
  }
}

// Pages that are built but kept out of the sitemap. Privacy Policy and Terms
// still contain placeholder text (and are marked noindex in their <Seo> tag);
// remove them from this list once the final wording is in.
const SITEMAP_EXCLUDE = new Set(['/404', '/privacy-policy', '/terms-of-service'])

let sitemapPaths = []

export default defineConfig({
  plugins: [react(), localApiRoutes()],
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