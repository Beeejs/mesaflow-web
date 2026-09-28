
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

/* Toast */
import { toast } from 'sonner'

/* Hooks */
import useEstablishmentUsersQuery from '../../../hooks/queries/useEstablishmentUsersQuery'
import useEstablishmentsQuery from '../../../hooks/queries/useEstablishmentsQuery'

/* Components */
import EstablishmentUsersTable from '../../../components/dashboard/establishments/EstablishmentUsersTable'
import AddEstablishmentUserDialog from '../../../components/dashboard/establishments/AddEstablishmentUserDialog'
import DefaultButton from '../../../components/button/DefaultButton'

const AdminEstablishmentUsers = () => {
  const { idEstablecimiento } = useParams()

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
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

      {/* Encabezado y acción para agregar usuario */}
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

      {/* Agregar usuario */}
      <div className="mt-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-display text-xl font-bold text-mesa-text">
            Usuarios asociados
          </h3>

          <p className="mt-2 text-sm text-mesa-muted">
            {users.length} {users.length === 1 ? 'usuario' : 'usuarios'}
          </p>
        </div>

        <DefaultButton
          type="button"
          onClick={() => setIsAddDialogOpen(true)}
        >
          Agregar usuario
        </DefaultButton>
      </div>



      <div className="mt-8 min-w-0 rounded-3xl border border-mesa-border bg-mesa-surface p-3 sm:p-6">
        <EstablishmentUsersTable
          users={users}
          loading={isLoading}
        />
      </div>

      {/* Diálogo para agregar usuario */}
      {isAddDialogOpen && (
        <AddEstablishmentUserDialog
          open
          idEstablecimiento={establishmentId}
          onClose={() => setIsAddDialogOpen(false)}
        />
      )}

    </section>
  )
}

export default AdminEstablishmentUsers
