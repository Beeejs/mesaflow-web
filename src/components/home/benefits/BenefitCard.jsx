const BenefitCard = ({ title, description, icon }) => {
  return (
    <article className="benefit-card rounded-2xl border border-mesa-border bg-mesa-card p-6 transition duration-300 hover:border-mesa-primary/60 hover:shadow-xl hover:shadow-mesa-primary/10">
      <div className="benefit-content">
        <h3 className="text-xl font-bold text-mesa-text">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-6 text-mesa-muted">
          {description}
        </p>
      </div>

      <img
        src={icon}
        alt=""
        aria-hidden="true"
        className="benefit-icon"
      />
    </article>
  )
}

export default BenefitCard