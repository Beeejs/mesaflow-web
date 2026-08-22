import { benefitsList } from "../../constants/constants.js"
/* Components */
import BenefitCard from "../../components/benefits/BenefitCard.jsx"


const Benefits = () => {
  return (
    <section
      id="beneficios"
      className="relative overflow-hidden border-t border-mesa-border bg-mesa-surface/30 px-6 py-24"
    >
      <div className="absolute right-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-mesa-cyan/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Beneficios
          </p>

          <h2 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Una mejor experiencia para el cliente también mejora el negocio
          </h2>

          <p className="mt-5 text-lg leading-8 text-mesa-muted">
            MesaFlow no solo digitaliza la atención. También ayuda al
            restaurante a trabajar de forma más ordenada, eficiente y preparada
            para momentos de alta demanda.
          </p>

          <div className="mt-8 rounded-3xl border border-mesa-primary/30 bg-mesa-primary/10 p-6">
            <p className="text-lg font-semibold text-mesa-cyan-light">
              Menos espera. Más organización. Mejor servicio.
            </p>

            <p className="mt-3 text-sm leading-6 text-mesa-muted">
              La plataforma está pensada para conectar al cliente, el personal y
              la administración dentro de un mismo flujo de trabajo.
            </p>
          </div>
        </div>

        <div className="grid gap-4">
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