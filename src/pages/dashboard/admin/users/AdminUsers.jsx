import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/* Hooks */
import useUsersQuery from '../../../../hooks/queries/useUsersQuery'

/* Components */
import Table from '../../../../components/table/Table'
import UserFormDialog from '../../../../components/dashboard/admin/users/UserFormDialog'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import DashboardRefreshButton from '../../../../components/dashboard/DashboardRefreshButton'
import AssignUserEstablishmentDialog from '../../../../components/dashboard/admin/users/AssignUserEstablishmentDialog'

/* Columns */
import { getUserColumns } from '../../../../components/table/columns/userColumns'

const AdminUsers = () => {
  // Hooks
  const [userDialog, setUserDialog] = useState(null)

  const {
    data: usersData = [],
    isLoading: usersLoading,
    isFetching: usersFetching,
    error: usersError,
    refetch: refetchUsers,
  } = useUsersQuery()

  // Funciones
  const handleEditUser = (user) => {
    setUserDialog({
      mode: 'edit',
      user,
    })
  }

  const handleAssignUser = (user) => {
    setUserDialog({
      mode: 'assign',
      user,
    })
  }

  // Constantes derivadas
  const columns = getUserColumns({
    onEditUser: handleEditUser,
    onAssignUser: handleAssignUser,
  })

  // useEffect
  useEffect(() => {
    if (!usersError) {
      return
    }

    toast.error(
      'No se pudieron cargar los usuarios.'
    )
  }, [usersError])

  // Renderizado
  return (
    <section>
      <DashboardPageHeader
        eyebrow="Usuarios"
        title="Administración de usuarios"
        description="Gestioná los usuarios globales registrados en MesaFlow."
        action={
          <DashboardRefreshButton
            onClick={() => refetchUsers()}
            loading={usersFetching}
            tooltip="Recargar usuarios"
          />
        }
      />

      <div className="mt-12">
        <Table
          rows={usersData}
          columns={columns}
          getRowId={(user) =>
            user.idUsuario
          }
          loading={usersLoading}
          emptyMessage="No hay usuarios para mostrar."
        />
      </div>

      {userDialog?.mode === 'edit' && (
        <UserFormDialog
          key={`edit-${userDialog.user.idUsuario}`}
          open
          user={userDialog.user}
          onClose={() =>
            setUserDialog(null)
          }
        />
      )}

      {userDialog?.mode === 'assign' && (
        <AssignUserEstablishmentDialog
          key={`assign-${userDialog.user.idUsuario}`}
          open
          user={userDialog.user}
          onClose={() =>
            setUserDialog(null)
          }
        />
      )}
    </section>
  )
}

export default AdminUsers