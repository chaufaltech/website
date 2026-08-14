import { Link } from 'react-router-dom'
import Panel from './Panel.jsx'

export default function CtaBanner({
  title = 'Ready to Solve Your Business Challenges?',
  subtitle = "Let's create the right digital solution for your business.",
}) {
  return (
    <section className="section py-16">
      <Panel
        color="text-navy/70"
        className="bg-orange rounded-xl2 px-8 py-10 md:px-14 md:py-12 flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="hidden sm:flex w-14 h-14 rounded-full bg-white/20 items-center justify-center shrink-0">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 12a9 9 0 1 1 9 9" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M12 8v4l3 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h3 className="font-display font-bold text-white text-2xl md:text-3xl">{title}</h3>
            <p className="text-white/85 mt-1">{subtitle}</p>
          </div>
        </div>
        <Link
          to="/contact"
          className="inline-flex items-center gap-2 bg-navy hover:bg-navy-light text-white font-semibold px-6 py-3.5 rounded-full transition-colors shrink-0"
        >
          Get in Touch <span aria-hidden>→</span>
        </Link>
      </Panel>
    </section>
  )
}
