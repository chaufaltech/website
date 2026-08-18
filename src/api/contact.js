import { createClient } from '@supabase/supabase-js'
import { Resend } from 'resend'

// Service-role key — server-side only, never exposed to the client bundle
// (that's why these aren't VITE_-prefixed). Set in Vercel project settings.
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { name, email, company, message } = req.body || {}

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' })
  }

  try {
    const { data, error } = await supabase
      .from('contact_submissions')
      .insert([{ name, email, company: company || null, message }])
      .select()
      .single()

    if (error) throw error

    // Notification email is best-effort — the submission is already saved
    // in Supabase above regardless of whether this succeeds.
    try {
      await resend.emails.send({
        // Swap this for an address on your own verified sending domain once
        // one is set up in Resend — onboarding@resend.dev only works for
        // testing / low volume.
        from: 'Chaufal Tech Website <onboarding@resend.dev>',
        to: process.env.CONTACT_NOTIFY_EMAIL,
        replyTo: email,
        subject: `New inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\n\n${message}`,
      })
    } catch (emailError) {
      console.error('Notification email failed (submission was still saved):', emailError)
    }

    return res.status(200).json({ success: true, id: data.id })
  } catch (err) {
    console.error('Contact form submission error:', err)
    return res.status(500).json({ error: 'Something went wrong. Please try again or email us directly.' })
  }
}
