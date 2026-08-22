const ServiceCard = ({ number, title, description }) => {
  return (
    <article className="group rounded-3xl border border-mesa-border bg-mesa-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-mesa-primary/60 hover:bg-mesa-card hover:shadow-2xl hover:shadow-mesa-primary/10">
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-mesa-primary/15 text-sm font-bold text-mesa-cyan-light transition group-hover:bg-mesa-primary group-hover:text-white">
        {number}
      </div>

      <h3 className="text-xl font-bold text-mesa-text">
        {title}
      </h3>

      <p className="mt-4 text-sm leading-6 text-mesa-muted">
        {description}
      </p>
    </article>
  )
}

export default ServiceCard