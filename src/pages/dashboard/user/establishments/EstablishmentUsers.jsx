import { useContext, useEffect, useState } from 'react'

/* Toast */
import { toast } from 'sonner'

/* Context */
import { WorkspaceContext } from '../../../../context/WorkspaceContext'
import { SessionContext } from '../../../../context/SessionContext'
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

/* Hooks */
import useEstablishmentUsersQuery from '../../../../hooks/queries/useEstablishmentUsersQuery'
import useRemoveEstablishmentUserMutation from '../../../../hooks/mutations/useRemoveEstablishmentUserMutation'

/* Components */
import Table from '../../../../components/table/Table'
import EstablishmentUserFormDialog from '../../../../components/dashboard/admin/establishments/EstablishmentUserFormDialog'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import DefaultButton from '../../../../components/common/button/DefaultButton'

/* Columns */
import { getEstablishmentUsersColumns } from '../../../../components/table/columns/establishmentUsersColumns'

const canRemoveMozo = (user) =>
  user.rolEstablecimiento === 'MOZO'

const EstablishmentUsers = () => {
  // Hooks
  const { selectedEstablishment } = useContext(WorkspaceContext)
  const { openActionDialog } = useContext(ActionDialogContext)
  const { user } = useContext(SessionContext)

  const [dialogOpen, setDialogOpen] = useState(false)

  const establishmentId =
    selectedEstablishment.idEstablecimiento

  const {
    data: users = [],
    isLoading,
    error,
  } = useEstablishmentUsersQuery(establishmentId)

  const removeMutation =
    useRemoveEstablishmentUserMutation(establishmentId)

  // Constantes derivadas
  const isEncargado = users.some(
    (item) =>
      item.email === user?.email &&
      item.rolEstablecimiento === 'ENCARGADO'
  )

  // useEffect
  useEffect(() => {
    if (error) {
      toast.error(
        error.response?.data?.message ||
          'No se pudieron cargar los usuarios del establecimiento.'
      )
    }
  }, [error])

  // Funciones
  const handleRemoveUser = (item) => {
    if (
      !isEncargado ||
      !canRemoveMozo(item) ||
      removeMutation.isPending
    ) {
      return
    }

    openActionDialog({
      title: 'Desasociar usuario',
      description: `¿Querés desasociar a ${item.nombre} ${item.apellido}? El usuario dejará de trabajar como mozo/a en este establecimiento.`,
      actionLabel: 'Desasociar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      icon: 'cancel',
      onAction: async () => {
        try {
          await removeMutation.mutateAsync(
            item.idUsuario
          )

          toast.success(
            'Usuario desasociado correctamente.'
          )
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              'No se pudo desasociar el usuario.'
          )

          throw error
        }
      },
    })
  }

  // Constantes derivadas
  const columns = getEstablishmentUsersColumns({
    onRemoveUser: handleRemoveUser,
    canRemoveUser: canRemoveMozo,
  })

  // Renderizado
  if (!isLoading && (error || !isEncargado)) {
    return (
      <p className="text-sm text-mesa-muted">
        {error
          ? error.response?.data?.message ||
            'No se pudieron cargar los usuarios del establecimiento.'
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
            {users.length}{' '}
            {users.length === 1
              ? 'usuario'
              : 'usuarios'}
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
        <Table
          rows={users}
          columns={columns}
          getRowId={(row) => row.idUsuario}
          loading={isLoading}
          emptyMessage="No hay usuarios asociados a este establecimiento."
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