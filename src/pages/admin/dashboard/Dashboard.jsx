import { Link } from 'react-router'
/* Constants */
import { dashboardCards } from '../../../constants/constants'

const Dashboard = () => {
  return (
    <section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
          Inicio
        </p>

        <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
          Bienvenido al panel de administración
        </h2>

        <p className="mt-4 text-base leading-7 text-mesa-muted">
          Desde este panel vas a poder gestionar usuarios, establecimientos y
          las principales operaciones administrativas de MesaFlow.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboardCards.map((card) => {
          const Icon = card.icon

          const content = (
            <article className="h-full rounded-3xl border border-mesa-border bg-mesa-surface p-6 shadow-2xl shadow-black/10 transition hover:border-mesa-primary/50">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mesa-primary/10 text-mesa-cyan-light">
                <Icon sx={{ fontSize: 24 }} />
              </div>

              <h3 className="font-display mt-6 text-xl font-bold text-mesa-text">
                {card.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-mesa-muted">
                {card.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-mesa-cyan-light">
                {card.available ? 'Ingresar' : 'Próximamente'}
              </p>
            </article>
          )

          if (!card.available) {
            return (
              <div key={card.title} className="opacity-60">
                {content}
              </div>
            )
          }

          return (
            <Link key={card.title} to={card.to}>
              {content}
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default Dashboard