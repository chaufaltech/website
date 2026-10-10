// Single source of truth for site-wide SEO values.
export const SITE_URL = 'https://www.chaufaltech.com'
export const SITE_NAME = 'Chaufal Tech'

// Used when a page doesn't set its own share image. Ideally replace this with a
// dedicated 1200 x 630 image (e.g. /images/og-default.png) — social networks
// crop wide hero artwork unpredictably.
export const DEFAULT_OG_IMAGE = '/images/home-hero-image.png'

export const SOCIAL_PROFILES = [
  'https://www.instagram.com/chaufaltech',
  'https://x.com/chaufaltech',
  'https://www.threads.com/@chaufaltech',
  'https://www.linkedin.com/in/chaufaltech',
  'https://www.youtube.com/@ChaufalTech',
]

export const ORGANIZATION_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/logo/logo-icon.svg`,
  email: 'chaufaltech@gmail.com',
  sameAs: SOCIAL_PROFILES,
}

export const WEBSITE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: `${SITE_URL}/`,
}

export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}
