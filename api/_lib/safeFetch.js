import dns from 'node:dns/promises'
import http from 'node:http'
import https from 'node:https'
import net from 'node:net'
import zlib from 'node:zlib'

// Server-side page fetching for the SEO / GEO Calculator.
//
// Because this fetches whatever URL a visitor types in, it must never be able
// to reach private or internal addresses (SSRF). Every hop is checked:
//   - only http/https on the standard ports, no credentials in the URL
//   - the hostname is resolved here and every address must be public
//   - the request is then pinned to that exact address, so the name can't be
//     re-resolved to something internal between the check and the connection
//   - redirects are followed manually and each one is checked again
//   - time and size are capped

export class AuditFetchError extends Error {
  constructor(message, status = 400) {
    super(message)
    this.status = status
  }
}

const USER_AGENT =
  'Mozilla/5.0 (compatible; ChaufalTechAuditBot/1.0; +https://www.chaufaltech.com/tools/seo-geo-calculator)'
const MAX_REDIRECTS = 5

function isPrivateIPv4(ip) {
  const [a, b, c] = ip.split('.').map(Number)
  return (
    a === 0 || // "this" network
    a === 10 ||
    a === 127 || // loopback
    (a === 100 && b >= 64 && b <= 127) || // carrier-grade NAT
    (a === 169 && b === 254) || // link-local, cloud metadata
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) || // IETF protocol assignments
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) || // benchmarking
    (a === 192 && b === 0 && c === 2) || // TEST-NET
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224 // multicast + reserved
  )
}

function isPrivateIPv6(ip) {
  const l = ip.toLowerCase()
  if (l === '::' || l === '::1') return true
  if (l.startsWith('::ffff:')) {
    // IPv4-mapped: only allow if it is a dotted, public IPv4 address.
    const v4 = l.slice(7)
    return net.isIPv4(v4) ? isPrivateIPv4(v4) : true
  }
  return (
    /^f[cd]/.test(l) || // fc00::/7 unique local
    /^fe[89ab]/.test(l) || // fe80::/10 link-local
    l.startsWith('ff') || // multicast
    l.startsWith('2001:db8') || // documentation
    l.startsWith('64:ff9b') // NAT64
  )
}

export function isPrivateAddress(ip) {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip)
  if (net.isIPv6(ip)) return isPrivateIPv6(ip)
  return true
}

// Validates a URL and returns { url, ip, family } for a public destination.
export async function resolvePublicTarget(raw) {
  let url
  try {
    url = new URL(raw)
  } catch {
    throw new AuditFetchError('That does not look like a valid URL.')
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    throw new AuditFetchError('Only http:// and https:// URLs can be audited.')
  }
  if (url.username || url.password) {
    throw new AuditFetchError('URLs with a username or password are not supported.')
  }
  const defaultPort = url.protocol === 'https:' ? '443' : '80'
  if (url.port && url.port !== defaultPort) {
    throw new AuditFetchError('Only standard web ports (80 and 443) are supported.')
  }

  const host = url.hostname.replace(/^\[|\]$/g, '')
  const lowered = host.toLowerCase()
  if (lowered === 'localhost' || lowered.endsWith('.localhost') || lowered.endsWith('.local') || lowered.endsWith('.internal')) {
    throw new AuditFetchError('That address is not publicly reachable.')
  }

  if (net.isIP(host)) {
    if (isPrivateAddress(host)) throw new AuditFetchError('That address is not publicly reachable.')
    return { url, ip: host, family: net.isIPv6(host) ? 6 : 4 }
  }

  let addresses
  try {
    addresses = await dns.lookup(host, { all: true, verbatim: true })
  } catch {
    throw new AuditFetchError('We could not find that website. Check the address and try again.')
  }
  if (!addresses.length || addresses.some((a) => isPrivateAddress(a.address))) {
    throw new AuditFetchError('That address is not publicly reachable.')
  }
  const pick = addresses.find((a) => a.family === 4) || addresses[0]
  return { url, ip: pick.address, family: pick.family }
}

const MAX_DECODED_BYTES = 8 * 1024 * 1024

