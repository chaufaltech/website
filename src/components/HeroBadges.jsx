import { SERVICES } from '../data/content.js'
import Icon from './Icon.jsx'

// Three-tier left% per viewport range so the ellipse shape never runs off
// the right edge as the container narrows:
//   640–1023px  (stacked, full-width container): furthest left
//   1024–1349px (side-by-side, narrower column):  10pts right of that
//   1350px+     (side-by-side, roomier column):    original dialed-in values
const SPOTS = [
  { top: '10%', left: 'left-[20%] lg:left-[30%] min-[1350px]:left-[40%]', float: 'animate-float-a' }, // Websites & Web Applications
  { top: '35%', left: 'left-[73%] lg:left-[83%] min-[1350px]:left-[93%]', float: 'animate-float-b' }, // Automation & Integrations
  { top: '90%', left: 'left-[73%] lg:left-[83%] min-[1350px]:left-[93%]', float: 'animate-float-c' }, // Digital Modernization
  { top: '67%', left: 'left-[21%] lg:left-[31%] min-[1350px]:left-[41%]', float: 'animate-float-d' }, // Technology Consulting
]

export default function HeroBadges() {
  const items = SERVICES.slice(0, 4)

  return (
    <div className="relative hidden sm:block h-[460px] lg:h-[520px]" aria-hidden="true">
      {items.map((service, i) => {
        const spot = SPOTS[i]
        return (
          <div
            key={service.slug}
            className={`absolute max-w-[210px] -translate-x-1/2 -translate-y-1/2 ${spot.left}`}
            style={{ top: spot.top }}
          >
            <div
              className={`${spot.float} flex items-center gap-3 bg-navy/85 backdrop-blur-md border border-orange/30 rounded-2xl shadow-xl px-4 py-3`}
            >
              <div className="w-10 h-10 rounded-full bg-orange/15 text-orange flex items-center justify-center shrink-0">
                <Icon name={service.icon} className="w-[18px] h-[18px]" />
              </div>
              <p className="font-display font-semibold text-sm text-white leading-snug">{service.title}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}