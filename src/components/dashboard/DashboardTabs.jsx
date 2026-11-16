
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
      {tabs.map((tab, index) => {
        const selected = value === tab.id

        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            onKeyDown={(event) => {
              let next
              if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
              else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
              else if (event.key === 'Home') next = 0
              else if (event.key === 'End') next = tabs.length - 1
              else return
              event.preventDefault()
              onChange(tabs[next].id)
              event.currentTarget.parentElement.querySelectorAll('[role="tab"]')[next].focus()
            }}
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
