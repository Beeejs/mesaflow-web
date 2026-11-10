
const DashboardTabs = ({
  tabs = [],
  value,
  onChange,
  ariaLabel = 'Secciones',
  className = '',
}) => {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`flex gap-6 border-b border-white/10 ${className}`}
    >
      {tabs.map((tab) => {
        const selected = value === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(tab.id)}
            className={`-mb-px shrink-0 border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
              selected
                ? 'border-mesa-cyan-light text-mesa-text'
                : 'border-transparent text-mesa-muted hover:text-mesa-text'
            }`}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

export default DashboardTabs
