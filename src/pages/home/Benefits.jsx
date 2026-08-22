import { benefitsList } from "../../constants/constants.js"

/* Components */
import BenefitCard from "../../components/benefits/BenefitCard.jsx"

const Benefits = () => {
  return (
    <section
      id="beneficios"
      className="relative overflow-hidden border-t border-mesa-border bg-mesa-surface/30 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="absolute right-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-mesa-cyan/10 blur-3xl sm:h-64 sm:w-64 lg:h-72 lg:w-72" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan sm:text-sm">
            Beneficios
          </p>

          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl md:text-5xl">
            Una mejor experiencia para el cliente también mejora el negocio
          </h2>

          <p className="mt-5 text-base leading-7 text-mesa-muted sm:text-lg sm:leading-8">
            MesaFlow no solo digitaliza la atención. También ayuda al
            restaurante a trabajar de forma más ordenada, eficiente y preparada
            para momentos de alta demanda.
          </p>

          <div className="mt-8 rounded-3xl border border-mesa-primary/30 bg-mesa-primary/10 p-5 sm:p-6">
            <p className="text-base font-semibold text-mesa-cyan-light sm:text-lg">
              Menos espera. Más organización. Mejor servicio.
            </p>

            <p className="mt-3 text-sm leading-6 text-mesa-muted">
              La plataforma está pensada para conectar al cliente, el personal y
              la administración dentro de un mismo flujo de trabajo.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5">
          {benefitsList.map((benefit) => (
            <BenefitCard
              key={benefit.title}
              title={benefit.title}
              description={benefit.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Benefits