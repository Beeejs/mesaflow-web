const AdminEstablishments = () => {
  return (
    <section>
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
          Establecimientos
        </p>

        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
          Administración de establecimientos
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-mesa-muted">
          Consultá los establecimientos registrados y sus usuarios asociados.
        </p>
      </div>

      <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-6">
        <p className="text-sm text-mesa-muted">
          Próximo paso: conectar esta vista con el módulo de establecimientos.
        </p>
      </div>
    </section>
  )
}

export default AdminEstablishments