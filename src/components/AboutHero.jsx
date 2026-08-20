import Icon from './Icon.jsx'

// Floating isometric "tech blocks" around the logo mark — stand-in for a
// custom 3D render. Built from the existing icon set, no external assets.
const BLOCKS = [
  { icon: 'browser', top: '4%', left: '10%' },
  { icon: 'chart', top: '2%', right: '4%' },
  { icon: 'gear', top: '58%', left: '2%' },
  { icon: 'cloud', top: '55%', right: '8%' },
]

export default function AboutHero() {
  return (
    <div className="relative h-72 md:h-80" aria-hidden="true">
      <div className="absolute inset-0 bg-blueprint opacity-30 rounded-2xl [mask-image:radial-gradient(circle,black,transparent_75%)]" />

      {BLOCKS.map((b) => (
        <div
          key={b.icon}
          className="absolute w-14 h-14 rounded-xl bg-navy-light border border-white/10 shadow-lg flex items-center justify-center text-orange"
          style={{ top: b.top, left: b.left, right: b.right }}
        >
          <Icon name={b.icon} className="w-6 h-6" />
        </div>
      ))}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="w-28 h-28 rounded-2xl bg-navy border-2 border-orange shadow-2xl flex items-center justify-center">
          <img src="/logo/logo-icon.svg" alt="" className="w-14 h-14" />
        </div>
      </div>
    </div>
  )
}
