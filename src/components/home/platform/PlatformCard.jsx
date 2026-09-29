const PlatformCard = ({ title, description, tag, icon }) => {
  return (
    <article className="rounded-2xl border border-mesa-border bg-mesa-bg p-5 transition duration-300 hover:border-mesa-primary/60 hover:bg-mesa-card">
      <div className="flex items-start justify-between gap-4">
        <div className="mb-4 inline-flex rounded-full bg-mesa-primary/10 px-3 py-1 text-xs font-semibold text-mesa-cyan-light">
          {tag}
        </div>

        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className="h-12 w-12 shrink-0"
        />
      </div>

      <h3 className="text-lg font-bold text-mesa-text">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-mesa-muted">
        {description}
      </p>
    </article>
  )
}

export default PlatformCard