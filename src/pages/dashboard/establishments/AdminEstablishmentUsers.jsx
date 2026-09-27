
import { Link, useParams } from 'react-router'
import { useEffect } from 'react'
import { toast } from 'sonner'

/* Hooks */
import useEstablishmentUsersQuery from '../../../hooks/queries/useEstablishmentUsersQuery'
import useEstablishmentsQuery from '../../../hooks/queries/useEstablishmentsQuery'

/* Components */
import EstablishmentUsersTable from '../../../components/dashboard/establishments/EstablishmentUsersTable'

const AdminEstablishmentUsers = () => {
  const { idEstablecimiento } = useParams()
  const establishmentId = Number(idEstablecimiento)

  const {
    data: users = [],
    isLoading,
    error,
  } = useEstablishmentUsersQuery(establishmentId)

  const {
    data: establishments = [],
  } = useEstablishmentsQuery()

  const establishment = establishments.find(
    (item) => item.idEstablecimiento === establishmentId
  )

  useEffect(() => {
    if (error) {
      toast.error('No se pudieron cargar los usuarios del establecimiento.')
    }
  }, [error])

  return (
    <section className="min-w-0">
      <Link
        to="/dashboard/establecimientos"
        className="text-sm font-semibold text-mesa-cyan hover:text-mesa-cyan-light"
      >
        ← Volver a establecimientos
      </Link>

      
      <div className="mt-8">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
          Establecimientos / Gestión de personal
        </p>

        <h2 className="mt-4 break-words font-display text-3xl font-bold text-mesa-text sm:text-4xl">
          {establishment?.nombre || 'Establecimiento'}
        </h2>

        <p className="mt-4 max-w-2xl text-base leading-7 text-mesa-muted">
          Administrá los usuarios asociados y sus roles dentro del establecimiento.
        </p>
      </div>

      <div className="mt-10 flex items-center justify-between gap-4">
        <h3 className="font-display text-xl font-bold text-mesa-text">
          Usuarios asociados
        </h3>

        <span className="rounded-full border border-mesa-border px-3 py-1 text-xs font-semibold text-mesa-muted">
          {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
        </span>
      </div>


      <div className="mt-8 min-w-0 rounded-3xl border border-mesa-border bg-mesa-surface p-3 sm:p-6">
        <EstablishmentUsersTable
          users={users}
          loading={isLoading}
        />
      </div>
    </section>
  )
}

export default AdminEstablishmentUsers
