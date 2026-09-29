/* MUI Icons */
import EditIcon from '@mui/icons-material/Edit'

/* Components */
import DashboardDataGrid from '../../../components/dashboard/DashboardDataGrid'
import UserStatusChip from './UserStatusChip'
import DashboardTableActionButton from '../DashboardTableActionButton'

/* Utils */
import { formatDate } from '../../../utils/dateUtils'

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
        <DashboardTableActionButton
          title="Editar usuario"
          onClick={() => onEditUser(params.row)}
          ariaLabel={`Editar usuario ${params.row.nombre}`}
        >
          <EditIcon sx={{ fontSize: 20 }} />
        </DashboardTableActionButton>
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