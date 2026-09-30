
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

/* Toast */
import { toast } from 'sonner'

/* Hooks */
import useEstablishmentUsersQuery from '../../../hooks/queries/useEstablishmentUsersQuery'
import useEstablishmentsQuery from '../../../hooks/queries/useEstablishmentsQuery'
import useRemoveEstablishmentUserMutation from '../../../hooks/mutations/useRemoveEstablishmentUserMutation'

/* Components */
import EstablishmentUsersTable from '../../../components/dashboard/establishments/EstablishmentUsersTable'
import EstablishmentUserFormDialog from '../../../components/dashboard/establishments/EstablishmentUserFormDialog'
import DefaultButton from '../../../components/common/button/DefaultButton'
import DashboardPageHeader from '../../../components/dashboard/DashboardPageHeader'

const AdminEstablishmentUsers = () => {
  const { idEstablecimiento } = useParams()
  const establishmentId = Number(idEstablecimiento)

  // Estado para controlar el formulario de alta o edición de usuario
  const [userDialog, setUserDialog] = useState(null)

  const {
    data: users = [],
    isLoading,
    error,
  } = useEstablishmentUsersQuery(establishmentId)

  const {
    data: establishments = [],
  } = useEstablishmentsQuery()

  const removeMutation = useRemoveEstablishmentUserMutation(establishmentId)

  const establishment = establishments.find(
    (item) => item.idEstablecimiento === establishmentId
  )

  useEffect(() => {
    if (error) {
      toast.error('No se pudieron cargar los usuarios del establecimiento.')
    }
  }, [error])

  const handleRemoveUser = (user) => {
    toast(
      `¿Querés desasociar a ${user.nombre} ${user.apellido}?`,
      {
        description:
          'El usuario dejará de estar asociado a este establecimiento.',
        action: {
          label: 'Desasociar',
          onClick: async () => {
            try {
              await removeMutation.mutateAsync(user.idUsuario)

              toast.success('Usuario desasociado correctamente.')
            } catch (error) {
              toast.error(
                error.response?.data?.message ||
                  'No se pudo desasociar el usuario.'
              )
            }
          },
        },
        cancel: {
          label: 'Cancelar',
          onClick: () => {},
        },
      }
    )
  }


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
        <DashboardPageHeader
          eyebrow="Establecimientos / Gestión de personal"
          title={establishment?.nombre || 'Establecimiento'}
          description="Administrá los usuarios asociados y sus roles dentro del establecimiento."
        />
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
          onClick={() => setUserDialog({ mode: 'add' })}
        >
          Agregar usuario
        </DefaultButton>
      </div>



      <div className="mt-8 min-w-0 rounded-3xl border border-mesa-border bg-mesa-surface p-3 sm:p-6">
        <EstablishmentUsersTable
          users={users}
          loading={isLoading}
          onEditUser={(user) =>
            setUserDialog({ mode: 'edit', user })
          }
          onRemoveUser={handleRemoveUser}
        />
      </div>

      {/* Formulario para agregar o editar usuario */}
      {userDialog && (
        <EstablishmentUserFormDialog
          key={
            userDialog.mode === 'edit'
              ? `edit-${userDialog.user.idUsuario}`
              : 'add'
          }
          open
          user={
            userDialog.mode === 'edit'
              ? userDialog.user
              : null
          }
          idEstablecimiento={establishmentId}
          onClose={() => setUserDialog(null)}
        />
      )}


    </section>
  )
}

export default AdminEstablishmentUsers
