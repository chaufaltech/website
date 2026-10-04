import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import CookieBanner from './components/CookieBanner.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import Analytics from './components/Analytics.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Solutions from './pages/Solutions.jsx'
import Work from './pages/Work.jsx'
import ImageOptimizer from './pages/ImageOptimizer.jsx'
import ImageOptimizationGuide from './pages/ImageOptimizationGuide.jsx'
import Process from './pages/Process.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Analytics />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/work" element={<Work />} />
          <Route path="/tools/image-optimizer" element={<ImageOptimizer />} />
          {/* Old URL: keep working for anyone who bookmarked or linked it. */}
          <Route path="/work/image-optimizer" element={<Navigate to="/tools/image-optimizer" replace />} />
          <Route path="/guides/image-optimization" element={<ImageOptimizationGuide />} />
          <Route path="/process" element={<Process />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <CookieBanner />
    </div>
  )
}