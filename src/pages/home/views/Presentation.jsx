const Presentation = () => {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-mesa-primary/20 blur-3xl sm:h-80 sm:w-80 lg:h-96 lg:w-96" />
      <div className="absolute right-0 top-40 h-56 w-56 rounded-full bg-mesa-cyan/10 blur-3xl sm:h-64 sm:w-64 lg:top-32 lg:h-72 lg:w-72" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-14">
        <div>
          <div className="mb-5 inline-flex max-w-full rounded-full border border-mesa-primary/30 bg-mesa-primary/10 px-4 py-2 text-xs font-medium tracking-wide text-mesa-cyan-light sm:mb-6 sm:text-sm">
            Plataforma SaaS para restaurantes, bares y cervecerías
          </div>

          <h1 className="font-display max-w-3xl text-4xl font-bold tracking-tight text-mesa-text sm:text-5xl lg:text-6xl">
            Digitalizá la experiencia gastronómica con{' '}
            <span className="bg-linear-to-r from-mesa-primary to-mesa-cyan-light bg-clip-text text-transparent">
              MesaFlow
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-mesa-muted sm:mt-6 sm:text-lg sm:leading-8">
            Reservas, pedidos, menú digital, pagos y gestión del salón desde una
            única plataforma pensada para mejorar la experiencia del cliente y
            optimizar el trabajo del restaurante.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:mt-10 sm:flex-row sm:gap-4">
            <a
              href="#beneficios"
              className="w-full rounded-xl bg-mesa-primary px-6 py-3 text-center font-semibold text-white shadow-lg shadow-mesa-primary/25 transition hover:bg-mesa-primary-dark sm:w-auto"
            >
              Beneficios
            </a>

            <a
              href="#servicios"
              className="w-full rounded-xl border border-mesa-border bg-mesa-surface px-6 py-3 text-center font-semibold text-mesa-text transition hover:border-mesa-primary/60 sm:w-auto"
            >
              Ver servicios
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-mesa-border bg-mesa-surface/80 p-4 shadow-2xl shadow-mesa-primary/10 backdrop-blur sm:p-6">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan sm:text-sm">
                Nuestra propuesta
              </p>

              <h2 className="font-display mt-3 text-2xl font-bold text-mesa-text sm:text-3xl">
                Tecnología para restaurantes que quieren trabajar mejor
              </h2>

              <p className="mt-4 text-sm leading-6 text-mesa-muted sm:text-base sm:leading-7">
                MesaFlow conecta al cliente, el salón y la administración en una
                experiencia más simple, rápida y organizada.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-mesa-border bg-mesa-bg p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mesa-primary/15 text-sm font-semibold text-mesa-cyan">
                    01
                  </div>

                  <div>
                    <h3 className="font-semibold text-mesa-text">
                      Menos tiempos de espera
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-mesa-muted">
                      El cliente puede acceder al menú, hacer pedidos y solicitar
                      la cuenta desde su mesa.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-mesa-border bg-mesa-bg p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mesa-primary/15 text-sm font-semibold text-mesa-cyan">
                    02
                  </div>

                  <div>
                    <h3 className="font-semibold text-mesa-text">
                      Mayor organización interna
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-mesa-muted">
                      El establecimiento puede gestionar reservas, mesas,
                      pedidos, usuarios y pagos desde una única plataforma.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-mesa-border bg-mesa-bg p-4 sm:p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mesa-primary/15 text-sm font-semibold text-mesa-cyan">
                    03
                  </div>

                  <div>
                    <h3 className="font-semibold text-mesa-text">
                      Servicio más ágil y eficiente
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-mesa-muted">
                      Ideal para momentos de alta demanda, donde coordinar el
                      salón y la cocina se vuelve clave.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-mesa-primary/30 bg-mesa-primary/10 p-4 sm:p-5">
              <p className="text-sm font-medium leading-6 text-mesa-cyan-light">
                Primero conocemos tu establecimiento, revisamos tu solicitud y
                luego habilitamos el acceso a la plataforma.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Presentation