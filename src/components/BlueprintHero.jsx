import Icon from './Icon.jsx'

const NODES = [
  { icon: 'globe', label: 'Websites', x: 90, y: 90 },
  { icon: 'gear', label: 'Automation', x: 350, y: 90 },
  { icon: 'cloud', label: 'Modernization', x: 90, y: 350 },
  { icon: 'chart', label: 'Consulting', x: 350, y: 350 },
]

const TICKS = Array.from({ length: 36 }).map((_, i) => i * 10)

export default function BlueprintHero() {
  return (
    <div className="relative w-full max-w-md mx-auto">
      <svg viewBox="0 0 440 440" className="w-full h-auto overflow-visible">
        {/* dial ring + tick marks, instrument-panel feel */}
        <circle cx="220" cy="220" r="168" fill="none" stroke="#FF7A00" strokeOpacity="0.18" strokeWidth="1" />
        <circle cx="220" cy="220" r="120" fill="none" stroke="#FF7A00" strokeOpacity="0.14" strokeWidth="1" strokeDasharray="2 6" />
        {TICKS.map((deg) => {
          const rad = (deg * Math.PI) / 180
          const long = deg % 90 === 0
          const r1 = 168
          const r2 = long ? 158 : 163
          const x1 = 220 + r1 * Math.cos(rad)
          const y1 = 220 + r1 * Math.sin(rad)
          const x2 = 220 + r2 * Math.cos(rad)
          const y2 = 220 + r2 * Math.sin(rad)
          return (
            <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FF7A00" strokeOpacity={long ? 0.55 : 0.22} strokeWidth={long ? 1.4 : 1} />
          )
        })}

        {/* orthogonal circuit traces from each node into the center hub */}
        {NODES.map((n, i) => {
          const midX = n.x
          const midY = 220
          return (
            <g key={`trace-${i}`} stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1.5" fill="none">
              <path d={`M${n.x} ${n.y} L${midX} ${midY} L220 220`} />
              <circle cx={n.x} cy={n.y} r="3" fill="#3B82F6" fillOpacity="0.7" />
            </g>
          )
        })}

        {/* central hub — the "solved" node */}
        <circle cx="220" cy="220" r="34" fill="#0D1B2A" stroke="#FF7A00" strokeWidth="1.5" />
        <circle cx="220" cy="220" r="34" fill="#FF7A00" fillOpacity="0.12" />
        <path d="M208 220l8 8 16-16" stroke="#FF7A00" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />

        {/* corner crop-mark brackets, echoing the panel signature */}
        {[[36, 36, 1, 1], [404, 36, -1, 1], [36, 404, 1, -1], [404, 404, -1, -1]].map(([x, y, dx, dy], i) => (
          <path
            key={i}
            d={`M${x} ${y + dy * 16} L${x} ${y} L${x + dx * 16} ${y}`}
            stroke="#FF7A00"
            strokeOpacity="0.5"
            strokeWidth="1.5"
            fill="none"
          />
        ))}

        {/* dimension-style annotation */}
        <text x="220" y="26" textAnchor="middle" fill="#FF7A00" fillOpacity="0.7" fontSize="10" fontFamily="JetBrains Mono, monospace" letterSpacing="1">
          SOLUTION MAP
        </text>
      </svg>

      {/* node labels, positioned to match the SVG node coordinates */}
      {NODES.map((n) => (
        <div
          key={n.label}
          className="absolute flex flex-col items-center gap-1.5 -translate-x-1/2 -translate-y-1/2"
          style={{ left: `${(n.x / 440) * 100}%`, top: `${(n.y / 440) * 100}%` }}
        >
          <div className="w-11 h-11 rounded-full border border-orange/40 bg-navy text-orange flex items-center justify-center shrink-0">
            <Icon name={n.icon} className="w-[18px] h-[18px]" />
          </div>
          <span className="font-mono text-[10px] tracking-wide uppercase text-white/60 whitespace-nowrap">{n.label}</span>
        </div>
      ))}
    </div>
  )
}
