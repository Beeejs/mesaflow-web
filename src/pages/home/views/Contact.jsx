import ContactForm from '../../../components/contact/ContactForm'

const Contact = () => {
  return (
    <section
      id="contacto"
      className="relative overflow-hidden border-t border-mesa-border px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="absolute right-0 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-mesa-primary/10 blur-3xl sm:h-64 sm:w-64 lg:h-72 lg:w-72" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan sm:text-sm">
            Contacto
          </p>

          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl md:text-5xl">
            ¿Querés llevar MesaFlow a tu establecimiento?
          </h2>

          <p className="mt-5 text-base leading-7 text-mesa-muted sm:text-lg sm:leading-8">
            Dejanos tus datos y contanos brevemente sobre tu restaurante, bar o
            cervecería. Nuestro equipo revisará la solicitud y se pondrá en
            contacto para avanzar con la habilitación.
          </p>

          <div className="mt-8 rounded-3xl border border-mesa-primary/30 bg-mesa-primary/10 p-5 sm:p-6">
            <p className="text-base font-semibold text-mesa-cyan-light sm:text-lg">
              Primero conocemos tu establecimiento.
            </p>

            <p className="mt-3 text-sm leading-6 text-mesa-muted">
              Luego revisamos la solicitud y, si corresponde, habilitamos el
              acceso a la plataforma para comenzar la configuración.
            </p>
          </div>
        </div>

        <ContactForm />
      </div>
    </section>
  )
}

export default Contact