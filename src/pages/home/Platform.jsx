import { platformList } from '../../constants/constants.js'
/* Components */
import PlatformCard from '../../components/platform/PlatformCard.jsx'
import PlatformMetrics from '../../components/platform/PlatformMetrics.jsx'


const Platform = () => {
  return (
    <section
      id="plataforma"
      className="relative overflow-hidden border-t border-mesa-border px-6 py-24"
    >
      <div className="absolute left-1/2 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-mesa-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Plataforma
          </p>

          <h2 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Una solución completa para conectar al cliente con el restaurante
          </h2>

          <p className="mt-5 text-lg leading-8 text-mesa-muted">
            MesaFlow integra herramientas para la experiencia del cliente y para
            la gestión interna del establecimiento, permitiendo trabajar desde
            una misma plataforma.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platformList.map((item) => (
            <PlatformCard
              key={item.title}
              tag={item.tag}
              title={item.title}
              description={item.description}
            />
          ))}
        </div>

        <div className="mt-14 rounded-3xl border border-mesa-border bg-mesa-surface p-6 shadow-2xl shadow-mesa-primary/10">
          <div className="grid gap-6 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
                Panel centralizado
              </p>

              <h3 className="font-display mt-4 text-3xl font-bold">
                Todo el flujo gastronómico en un solo lugar
              </h3>

              <p className="mt-4 leading-7 text-mesa-muted">
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