// Decompresses at most `limit` bytes, so a small compressed response can't
// balloon into gigabytes in memory. Corrupt or cut-off data just yields
// whatever could be read.
function decodeLimited(buffer, encoding, limit) {
  const enc = (encoding || '').toLowerCase()
  const make =
    enc === 'gzip' || enc === 'x-gzip'
      ? zlib.createGunzip
      : enc === 'deflate'
        ? zlib.createInflate
        : enc === 'br'
          ? zlib.createBrotliDecompress
          : null

  if (!make) {
    return Promise.resolve({ body: buffer.length > limit ? buffer.subarray(0, limit) : buffer, truncated: buffer.length > limit })
  }

  return new Promise((resolve) => {
    const stream = make()
    const chunks = []
    let size = 0
    let truncated = false
    let settled = false
    const finish = () => {
      if (settled) return
      settled = true
      resolve({ body: Buffer.concat(chunks), truncated })
    }
    stream.on('data', (chunk) => {
      size += chunk.length
      if (size > limit) {
        truncated = true
        chunks.push(chunk.subarray(0, chunk.length - (size - limit)))
        stream.destroy()
        finish()
        return
      }
      chunks.push(chunk)
    })
    stream.on('end', finish)
    stream.on('error', finish)
    stream.on('close', finish)
    stream.end(buffer)
  })
}

// One HTTP request, pinned to an already-validated IP. Exported for testing.
export function requestPinned(url, ip, family, { maxBytes, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const lib = url.protocol === 'https:' ? https : http
    const req = lib.request(
      {
        protocol: url.protocol,
        host: url.hostname.replace(/^\[|\]$/g, ''),
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: `${url.pathname}${url.search}`,
        method: 'GET',
        agent: false,
        timeout: timeoutMs,
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,text/plain;q=0.8,*/*;q=0.5',
          'Accept-Language': 'en',
          'Accept-Encoding': 'gzip, deflate, br',
        },
        // Connect to the validated address, whatever the name resolves to now.
        lookup: (_host, options, cb) =>
          options && options.all ? cb(null, [{ address: ip, family }]) : cb(null, ip, family),
      },
      (res) => {
        const chunks = []
        let size = 0
        let truncated = false
        res.on('data', (chunk) => {
          size += chunk.length
          if (size > maxBytes) {
            truncated = true
            res.destroy()
            return
          }
          chunks.push(chunk)
        })
        const finish = () => {
          const raw = Buffer.concat(chunks)
          decodeLimited(raw, res.headers['content-encoding'], MAX_DECODED_BYTES)
            .then(({ body, truncated: decodedTruncated }) =>
              resolve({
                status: res.statusCode || 0,
                statusText: res.statusMessage || '',
                headers: res.headers,
                body,
                truncated: truncated || decodedTruncated,
              })
            )
            .catch(reject)
        }
        res.on('end', finish)
        res.on('close', () => {
          if (truncated) finish()
        })
        res.on('error', () =>
          reject(new AuditFetchError('The website closed the connection before the page finished loading.', 502))
        )
      }
    )
    req.on('timeout', () => req.destroy(new AuditFetchError('The website took too long to respond.', 504)))
    req.on('error', (err) => {
      if (err instanceof AuditFetchError) return reject(err)
      reject(new AuditFetchError('We could not connect to that website.', 502))
    })
    req.end()
  })
}

function decodeText(buffer, contentType) {
  const match = /charset=([\w-]+)/i.exec(contentType || '')
  try {
    return new TextDecoder(match ? match[1] : 'utf-8').decode(buffer)
  } catch {
    return new TextDecoder('utf-8').decode(buffer)
  }
}

// Fetches a public URL (following validated redirects) and returns its text.
export async function safeGet(rawUrl, { maxBytes = 3 * 1024 * 1024, timeoutMs = 12000 } = {}) {
  let current = rawUrl
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    const { url, ip, family } = await resolvePublicTarget(current)
    const res = await requestPinned(url, ip, family, { maxBytes, timeoutMs })

    if ([301, 302, 303, 307, 308].includes(res.status) && res.headers.location) {
      current = new URL(res.headers.location, url).href
      continue
    }

    const contentType = String(res.headers['content-type'] || '')
    return {
      finalUrl: url.href,
      status: res.status,
      statusText: res.statusText,
      contentType,
      xRobotsTag: String(res.headers['x-robots-tag'] || ''),
      text: decodeText(res.body, contentType),
      truncated: res.truncated,
    }
  }
  throw new AuditFetchError('That page redirects too many times.', 502)
}

// The audit only needs the page's markup and its JSON-LD. Dropping other
// scripts and all <style> blocks removes most of the weight of modern pages
// (framework state blobs, inline CSS), which keeps the response well under
// Vercel's 4.5 MB limit without changing any result.
export function slimHtml(html) {
  return html
    .replace(/<script\b(?![^>]*\bapplication\/ld\+json)[^>]*>[\s\S]*?<\/script\s*>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '')
}