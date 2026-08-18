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
              We may collect information you provide directly, such as your name, email
              address, phone number, and company details when you fill out a contact
              form or request a proposal. We also collect usage data automatically —
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
              Google Analytics uses cookies to collect anonymized usage data. You can
              opt out of Google Analytics tracking using browser extensions such as the
              Google Analytics Opt-out Browser Add-on, or by adjusting your browser&apos;s
              cookie settings.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Data Sharing</h2>
            <p>
              We do not sell your personal information. We may share information with
              trusted third-party service providers (such as hosting or email
              providers) solely to operate our business, and only to the extent
              necessary for them to perform their services.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Your Rights</h2>
            <p>
              You may request access to, correction of, or deletion of your personal
              information at any time by contacting us at{' '}
              <a href="mailto:hello@chaufaltech.com" className="text-orange font-medium">
                hello@chaufaltech.com
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
              <a href="mailto:hello@chaufaltech.com" className="text-orange font-medium">
                hello@chaufaltech.com
              </a>.
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
