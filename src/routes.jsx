import App from './App.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Services from './pages/Services.jsx'
import Solutions from './pages/Solutions.jsx'
import Tools from './pages/Tools.jsx'
import ImageOptimizer from './pages/ImageOptimizer.jsx'
import SeoGeoCalculator from './pages/SeoGeoCalculator.jsx'
import UrlMetadataExtractor from './pages/UrlMetadataExtractor.jsx'
import PdfToText from './pages/PdfToText.jsx'
import Guides from './pages/Guides.jsx'
import ImageOptimizationGuide from './pages/ImageOptimizationGuide.jsx'
import Process from './pages/Process.jsx'
import Contact from './pages/Contact.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsOfService from './pages/TermsOfService.jsx'
import NotFound from './pages/NotFound.jsx'

// `entry` tells the static-site generator which file each route's code lives in.
// The old /work URLs are redirected to /tools by the server (see vercel.json).
export const routes = [
  {
    path: '/',
    Component: App,
    entry: 'src/App.jsx',
    children: [
      { index: true, Component: Home, entry: 'src/pages/Home.jsx' },
      { path: 'about', Component: About, entry: 'src/pages/About.jsx' },
      { path: 'services', Component: Services, entry: 'src/pages/Services.jsx' },
      { path: 'solutions', Component: Solutions, entry: 'src/pages/Solutions.jsx' },
      { path: 'tools', Component: Tools, entry: 'src/pages/Tools.jsx' },
      { path: 'tools/image-optimizer', Component: ImageOptimizer, entry: 'src/pages/ImageOptimizer.jsx' },
      { path: 'tools/seo-geo-calculator', Component: SeoGeoCalculator, entry: 'src/pages/SeoGeoCalculator.jsx' },
      { path: 'tools/url-metadata-extractor', Component: UrlMetadataExtractor, entry: 'src/pages/UrlMetadataExtractor.jsx' },
      { path: 'tools/pdf-to-text-converter', Component: PdfToText, entry: 'src/pages/PdfToText.jsx' },
      { path: 'guides', Component: Guides, entry: 'src/pages/Guides.jsx' },
      { path: 'guides/image-optimization', Component: ImageOptimizationGuide, entry: 'src/pages/ImageOptimizationGuide.jsx' },
      { path: 'process', Component: Process, entry: 'src/pages/Process.jsx' },
      { path: 'contact', Component: Contact, entry: 'src/pages/Contact.jsx' },
      { path: 'privacy-policy', Component: PrivacyPolicy, entry: 'src/pages/PrivacyPolicy.jsx' },
      { path: 'terms-of-service', Component: TermsOfService, entry: 'src/pages/TermsOfService.jsx' },
      { path: '*', Component: NotFound, entry: 'src/pages/NotFound.jsx' },
    ],
  },
]
