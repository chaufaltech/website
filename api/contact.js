import { Resend } from 'resend'
import { appendContactSubmission } from './lib/googleSheets.js'

// All credentials are server-side only; do not use VITE_-prefixed variables.
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

function cleanText(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const name = cleanText(req.body?.name)
  const email = cleanText(req.body?.email)
  const company = cleanText(req.body?.company)
  const message = cleanText(req.body?.message)

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }

  if (name.length > 200 || email.length > 320 || company.length > 200 || message.length > 5000) {
    return res.status(400).json({ error: 'One or more fields are too long.' })
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
