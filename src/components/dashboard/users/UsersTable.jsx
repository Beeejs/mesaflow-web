/* MUI */
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

/* MUI Icons */
import EditIcon from '@mui/icons-material/Edit'

/* Components */
import DashboardDataGrid from '../../../components/dashboard/DashboardDataGrid'
import UserStatusChip from './UserStatusChip'

const formatDate = (date) => {
  if (!date) {
    return '-'
  }

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

const UsersTable = ({ users = [], loading = false, onEditUser }) => {
  const columns = [
    {
      field: 'usuario',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 180,
      valueGetter: (_, user) =>
        `${user.nombre || ''} ${user.apellido || ''}`,
      renderCell: (params) => (
        <span className="font-semibold text-mesa-text">
          {params.value}
        </span>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.3,
      minWidth: 220,
    },
    {
      field: 'rol',
      headerName: 'Rol',
      flex: 0.7,
      minWidth: 130,
      renderCell: (params) => (
        <span className="rounded-full border border-mesa-border px-3 py-1 text-xs font-bold text-mesa-cyan-light">
          {params.value}
        </span>
      ),
    },
    {
      field: 'activo',
      headerName: 'Estado',
      flex: 0.7,
      minWidth: 130,
      renderCell: (params) => (
        <UserStatusChip active={params.value} />
      ),
    },
    {
      field: 'fechaCreacion',
      headerName: 'Fecha',
      flex: 0.8,
      minWidth: 130,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      flex: 0.5,
      minWidth: 110,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Tooltip title="Editar usuario">
          <IconButton
            type="button"
            onClick={() => onEditUser(params.row)}
            sx={{
              color: '#94A3B8',
              '&:hover': {
                color: '#F8FAFC',
                backgroundColor: '#111827',
              },
            }}
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <DashboardDataGrid
      rows={users}
      columns={columns}
      getRowId={(user) => user.idUsuario}
      loading={loading}
      emptyMessage="No hay usuarios para mostrar."
    />
  )
}

export default UsersTable