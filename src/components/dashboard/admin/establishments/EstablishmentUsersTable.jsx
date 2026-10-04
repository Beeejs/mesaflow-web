
/* Components */
import DashboardDataGrid from '../../DashboardDataGrid'
import DashboardTableActionButton from '../../DashboardTableActionButton'

/* MUI */
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete';

/* Utils */
import { formatDate } from '../../../../utils/dateUtils'

const EstablishmentUsersTable = ({
  users = [],
  loading = false,
  onEditUser,
  onRemoveUser
}) => {
  const columns = [
    {
      field: 'nombreCompleto',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) =>
        `${row.nombre || ''} ${row.apellido || ''}`.trim(),
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
      field: 'rolEstablecimiento',
      headerName: 'Rol',
      flex: 0.7,
      minWidth: 140,
      renderCell: (params) => (
        <span className="rounded-full border border-mesa-border px-3 py-1 text-xs font-bold text-mesa-cyan-light">
          {params.value}
        </span>
      ),
    },
    {
      field: 'fechaAsignacion',
      headerName: 'Asignación',
      flex: 0.8,
      minWidth: 145,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      minWidth: 110,
      flex: 0.5,
      sortable: false,
      filterable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <div className="flex h-full items-center justify-center gap-1">
          <DashboardTableActionButton
            title="Modificar rol"
            onClick={() => onEditUser(params.row)}
            ariaLabel={`Modificar rol de ${params.row.nombre}`}
            highlight
          >
            <EditIcon fontSize="small" />
          </DashboardTableActionButton>

          <DashboardTableActionButton
            title="Desasociar usuario"
            onClick={() => onRemoveUser(params.row)}
            ariaLabel={`Desasociar a ${params.row.nombre}`}
          >
            <DeleteIcon fontSize="small" />
          </DashboardTableActionButton>
        </div>
      ),
    }

  ]

  return (
    <DashboardDataGrid
      rows={users}
      columns={columns}
      getRowId={(row) => row.idUsuario}
      loading={loading}
      emptyMessage="No hay usuarios asociados a este establecimiento."
    />
  )
}

export default EstablishmentUsersTable
