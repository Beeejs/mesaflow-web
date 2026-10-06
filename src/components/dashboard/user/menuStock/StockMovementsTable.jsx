/* Components */
import DashboardDataGrid from '../../DashboardDataGrid'

const typeConfig = {
  INICIAL: {
    label: 'Stock inicial',
    className:
      'border-blue-500/50 bg-blue-500/10 text-blue-400',
  },
  INGRESO: {
    label: 'Reingreso',
    className:
      'border-green-500/50 bg-green-500/10 text-green-400',
  },
  VENTA: {
    label: 'Venta',
    className:
      'border-mesa-border bg-mesa-card text-mesa-muted',
  },
  EGRESO: {
    label: 'Egreso',
    className:
      'border-red-500/50 bg-red-500/10 text-red-400',
  },
  AJUSTE: {
    label: 'Ajuste',
    className:
      'border-yellow-500/50 bg-yellow-500/10 text-yellow-400',
  },
}

const formatDay = (value) =>
  value
    ? new Date(value).toLocaleDateString('es-AR')
    : '-'

const formatHour = (value) =>
  value
    ? new Date(value).toLocaleTimeString('es-AR', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : '-'

const isOutgoing = (movement) =>
  Number(movement.cantidad) < 0

const StockMovementsTable = ({
  movements = [],
  loading = false,
}) => {
  // Constantes derivadas
  const columns = [
    {
      field: 'fechaDia',
      headerName: 'Fecha',
      minWidth: 120,
      valueGetter: (_value, row) =>
        formatDay(row.fecha),
    },
    {
      field: 'fechaHora',
      headerName: 'Hora',
      minWidth: 100,
      valueGetter: (_value, row) =>
        formatHour(row.fecha),
    },
    {
      field: 'producto',
      headerName: 'Producto',
      flex: 1,
      minWidth: 170,
    },
    {
      field: 'tipoMovimiento',
      headerName: 'Tipo',
      minWidth: 150,
      renderCell: (params) => {
        const config =
          typeConfig[params.row.tipoMovimiento]

        return (
          <span
            className={`inline-flex rounded-lg border px-3 py-1 text-sm font-semibold ${
              config?.className ??
              'border-mesa-border bg-mesa-card text-mesa-muted'
            }`}
          >
            {config?.label ??
              params.row.tipoMovimiento ??
              '-'}
          </span>
        )
      },
    },
    {
      field: 'cantidad',
      headerName: 'Cantidad',
      minWidth: 120,
      renderCell: (params) => {
        const movement = params.row
        const quantity = Math.abs(
          Number(movement.cantidad)
        )

        return (
          <span
            className={`font-bold ${
              isOutgoing(movement)
                ? 'text-red-400'
                : 'text-green-400'
            }`}
          >
            {isOutgoing(movement)
              ? '−'
              : '+'}
            {Number.isNaN(quantity)
              ? '-'
              : quantity}
          </span>
        )
      },
    },
    {
      field: 'saldoResultante',
      headerName: 'Saldo',
      minWidth: 110,
      renderCell: (params) => (
        <span className="font-bold text-mesa-text">
          {params.row.saldoResultante ?? '-'}
        </span>
      ),
    },
    {
      field: 'usuario',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 160,
      renderCell: (params) => (
        <span className="text-mesa-text">
          {params.row.usuario || '-'}
        </span>
      ),
    },
    {
      field: 'detalleCompleto',
      headerName: 'Detalle',
      flex: 1.4,
      minWidth: 220,
      sortable: false,
      renderCell: (params) => {
        const detail = [
          params.row.motivo,
          params.row.detalle,
        ]
          .filter(Boolean)
          .join(' · ')

        return (
          <div className="flex h-full items-center">
            <span className="line-clamp-2 text-sm text-mesa-muted">
              {detail || '-'}
            </span>
          </div>
        )
      },
    },
  ]

  // Renderizado
  return (
    <DashboardDataGrid
      rows={movements}
      columns={columns}
      getRowId={(movement) =>
        movement.idMovimientoStock
      }
      loading={loading}
      rowHeight={64}
      emptyMessage="Todavía no hay movimientos de stock para mostrar."
    />
  )
}

export default StockMovementsTable