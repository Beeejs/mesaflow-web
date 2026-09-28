
/* Components */
import DashboardDataGrid from '../DashboardDataGrid'

/* MUI */
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import EditIcon from '@mui/icons-material/Edit'

const formatDate = (date) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

const EstablishmentUsersTable = ({
  users = [],
  loading = false,
  onEditUser
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
        <div className="flex h-full items-center justify-center">
          <Tooltip title="Modificar rol">
            <IconButton
              onClick={() => onEditUser(params.row)}
              aria-label={`Modificar rol de ${params.row.nombre}`}
              sx={{
                color: '#94A3B8',
                '&:hover': {
                  color: '#10C4FC',
                  backgroundColor: '#111827',
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
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
