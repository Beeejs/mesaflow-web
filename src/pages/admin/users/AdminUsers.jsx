const AdminUsers = () => {
  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Usuarios
          </p>

          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
            Administración de usuarios
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-mesa-muted">
            Gestioná los usuarios globales registrados en MesaFlow.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-6">
        <p className="text-sm text-mesa-muted">
          Próximo paso: conectar esta vista con el endpoint de usuarios.
        </p>
      </div>
    </section>
  )
}

export default AdminUsers