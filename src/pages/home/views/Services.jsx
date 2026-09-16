import { servicesList } from "../../../constants/constants.js";

/* Components */
import ServiceCard from "../../../components/services/ServiceCard.jsx";

const Services = () => {
  return (
    <section
      id="servicios"
      className="relative overflow-hidden border-t border-mesa-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="absolute left-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-mesa-primary/10 blur-3xl sm:h-64 sm:w-64 lg:h-72 lg:w-72" />

      <div className="relative mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan sm:text-sm">
            Servicios
          </p>

          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl md:text-5xl">
            Todo lo que necesitás para digitalizar tu restaurante
          </h2>

          <p className="mt-5 text-base leading-7 text-mesa-muted sm:text-lg sm:leading-8">
            MesaFlow reúne las herramientas principales para mejorar la atención
            al cliente y ordenar la operación diaria del establecimiento.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
          {servicesList.map((service) => (
            <ServiceCard
              key={service.number}
              title={service.title}
              image={service.image}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;