import { useState } from 'react'
import Icon from './Icon.jsx'

// Accordion where only one answer is open at a time: opening a question closes
// the one that was open, and clicking an open question closes it. Built on
// <details>/<summary>, so it keeps native keyboard and screen-reader behaviour.
// All answers start closed, so the pre-built HTML and the browser agree.
export default function FaqList({ items, className = '', itemClassName = '' }) {
  const [openIndex, setOpenIndex] = useState(null)

  return (
    <div className={className}>
      {items.map((item, i) => {
        const open = openIndex === i
        return (
          <details key={item.q} open={open} className={`border border-black/10 bg-white rounded-lg ${itemClassName}`}>
            <summary
              onClick={(e) => {
                e.preventDefault() // we control open/closed, so the browser doesn't toggle it as well
                setOpenIndex(open ? null : i)
              }}
              className="flex items-center justify-between gap-4 cursor-pointer list-none px-4 py-3.5 text-sm text-ink/80 [&::-webkit-details-marker]:hidden"
            >
              {item.q}
              <Icon
                name="chevron"
                className={`w-4 h-4 text-muted shrink-0 transition-transform ${open ? '-rotate-90' : 'rotate-90'}`}
                strokeWidth={2}
              />
            </summary>
            <p className="px-4 pb-4 text-sm text-muted leading-relaxed">{item.a}</p>
          </details>
        )
      })}
    </div>
  )
}
