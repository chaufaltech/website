import { Resend } from 'resend'
import { appendContactSubmission } from './_lib/googleSheets.js'

// All credentials are server-side only; do not use VITE_-prefixed variables.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

// --- Basic rate limiting -----------------------------------------------------
// In-memory, per serverless instance: it stops casual spam and rapid-fire
// bots, but resets on cold starts and isn't shared across instances. For
// stronger protection, add Vercel's WAF rate limiting or Upstash Ratelimit.
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000
const hits = new Map()

function isRateLimited(ip) {
  const now = Date.now()

  // Drop expired entries so the map can't grow without bound.
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
    if (recent.length) hits.set(key, recent)
    else hits.delete(key)
  }

  const recent = hits.get(ip) || []
  if (recent.length >= RATE_LIMIT_MAX) return true

  recent.push(now)
  hits.set(ip, recent)
  return false
}

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for']
  if (typeof forwarded === 'string' && forwarded) return forwarded.split(',')[0].trim()
  return req.socket?.remoteAddress || 'unknown'
}

// --- Validation helpers ------------------------------------------------------
function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

// Single-line fields must never contain line breaks (prevents email header
// injection and messy sheet rows).
function singleLine(value) {
  return value.replace(/[\r\n]+/g, ' ')
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Same-site requests only: the browser sends an Origin header on POSTs, and
// its host must match the host being served.
function isAllowedOrigin(req) {
  const origin = req.headers.origin
  if (!origin) return true // non-browser clients; still subject to the checks below
  try {
    return new URL(origin).host === req.headers.host
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!isAllowedOrigin(req)) {
    return res.status(403).json({ error: 'Forbidden' })
  }

  // Honeypot: real visitors never see this field. Pretend success so bots
  // don't learn they were caught, but save and send nothing.
  if (cleanText(req.body?.website)) {
    return res.status(200).json({ success: true })
  }

  if (isRateLimited(getClientIp(req))) {
    res.setHeader('Retry-After', String(RATE_LIMIT_WINDOW_MS / 1000))
    return res.status(429).json({ error: 'Too many submissions. Please try again in a few minutes.' })
  }

  const name = singleLine(cleanText(req.body?.name))
  const email = singleLine(cleanText(req.body?.email))
  const company = singleLine(cleanText(req.body?.company))
  const message = cleanText(req.body?.message)

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }

  if (name.length > 200 || email.length > 320 || company.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'One or more fields are too long.' })
  }

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' })
  }

  try {
    const submission = await appendContactSubmission({ name, email, company, message })

    // Notification email is best-effort; the submission is already saved.
    if (resend && process.env.CONTACT_NOTIFY_EMAIL) {
      try {
        await resend.emails.send({
          // Replace this after configuring your own verified Resend domain.
          from: 'Chaufal Tech Website <onboarding@resend.dev>',
          to: process.env.CONTACT_NOTIFY_EMAIL,
          replyTo: email,
          subject: `New inquiry from ${name}`,
          // Plain text on purpose. If you switch to `html`, escape every
          // user-supplied value first.
          text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || '-'}\n\n${message}`,
        })
      } catch (emailError) {
        console.error('Notification email failed (submission was still saved):', emailError)
      }
    }

    return res.status(200).json({ success: true, id: submission.id })
  } catch (error) {
    console.error('Contact form submission error:', error)
    return res.status(500).json({ error: 'Something went wrong. Please try again or email us directly.' })
  }
}