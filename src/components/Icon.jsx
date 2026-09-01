const PATHS = {
  network: (
    <>
      <circle cx="12" cy="12" r="2.2" />
      <circle cx="4.5" cy="6" r="1.8" />
      <circle cx="19.5" cy="6" r="1.8" />
      <circle cx="4.5" cy="18" r="1.8" />
      <circle cx="19.5" cy="18" r="1.8" />
      <path d="M9.9 10.6 6 7.4M14.1 10.6 18 7.4M9.9 13.4 6 16.6M14.1 13.4 18 16.6" />
    </>
  ),
  'monitor-trend': (
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M5.5 13.5 9 10l2.5 2.5L18.5 6" strokeWidth="1.6" />
    </>
  ),
  puzzle: (
    <path d="M9.4 3a1.6 1.6 0 0 1 3.2 0v.6a1.4 1.4 0 0 0 1.9 1.3 1.6 1.6 0 0 1 2.1 1.5v2.1a1.4 1.4 0 0 0 1.4 1.4h.6a1.6 1.6 0 0 1 0 3.2h-.6a1.4 1.4 0 0 0-1.4 1.4v2.1a1.6 1.6 0 0 1-2.1 1.5 1.4 1.4 0 0 0-1.9 1.3v.6a1.6 1.6 0 0 1-3.2 0v-.6a1.4 1.4 0 0 0-1.9-1.3 1.6 1.6 0 0 1-2.1-1.5v-2.1A1.4 1.4 0 0 0 4 12.8a1.6 1.6 0 0 1 0-3.2h1.4a1.4 1.4 0 0 0 1.4-1.4V6.1a1.6 1.6 0 0 1 2.1-1.5 1.4 1.4 0 0 0 1.9-1.3V3z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.36a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.64 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.64 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.64a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.36 9c.14.5.5.9 1 1.09.19.07.39.11.6.11H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1z" />
    </>
  ),
  cloud: (
    <>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
    </>
  ),
  chart: (
    <>
      <path d="M3 3v18h18" />
      <path d="M7 15l4-4 3 3 5-6" />
    </>
  ),
  check: <path d="M20 6 9 17l-5-5" />,
  headset: (
    <>
      <path d="M3 14v-2a9 9 0 0 1 18 0v2" />
      <path d="M21 14a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2z" />
      <path d="M3 14a2 2 0 0 0 2 2h1v-6H5a2 2 0 0 0-2 2z" />
    </>
  ),
  target: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1" />
    </>
  ),
  users: (
    <>
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  smile: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 14s1.5 2 4 2 4-2 4-2" />
      <line x1="9" y1="9" x2="9.01" y2="9" />
      <line x1="15" y1="9" x2="15.01" y2="9" />
    </>
  ),
  chevron: <polyline points="9 6 15 12 9 18" />,
  monitor: (
    <>
      <rect x="2" y="4" width="20" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </>
  ),
  database: (
    <>
      <ellipse cx="12" cy="5" rx="8" ry="3" />
      <path d="M4 5v14c0 1.66 3.58 3 8 3s8-1.34 8-3V5" />
      <path d="M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z" />
    </>
  ),
  shield: <path d="M12 2 4 5v6c0 5.2 3.4 9.4 8 11 4.6-1.6 8-5.8 8-11V5l-8-3z" />,
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </>
  ),
  rocket: (
    <>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 19 2c0 2.52-.99 8.99-9 13z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </>
  ),
  browser: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M2 8h20" />
      <path d="M6 6h.01" />
    </>
  ),
  smartphone: (
    <>
      <rect x="6" y="2" width="12" height="20" rx="2" />
      <path d="M9.5 15.5l2 2 4-4" strokeWidth="1.6" />
      <path d="M11 5.5h2" />
    </>
  ),
  briefcase: (
    <>
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M2 13h20" />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8" r="6" />
      <path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" />
    </>
  ),
  'shield-check': (
    <>
      <path d="M12 2 4 5v6c0 5.2 3.4 9.4 8 11 4.6-1.6 8-5.8 8-11V5l-8-3z" />
      <path d="M9 12l2 2 4-4" strokeWidth="1.8" />
    </>
  ),
  message: (
    <path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  ),
  handshake: (
    <>
      <path d="M11 17l-3-3-4 4" />
      <path d="M8 14l4.5-4.5a2.12 2.12 0 0 1 3 3L13 15" />
      <path d="M13 15l1.5 1.5a2.12 2.12 0 0 0 3-3L15 11l3-3" />
      <path d="M2 13l4 4" />
      <path d="M18 8l4 4-4 4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </>
  ),
  play: <path d="M7 4l13 8-13 8V4z" />,
  upload: (
    <>
      <path d="M12 3v12" />
      <path d="M7 8l5-5 5 5" />
      <path d="M4 15v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
    </>
  ),
  'cloud-upload': (
    <>
      <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
      <path d="M12 20v-6M9 17l3-3 3 3" />
    </>
  ),
  building: (
    <>
      <rect x="4" y="3" width="10" height="18" rx="1" />
      <rect x="14" y="9" width="6" height="12" rx="1" />
      <path d="M7 7h1M7 11h1M7 15h1M10.5 7h1M10.5 11h1M10.5 15h1" />
      <path d="M17 13h.01M17 17h.01" />
    </>
  ),
}

export default function Icon({ name, className = 'w-6 h-6', strokeWidth = 1.8 }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {PATHS[name] || PATHS.check}
    </svg>
  )
}