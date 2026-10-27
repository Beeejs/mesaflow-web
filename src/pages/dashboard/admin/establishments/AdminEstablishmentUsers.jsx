import { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

/* Toast */
import { toast } from 'sonner'

/* Context */
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

/* Hooks */
import useEstablishmentUsersQuery from '../../../../hooks/queries/useEstablishmentUsersQuery'
import useEstablishmentsQuery from '../../../../hooks/queries/useEstablishmentsQuery'
import useRemoveEstablishmentUserMutation from '../../../../hooks/mutations/useRemoveEstablishmentUserMutation'

/* Components */
import Table from '../../../../components/table/Table'
import EstablishmentUserFormDialog from '../../../../components/dashboard/admin/establishments/EstablishmentUserFormDialog'
import DefaultButton from '../../../../components/common/button/DefaultButton'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'

/* Columns */
import { getEstablishmentUsersColumns } from '../../../../components/table/columns/establishmentUsersColumns'

const AdminEstablishmentUsers = () => {
  // Hooks
  const { openActionDialog } = useContext(ActionDialogContext)
  const { idEstablecimiento } = useParams()

  const [userDialog, setUserDialog] = useState(null)

  const establishmentId = Number(idEstablecimiento)

  const {
    data: users = [],
    isLoading,
    error,
  } = useEstablishmentUsersQuery(establishmentId)

  const {
    data: establishments = [],
  } = useEstablishmentsQuery()

  const removeMutation =
    useRemoveEstablishmentUserMutation(establishmentId)

  // Constantes derivadas
  const establishment = establishments.find(
    (item) =>
      item.idEstablecimiento === establishmentId
  )

  // useEffect
  useEffect(() => {
    if (error) {
      toast.error(
        'No se pudieron cargar los usuarios del establecimiento.'
      )
    }
  }, [error])

  // Funciones
  const handleRemoveUser = (user) => {
    if (removeMutation.isPending) return

    openActionDialog({
      title: 'Desasociar usuario',
      description: `¿Querés desasociar a ${user.nombre} ${user.apellido}? El usuario dejará de estar asociado a este establecimiento.`,
      actionLabel: 'Desasociar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      icon: 'cancel',
      onAction: async () => {
        try {
          await removeMutation.mutateAsync(
            user.idUsuario
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

  const handleEditUser = (user) => {
    setUserDialog({
      mode: 'edit',
      user,
    })
  }

  // Constantes derivadas
  const columns = getEstablishmentUsersColumns({
    onEditUser: handleEditUser,
    onRemoveUser: handleRemoveUser,
  })

  // Renderizado
  return (
    <section className="min-w-0">
      <Link
        to="/dashboard/establecimientos"
        className="text-sm font-semibold text-mesa-cyan hover:text-mesa-cyan-light"
      >
        ← Volver a establecimientos
      </Link>

      <div className="mt-8">
        <DashboardPageHeader
          eyebrow="Establecimientos / Gestión de personal"
          title={establishment?.nombre || 'Establecimiento'}
          description="Administrá los usuarios asociados y sus roles dentro del establecimiento."
        />
      </div>

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
          onClick={() =>
            setUserDialog({
              mode: 'add',
            })
          }
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
          onClose={() =>
            setUserDialog(null)
          }
        />
      )}
    </section>
  )
}

export default AdminEstablishmentUsers