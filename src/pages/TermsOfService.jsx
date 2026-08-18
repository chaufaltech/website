import PageHero from '../components/PageHero.jsx'

export default function TermsOfService() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Last updated: August 2026"
      />

      <section className="section py-20">
        <div className="max-w-3xl mx-auto space-y-12 text-ink/80 leading-relaxed">
          <p>
            These Terms of Service (&quot;Terms&quot;) govern your use of
            chaufaltech.com and any services provided by Chaufal Tech. By using our
            website or engaging our services, you agree to these Terms. Placeholder
            content — replace with your finalized terms before launch.
          </p>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Services</h2>
            <p>
              Chaufal Tech provides website development, automation and integration
              services, digital modernization, and technology consulting. The specific
              scope, timeline, and cost of any engagement will be defined in a separate
              proposal or contract agreed upon by both parties.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Use of This Website</h2>
            <p>
              You agree to use this website only for lawful purposes and in a way that
              does not infringe the rights of, or restrict or inhibit the use of, this
              site by anyone else. Content on this site — including text, graphics,
              logos, and design — is the property of Chaufal Tech unless otherwise
              noted, and may not be reproduced without permission.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Project Engagements</h2>
            <p>
              Any paid engagement with Chaufal Tech is governed by a separate signed
              proposal, statement of work, or contract, which will detail deliverables,
              payment terms, timelines, and intellectual property ownership specific to
              that project.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Limitation of Liability</h2>
            <p>
              Chaufal Tech provides this website &quot;as is&quot; without warranties of any
              kind. We are not liable for any indirect, incidental, or consequential
              damages arising from your use of this website or our services, to the
              fullest extent permitted by law.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Third-Party Links</h2>
            <p>
              This site may contain links to third-party websites. We are not
              responsible for the content, accuracy, or practices of those external
              sites.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Changes to These Terms</h2>
            <p>
              We may revise these Terms from time to time. Continued use of the site
              after changes are posted constitutes acceptance of the updated Terms.
            </p>
          </div>

          <div>
            <h2 className="font-display font-semibold text-xl text-ink mb-3">Contact Us</h2>
            <p>
              Questions about these Terms? Reach us at{' '}
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
