import { ViteReactSSG } from 'vite-react-ssg'
import { routes } from './routes.jsx'
import './index.css'

// vite-react-ssg renders every route to static HTML at build time, then
// hydrates it in the browser. `npm run dev` still runs as a normal SPA.
export const createRoot = ViteReactSSG({ routes })
