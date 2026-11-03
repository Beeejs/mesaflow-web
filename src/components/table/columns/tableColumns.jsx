
/* MUI Icons */
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

/* Components */
import DashboardTableActionButton from '../../dashboard/DashboardTableActionButton'

export const getTableColumns = ({ onEditTable }) => [
  {
    field: 'codigo',
    headerName: 'Mesa',
    flex: 1,
    minWidth: 120,
    renderCell: (params) => (
      <span className="font-semibold text-mesa-text">
        {params.row.codigo}
      </span>
    ),
  },
  {
    field: 'sector',
    headerName: 'Sector',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'capacidad',
    headerName: 'Capacidad',
    type: 'number',
    minWidth: 130,
    renderCell: (params) => (
      <span className="text-mesa-text">
        {params.row.capacidad == null
          ? '—'
          : `${params.row.capacidad} personas`}
      </span>
    ),
  },
  {
    field: 'agrupable',
    headerName: 'Agrupable',
    minWidth: 130,
    renderCell: (params) => (
      <span
        className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${
          params.row.agrupable
            ? 'border-blue-500/40 bg-blue-500/10 text-blue-400'
            : 'border-mesa-border bg-mesa-card text-mesa-muted'
        }`}
      >
        {params.row.agrupable ? 'Sí' : 'No'}
      </span>
    ),
  },
  {
    field: 'habilitada',
    headerName: 'Habilitación',
    minWidth: 160,
    renderCell: (params) => (
      <span
        className={`inline-flex rounded-lg border px-3 py-1 text-xs font-semibold ${
          params.row.habilitada
            ? 'border-green-500/40 bg-green-500/10 text-green-400'
            : 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400'
        }`}
      >
        {params.row.habilitada
          ? 'Habilitada'
          : 'Deshabilitada'}
      </span>
    ),
  },
  {
    field: 'actions',
    headerName: 'Acciones',
    minWidth: 110,
    sortable: false,
    filterable: false,
    align: 'center',
    headerAlign: 'center',
    disableExport: true,
    renderCell: (params) => {
      const table = params.row

      return (
        <div className="flex h-full items-center justify-center">
          <DashboardTableActionButton
            title={`Editar ${table.codigo}`}
            disabled={!table.physicalTable}
            onClick={(event) => {
              event.stopPropagation()
              onEditTable(table.physicalTable)
            }}
          >
            <EditOutlinedIcon sx={{ fontSize: 20 }} />
          </DashboardTableActionButton>
        </div>
      )
    },
  },
]
