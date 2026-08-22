import { platformList } from '../../../constants/constants.js'

/* Components */
import PlatformCard from '../../../components/platform/PlatformCard.jsx'
import PlatformMetrics from '../../../components/platform/PlatformMetrics.jsx'

const Platform = () => {
  return (
    <section
      id="plataforma"
      className="relative overflow-hidden border-t border-mesa-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="absolute left-1/2 top-20 h-64 w-64 -translate-x-1/2 rounded-full bg-mesa-primary/10 blur-3xl sm:h-80 sm:w-80 lg:h-96 lg:w-96" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan sm:text-sm">
            Plataforma
          </p>

          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl md:text-5xl">
            Una solución completa para conectar al cliente con el restaurante
          </h2>

          <p className="mt-5 text-base leading-7 text-mesa-muted sm:text-lg sm:leading-8">
            MesaFlow integra herramientas para la experiencia del cliente y para
            la gestión interna del establecimiento, permitiendo trabajar desde
            una misma plataforma.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:mt-14 lg:grid-cols-3 lg:gap-6">
          {platformList.map((item) => (
            <PlatformCard
              key={item.title}
              tag={item.tag}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-mesa-border bg-mesa-surface p-5 shadow-2xl shadow-mesa-primary/10 sm:mt-12 sm:p-6 lg:mt-14">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan sm:text-sm">
                Panel centralizado
              </p>

              <h3 className="font-display mt-4 text-2xl font-bold text-mesa-text sm:text-3xl">
                Todo el flujo gastronómico en un solo lugar
              </h3>

              <p className="mt-4 text-sm leading-6 text-mesa-muted sm:text-base sm:leading-7">
                Desde la reserva hasta el pedido y la administración del salón,
                MesaFlow permite ordenar la operación diaria y mejorar la toma
                de decisiones.
              </p>
            </div>

            <PlatformMetrics />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Platform