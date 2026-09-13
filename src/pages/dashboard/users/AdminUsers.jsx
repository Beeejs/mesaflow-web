import { useEffect, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

/* MUI Icons */
import RefreshIcon from '@mui/icons-material/Refresh'

/* Hooks */
import useUsersQuery from '../../../hooks/queries/useUsersQuery'

/* Components */
import UsersTable from '../../../components/dashboard/users/UsersTable'
import UserFormDialog from '../../../components/dashboard/users/UserFormDialog'

const AdminUsers = () => {
  // Usuario seleccionado para editar
  const [selectedUser, setSelectedUser] = useState(null)

  // Listado de usuarios
  const {
    data: usersData = [],
    isLoading: usersLoading,
    isFetching: usersFetching,
    error: usersError,
    refetch: refetchUsers,
  } = useUsersQuery()

  // Manejador de edición de usuario
  const handleEditUser = (user) => {
    setSelectedUser(user)
  }

  // Manejador de errores
  useEffect(() => {
    if (!usersError) {
      return
    }

    toast.error('No se pudieron cargar los usuarios.')
  }, [usersError])

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Usuarios
          </p>

          <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
            Administración de usuarios
          </h2>

          <p className="mt-4 max-w-2xl text-base leading-7 text-mesa-muted">
            Gestioná los usuarios globales registrados en MesaFlow.
          </p>
        </div>

        <Tooltip title="Recargar usuarios">
          <IconButton
            type="button"
            onClick={() => refetchUsers()}
            disabled={usersFetching}
            sx={{
              width: 44,
              height: 44,
              border: '1px solid #1F2937',
              borderRadius: '14px',
              backgroundColor: '#0B111C',
              color: '#94A3B8',
              transition: 'all 0.2s ease',
              '&:hover': {
                borderColor: 'rgba(5, 110, 248, 0.6)',
                backgroundColor: '#111827',
                color: '#F8FAFC',
              },
              '&.Mui-disabled': {
                color: '#475569',
                borderColor: '#1F2937',
                backgroundColor: '#0B111C',
              },
            }}
          >
            <RefreshIcon
              sx={{
                fontSize: 22,
                animation: usersFetching ? 'spin 0.8s linear infinite' : 'none',
                '@keyframes spin': {
                  from: {
                    transform: 'rotate(0deg)',
                  },
                  to: {
                    transform: 'rotate(360deg)',
                  },
                },
              }}
            />
          </IconButton>
        </Tooltip>
      </div>

      <div className="mt-12">
        <UsersTable
          users={usersData || []}
          loading={usersLoading}
          onEditUser={handleEditUser}
        />
      </div>

      {selectedUser && (
        <UserFormDialog
          key={selectedUser.idUsuario}
          open={Boolean(selectedUser)}
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </section>
  )
}

export default AdminUsers