const Presentation = () => {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden px-6 py-24"
    >
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-mesa-primary/20 blur-3xl" />
      <div className="absolute right-0 top-32 h-72 w-72 rounded-full bg-mesa-cyan/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <div className="mb-6 inline-flex rounded-full border border-mesa-primary/30 bg-mesa-primary/10 px-4 py-2 text-sm font-medium tracking-wide text-mesa-cyan-light">
            Plataforma SaaS para restaurantes, bares y cervecerías
          </div>

          <h1 className="font-display max-w-3xl text-5xl font-bold tracking-tight md:text-6xl">
            Digitalizá la experiencia gastronómica con{' '}
            <span className="bg-linear-to-r from-mesa-primary to-mesa-cyan-light bg-clip-text text-transparent">
              MesaFlow
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-mesa-muted">
            Reservas, pedidos, menú digital, pagos y gestión del salón desde una
            única plataforma pensada para mejorar la experiencia del cliente y
            optimizar el trabajo del restaurante.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#registro"
              className="rounded-xl bg-mesa-primary px-6 py-3 text-center font-semibold text-white shadow-lg shadow-mesa-primary/25 transition hover:bg-mesa-primary-dark"
            >
              Registrarse
            </a>

            <a
              href="#servicios"
              className="rounded-xl border border-mesa-border bg-mesa-surface px-6 py-3 text-center font-semibold text-mesa-text transition hover:border-mesa-primary/60"
            >
              Ver servicios
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="rounded-3xl border border-mesa-border bg-mesa-surface/80 p-6 shadow-2xl shadow-mesa-primary/10 backdrop-blur">
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
                Nuestra propuesta
              </p>

              <h2 className="font-display mt-3 text-3xl font-bold">
                Tecnología para restaurantes que quieren trabajar mejor
              </h2>

              <p className="mt-4 text-mesa-muted">
                MesaFlow conecta al cliente, el salón y la administración en una
                experiencia más simple, rápida y organizada.
              </p>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-mesa-border bg-mesa-bg p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mesa-primary/15 text-mesa-cyan">
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

              <div className="rounded-2xl border border-mesa-border bg-mesa-bg p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mesa-primary/15 text-mesa-cyan">
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

              <div className="rounded-2xl border border-mesa-border bg-mesa-bg p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mesa-primary/15 text-mesa-cyan">
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

            <div className="mt-6 rounded-2xl border border-mesa-primary/30 bg-mesa-primary/10 p-5">
              <p className="text-sm font-medium text-mesa-cyan-light">
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