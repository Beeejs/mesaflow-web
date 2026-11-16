const dotColors = {
  green: 'bg-green-500',
  orange: 'bg-orange-500',
  red: 'bg-red-500',
  cyan: 'bg-cyan-400',
}

const DashboardSummaryCard = ({
  label,
  value,
  dot,
  active = false,
  onClick,
  children,
}) => {
  const Tag = onClick ? 'button' : 'article'

  return (
    <Tag
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      aria-pressed={onClick ? active : undefined}
      className={`rounded-2xl border px-6 py-5 text-left transition ${
        active
          ? 'border-mesa-primary bg-mesa-primary/10'
          : 'border-mesa-border bg-mesa-surface'
      } ${
        onClick
          ? 'cursor-pointer hover:border-mesa-primary/50'
          : ''
      }`}
    >
      <p className="flex items-center gap-2 text-sm font-medium text-mesa-muted">
        {dot && (
          <span
            className={`h-2 w-2 rounded-full ${dotColors[dot]}`}
          />
        )}

        {label}
      </p>

      {children ?? (
        <p className="font-display mt-2 text-3xl font-bold text-mesa-text">
          {value}
        </p>
      )}
    </Tag>
  )
}

export default DashboardSummaryCard
