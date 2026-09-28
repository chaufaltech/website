import PageHero from '../components/PageHero.jsx'

export default function PrivacyPolicy() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last updated: August 2026"
      />

      <section className="section py-20">
        <div className="max-w-3xl mx-auto space-y-12 text-ink/80 leading-relaxed">
          <p>
            This Privacy Policy describes how Chaufal Tech (&quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;) collects, uses, and protects information when you visit
            chaufaltech.com or engage us for services. Placeholder content — replace
            with your finalized policy before launch.
          </p>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Information We Collect</h2>
            <p>
              When you fill out our contact form, we collect the information you
              provide: your name, email address, company name (optional), and the
              message you write. We also collect usage data automatically —
              pages visited, time on site, and general location — via analytics tools
              like Google Analytics.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">How We Use Your Information</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>To respond to inquiries and provide requested services</li>
              <li>To improve our website and understand how visitors use it</li>
              <li>To send project updates, proposals, or invoices related to work we do together</li>
              <li>To comply with legal obligations</li>
            </ul>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Cookies &amp; Analytics</h2>
            <p>
              We use Google Analytics to understand site traffic and usage patterns.
              Google Analytics uses cookies to collect usage data. These analytics
              cookies are only set if you click &quot;Accept&quot; in our cookie banner;
              until then, Google Analytics is not loaded. You can change your choice at
              any time using &quot;Cookie Settings&quot; in the footer of any page, and
              declining or withdrawing consent removes the analytics cookies we have
              set. You can also block cookies in your browser settings or use the Google
              Analytics Opt-out Browser Add-on.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Data Sharing</h2>
            <p>
              We do not sell your personal information. We share information with
              trusted third-party service providers solely to operate our business,
              and only to the extent necessary for them to perform their services.
              These providers currently include:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>
                <strong>Google Sheets (Google)</strong> — stores the details you submit
                through our contact form
              </li>
              <li>
                <strong>Resend</strong> — delivers the notification email we receive when
                you submit the contact form
              </li>
              <li>
                <strong>Google Analytics (Google)</strong> — provides anonymized website
                usage statistics
              </li>
              <li>
                <strong>Vercel</strong> — hosts this website and processes technical
                request data such as IP addresses
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal
              information at any time by contacting us at{' '}
              <a href="mailto:chaufaltech@gmail.com" className="text-orange font-medium">
                chaufaltech@gmail.com
              </a>.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be
              posted on this page with an updated revision date.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Contact Us</h2>
            <p>
              Questions about this policy? Reach us at{' '}
              <a href="mailto:chaufaltech@gmail.com" className="text-orange font-medium">
                chaufaltech@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}