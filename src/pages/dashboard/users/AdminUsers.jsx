import { useEffect } from 'react'
import { toast } from 'sonner'

/* Api */
import { listUsers } from '../../../api/userService'

/* Hooks */
import useApiAction from '../../../hooks/useApiActions'

/* Components */
import Loader from '../../../components/loader/Loader'
import UsersTable from '../../../components/dashboard/users/UsersTable'

/* MUI */
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

/* MUI Icons */
import RefreshIcon from '@mui/icons-material/Refresh'

const AdminUsers = () => {
  // Hook para listar usuarios
  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
    action: listUsersAction,
  } = useApiAction(listUsers)

  // Función para editar usuario
  const handleEditUser = (user) => {
    console.log('Usuario a editar:', user)
  }

  // Efecto para cargar los usuarios al entrar a la vista
  useEffect(() => {
    listUsersAction()
  }, [])

  // Efecto para manejar errores al cargar usuarios
  useEffect(() => {
    if (!usersError) {
      return
    }

    toast.error(usersError)
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
            onClick={listUsersAction}
            disabled={usersLoading}
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
                animation: usersLoading ? 'spin 0.8s linear infinite' : 'none',
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

      <div className="flex items-center justify-center rounded-3xl border border-mesa-border bg-mesa-surface p-6 mt-12">
        {usersLoading ? (
          <Loader />
        ) : (
          <UsersTable
            users={usersData || []}
            onEditUser={handleEditUser}
          />
        )}
      </div>
    </section>
  )
}

export default AdminUsers