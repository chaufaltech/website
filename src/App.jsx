import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CookieBanner from './components/CookieBanner.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Analytics from './components/Analytics.jsx'

// Site layout shared by every page. The pages themselves are defined in routes.jsx.
export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Skip link: first thing a keyboard user reaches with Tab. Hidden until focused. */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-navy focus:text-white focus:font-semibold focus:text-sm focus:px-5 focus:py-3 focus:rounded-lg focus:ring-2 focus:ring-orange"
      >
        Skip to main content
      </a>
      <ScrollToTop />
      <Analytics />
      <Navbar />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}