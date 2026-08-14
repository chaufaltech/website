export default function HeroGraphic() {
  const dots = [
    [70, 15], [230, 8], [30, 90], [255, 70], [15, 200], [265, 210],
    [45, 300], [240, 320], [90, 30], [190, 340], [10, 150], [270, 150],
  ]

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <svg viewBox="0 0 280 280" className="w-full h-full">
        <defs>
          <clipPath id="globeClip">
            <circle cx="140" cy="140" r="120" />
          </clipPath>
        </defs>

        {/* outer ring */}
        <circle cx="140" cy="140" r="120" fill="none" stroke="#F2762E" strokeOpacity="0.35" strokeWidth="1" />

        {/* dotted globe fill */}
        <g clipPath="url(#globeClip)">
          <rect x="20" y="20" width="240" height="240" fill="#131B3A" />
          {Array.from({ length: 14 }).map((_, row) =>
            Array.from({ length: 24 }).map((_, col) => {
              const x = 20 + col * 10.4
              const y = 20 + row * 17.2
              const isOrange = (row + col) % 7 === 0
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={x}
                  cy={y}
                  r={0.9}
                  fill={isOrange ? '#F2762E' : '#3B4A7A'}
                  opacity={isOrange ? 0.8 : 0.5}
                />
              )
            })
          )}
          {/* latitude/longitude arcs for a globe feel */}
          <ellipse cx="140" cy="140" rx="120" ry="45" fill="none" stroke="#3B82F6" strokeOpacity="0.25" />
          <ellipse cx="140" cy="140" rx="120" ry="90" fill="none" stroke="#3B82F6" strokeOpacity="0.2" />
          <ellipse cx="140" cy="140" rx="60" ry="120" fill="none" stroke="#3B82F6" strokeOpacity="0.2" />
        </g>

        {/* circuit lines radiating out */}
        <g stroke="#F2762E" strokeOpacity="0.5" strokeWidth="1" fill="none">
          <path d="M40 60 L15 60 L15 30" />
          <path d="M235 50 L262 50 L262 20" />
          <path d="M30 190 L8 190 L8 220" />
          <path d="M245 200 L268 200 L268 235" />
          <path d="M140 260 L140 275" />
        </g>

        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 3 : 2} fill={i % 2 === 0 ? '#F2762E' : '#60A5FA'} opacity="0.85" />
        ))}
      </svg>

      {/* Banner ribbon overlay */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[112%]">
        <div className="relative">
          <div className="absolute -left-3 top-0 bottom-0 w-4 bg-navy border-y border-orange/70" style={{ clipPath: 'polygon(100% 0, 0 50%, 100% 100%)' }} />
          <div className="border-y border-orange/70 bg-navy/95 py-3 px-4 text-center">
            <p className="font-display font-semibold text-white text-sm sm:text-base leading-snug">
              Digital Solutions That Drive Growth
            </p>
          </div>
          <div className="absolute -right-3 top-0 bottom-0 w-4 bg-navy border-y border-orange/70" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }} />
        </div>
      </div>
    </div>
  )
}
