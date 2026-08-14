export default function Panel({ as: Tag = 'div', className = '', color = 'text-orange/50', children, ...props }) {
  return (
    <Tag className={`panel ${color} ${className}`} {...props}>
      <span className="panel-tick-tr" aria-hidden />
      <span className="panel-tick-bl" aria-hidden />
      {children}
    </Tag>
  )
}
