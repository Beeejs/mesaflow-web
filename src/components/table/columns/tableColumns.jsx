
/* MUI Icons */
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

/* Components */
import DashboardTableActionButton from '../../dashboard/DashboardTableActionButton'

// =========================================
// IDENTIFICACIÓN VISUAL DE MOZOS
// =========================================

const WAITER_COLORS = [
  '#E87722',
  '#0D9488',
  '#7C3AED',
  '#2563EB',
  '#DB2777',
  '#65A30D',
  '#D97706',
]

const getWaiterColor = (idUsuario) => {
  const id = Number(idUsuario)

  if (!Number.isFinite(id)) {
    return WAITER_COLORS[0]
  }

  return WAITER_COLORS[
    Math.abs(id) % WAITER_COLORS.length
  ]
}

// =========================================
// COLUMNAS DE MESAS
// =========================================

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

  // =========================================
  // MOZO RESPONSABLE
  // =========================================

  {
    field: 'waiterName',
    headerName: 'Mozo',
    flex: 1.3,
    minWidth: 200,
    sortable: true,

    renderCell: (params) => {
      const {
        waiterId,
        waiterName,
        waiterInitial,
        waiterOrigin,
      } = params.row

      if (waiterId == null) {
        return (
          <span className="text-sm text-mesa-muted">
            Sin mozo
          </span>
        )
      }

      return (
        <div
          className="flex w-full min-w-0 items-center gap-2.5 overflow-hidden"
          style={{
            height: '100%',
            minHeight: 0,
          }}
        >
          {/* Avatar del mozo */}
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold leading-none text-white"
            style={{
              backgroundColor: getWaiterColor(waiterId),
            }}
          >
            {waiterInitial}
          </span>

          {/* Nombre y origen de asignación */}
          <div
            className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden"
            style={{
              minHeight: 0,
              gap: 3,
            }}
          >
            <span
              className="block w-full truncate text-sm font-semibold text-mesa-text"
              style={{
                lineHeight: '18px',
              }}
              title={waiterName}
            >
              {waiterName}
            </span>

            <span
              className="block w-full truncate text-xs text-mesa-muted"
              style={{
                lineHeight: '14px',
              }}
            >
              {waiterOrigin === 'Propio'
                ? 'Asignación propia'
                : 'Responsable del sector'}
            </span>
          </div>
        </div>
      )
    },
  },

  // =========================================
  // ACCIONES
  // =========================================

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
