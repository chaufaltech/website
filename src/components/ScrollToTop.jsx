import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  // New page: scroll to the top. Link with a #hash (e.g. /services#automation-integrations):
  // scroll to that section instead, since React Router doesn't do this itself.
  useEffect(() => {
    const id = hash ? decodeURIComponent(hash.slice(1)) : ''
    const target = id ? document.getElementById(id) : null

    if (target) target.scrollIntoView()
    else if (!hash) window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}