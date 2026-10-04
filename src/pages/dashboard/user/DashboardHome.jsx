import { useContext } from 'react'
import { Link } from 'react-router'

/* MUI Icons */
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined'
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'

/* Context */
import { SessionContext } from '../../../context/SessionContext'
import { WorkspaceContext } from '../../../context/WorkspaceContext'

const DashboardHome = () => {
  // Hooks
  const { user } = useContext(SessionContext)
  const { selectedEstablishment } = useContext(WorkspaceContext)

  // Constantes derivadas
  const isAdmin = user?.rol === 'ADMIN'

  // Renderizado
  if (!isAdmin && selectedEstablishment) {
    return (
      <section>
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Establecimiento
          </p>

          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
            {selectedEstablishment.nombre}
          </h1>

          <p className="mt-4 text-base leading-7 text-mesa-muted">
            Gestioná las operaciones del establecimiento desde este panel.
          </p>
        </div>
      </section>
    )
  }

  const cards = isAdmin
    ? [
        {
          title: 'Usuarios',
          description: 'Gestioná los usuarios registrados en MesaFlow.',
          to: '/dashboard/usuarios',
          icon: GroupOutlinedIcon,
        },
        {
          title: 'Establecimientos',
          description: 'Administrá establecimientos y solicitudes.',
          to: '/dashboard/establecimientos',
          icon: StorefrontOutlinedIcon,
        },
      ]
    : [
        {
          title: 'Mis solicitudes',
          description: 'Consultá el estado de tus solicitudes.',
          to: '/dashboard/mis-solicitudes',
          icon: AssignmentOutlinedIcon,
        },
        {
          title: 'Mis establecimientos',
          description: 'Accedé a los establecimientos que tenés asignados.',
          to: '/dashboard/mis-establecimientos',
          icon: StorefrontOutlinedIcon,
        },
      ]

  return (
    <section>
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
          Inicio
        </p>

        <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
          Mi panel
        </h1>

        <p className="mt-4 text-base leading-7 text-mesa-muted">
          Accedé rápidamente a las principales secciones de MesaFlow.
        </p>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <Link
              key={card.to}
              to={card.to}
              className="rounded-3xl border border-mesa-border bg-mesa-surface p-6 shadow-xl shadow-black/10 transition hover:border-mesa-primary/50"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mesa-primary/10 text-mesa-cyan-light">
                <Icon sx={{ fontSize: 24 }} />
              </div>

              <h2 className="font-display mt-6 text-xl font-bold text-mesa-text">
                {card.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-mesa-muted">
                {card.description}
              </p>

              <p className="mt-6 text-sm font-semibold text-mesa-cyan-light">
                Ingresar
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default DashboardHome