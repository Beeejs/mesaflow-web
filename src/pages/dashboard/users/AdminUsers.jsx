import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/* Hooks */
import useUsersQuery from '../../../hooks/queries/useUsersQuery'

/* Components */
import UsersTable from '../../../components/dashboard/users/UsersTable'
import UserFormDialog from '../../../components/dashboard/users/UserFormDialog'
import DashboardPageHeader from '../../../components/dashboard/DashboardPageHeader'
import DashboardRefreshButton from '../../../components/dashboard/DashboardRefreshButton'
import AssignUserEstablishmentDialog from '../../../components/dashboard/users/AssignUserEstablishmentDialog'

const AdminUsers = () => {
  // Usuario seleccionado para editar
  const [userDialog, setUserDialog] = useState(null)

  // Listado de usuarios
  const {
    data: usersData = [],
    isLoading: usersLoading,
    isFetching: usersFetching,
    error: usersError,
    refetch: refetchUsers,
  } = useUsersQuery()

  // Manejador de errores
  useEffect(() => {
    if (!usersError) {
      return
    }

    toast.error('No se pudieron cargar los usuarios.')
  }, [usersError])

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
        <UsersTable
          users={usersData}
          loading={usersLoading}
          onEditUser={(user) =>
            setUserDialog({ mode: 'edit', user })
          }
          onAssignUser={(user) =>
            setUserDialog({ mode: 'assign', user })
          }
        />
      </div>

      {userDialog?.mode === 'edit' && (
        <UserFormDialog
          key={`edit-${userDialog.user.idUsuario}`}
          open
          user={userDialog.user}
          onClose={() => setUserDialog(null)}
        />
      )}

      {userDialog?.mode === 'assign' && (
        <AssignUserEstablishmentDialog
          key={`assign-${userDialog.user.idUsuario}`}
          open
          user={userDialog.user}
          onClose={() => setUserDialog(null)}
        />
      )}
    </section>
  )
}

export default AdminUsers