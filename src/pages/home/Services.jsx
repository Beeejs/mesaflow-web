import { servicesList } from "../../constants/constants.js";
/* Coomponents */
import ServiceCard from "../../components/services/ServiceCard";

const Services = () => {
  return (
    <section
      id="servicios"
      className="relative overflow-hidden border-t border-mesa-border px-6 py-24"
    >
      <div className="absolute left-0 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-mesa-primary/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Servicios
          </p>

          <h2 className="font-display mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            Todo lo que necesitás para digitalizar tu restaurante
          </h2>

          <p className="mt-5 text-lg leading-8 text-mesa-muted">
            MesaFlow reúne las herramientas principales para mejorar la atención
            al cliente y ordenar la operación diaria del establecimiento.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {servicesList.map((service) => (
            <ServiceCard
              key={service.number}
              number={service.number}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services