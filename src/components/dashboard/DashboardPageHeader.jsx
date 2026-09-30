const DashboardPageHeader = ({
  eyebrow,
  title,
  description,
  action = null,
}) => {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-4 break-words font-display text-3xl font-bold text-mesa-text sm:text-4xl">
          {title}
        </h2>

        {description && (
          <p className="mt-4 max-w-2xl text-base leading-7 text-mesa-muted">
            {description}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  )
}

export default DashboardPageHeader