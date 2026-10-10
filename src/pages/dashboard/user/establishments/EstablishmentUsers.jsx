import { useContext, useEffect, useState } from 'react'

/* Toast */
import { toast } from 'sonner'

/* Context */
import { WorkspaceContext } from '../../../../context/WorkspaceContext'
import { SessionContext } from '../../../../context/SessionContext'

/* Hooks */
import useEstablishmentUsersQuery from '../../../../hooks/queries/useEstablishmentUsersQuery'
import useRemoveEstablishmentUserMutation from '../../../../hooks/mutations/useRemoveEstablishmentUserMutation'

/* Components */
import EstablishmentUsersTable from '../../../../components/dashboard/admin/establishments/EstablishmentUsersTable'
import EstablishmentUserFormDialog from '../../../../components/dashboard/admin/establishments/EstablishmentUserFormDialog'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import DefaultButton from '../../../../components/common/button/DefaultButton'

const canRemoveMozo = (user) => user.rolEstablecimiento === 'MOZO'

const EstablishmentUsers = () => {
  const { selectedEstablishment } = useContext(WorkspaceContext)
  const { user } = useContext(SessionContext)
  const establishmentId = selectedEstablishment.idEstablecimiento
  const [dialogOpen, setDialogOpen] = useState(false)

  const {
    data: users = [],
    isLoading,
    error,
  } = useEstablishmentUsersQuery(establishmentId)

  const removeMutation = useRemoveEstablishmentUserMutation(establishmentId)
  const isEncargado = users.some(
    (item) =>
      item.email === user?.email &&
      item.rolEstablecimiento === 'ENCARGADO'
  )

  useEffect(() => {
    if (error) {
      toast.error(
        error.response?.data?.message ||
        'No se pudieron cargar los usuarios del establecimiento.'
      )
    }
  }, [error])

  const handleRemoveUser = (item) => {
    if (!isEncargado || !canRemoveMozo(item) || removeMutation.isPending) {
      return
    }

    toast(`¿Querés desasociar a ${item.nombre} ${item.apellido}?`, {
      description: 'El usuario dejará de trabajar como mozo/a en este establecimiento.',
      action: {
        label: 'Desasociar',
        onClick: async () => {
          try {
            await removeMutation.mutateAsync(item.idUsuario)
            toast.success('Usuario desasociado correctamente.')
          } catch (error) {
            toast.error(
              error.response?.data?.message ||
              'No se pudo desasociar el usuario.'
            )
          }
        },
      },
      cancel: { label: 'Cancelar' },
    })
  }

  if (!isLoading && (error || !isEncargado)) {
    return (
      <p className="text-sm text-mesa-muted">
        {error
          ? error.response?.data?.message || 'No se pudieron cargar los usuarios del establecimiento.'
          : 'Solo el encargado puede administrar los usuarios del establecimiento.'}
      </p>
    )
  }

  return (
    <section className="min-w-0">
      <DashboardPageHeader
        eyebrow="Establecimientos / Gestión de personal"
        title={selectedEstablishment.nombre}
        description="Administrá los usuarios asociados al establecimiento y agregá personal como mozo/a."
      />

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
          onClick={() => setDialogOpen(true)}
          disabled={isLoading || !isEncargado}
        >
          Agregar usuario
        </DefaultButton>
      </div>

      <div className="mt-8 min-w-0 rounded-3xl border border-mesa-border bg-mesa-surface p-3 sm:p-6">
        <EstablishmentUsersTable
          users={users}
          loading={isLoading}
          onRemoveUser={handleRemoveUser}
          canRemoveUser={canRemoveMozo}
        />
      </div>

      {dialogOpen && (
        <EstablishmentUserFormDialog
          open
          mozoOnly
          idEstablecimiento={establishmentId}
          onClose={() => setDialogOpen(false)}
        />
      )}
    </section>
  )
}

export default EstablishmentUsers
