const ServiceCard = ({ title, description, image }) => {
  return (
    <article className="group overflow-hidden rounded-3xl border border-mesa-border bg-mesa-surface transition duration-300 hover:-translate-y-1 hover:border-mesa-primary/60 hover:bg-mesa-card hover:shadow-2xl hover:shadow-mesa-primary/10">
      <div className="aspect-[4/3] overflow-hidden border-b border-mesa-border">
        <img
          src={image}
          alt={title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-mesa-text">
          {title}
        </h3>

        <p className="mt-4 text-sm leading-6 text-mesa-muted">
          {description}
        </p>
      </div>
    </article>
  )
}

export default ServiceCard