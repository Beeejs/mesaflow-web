import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined'
import DashboardTableActionButton from '../../dashboard/DashboardTableActionButton'
import { formatPrice } from '../../../utils/productUtils'
import { ORDER_STATES, canCancelOrder } from '../../../utils/orderUtils'

export const getOrderColumns = ({ onAdvance, onCancel, onAccount, busy = false } = {}) => [
  {
    field: 'idPedido', headerName: 'Pedido', minWidth: 100,
    renderCell: ({ value }) => (
      <div className="flex h-full items-center">
        <span className="inline-flex h-7 items-center justify-center rounded-lg border border-mesa-primary/40 bg-mesa-primary/10 px-3 text-sm font-bold leading-none text-mesa-cyan-light">
          #{value}
        </span>
      </div>
    ),
  },
  {
    field: 'codigoMesa', headerName: 'Mesa', minWidth: 100,
    renderCell: ({ value }) => (
      <div className="flex h-full items-center">
        <span className="inline-flex h-7 items-center justify-center rounded-lg border border-mesa-border bg-mesa-surface px-3 text-sm font-bold leading-none text-mesa-text">
          {value}
        </span>
      </div>
    ),
  },
  {
    field: 'fechaPedido', headerName: 'Fecha y hora', minWidth: 180,
    valueFormatter: (value) => value ? new Date(value).toLocaleString('es-AR') : '-',
  },
  {
    field: 'productos', headerName: 'Productos', minWidth: 240, flex: 1,
    valueGetter: (_value, row) =>
      row.detalles.map((item) => `${item.cantidad} × ${item.nombreProducto}`).join(', '),
  },
  {
    field: 'estado', headerName: 'Estado', minWidth: 160,
    renderCell: ({ value }) => (
      <span className={`rounded-full border border-mesa-border px-3 py-1 text-xs font-bold ${ORDER_STATES[value]?.color ?? 'text-mesa-muted'}`}>
        {ORDER_STATES[value]?.label ?? value}
      </span>
    ),
  },
  {
    field: 'total', headerName: 'Total', type: 'number', minWidth: 130,
    valueFormatter: formatPrice,
  },
  ...(onAccount || onAdvance || onCancel ? [{
    field: 'acciones', headerName: 'Acciones', minWidth: 190,
    sortable: false, filterable: false,
    renderCell: ({ row }) => (
      <div className="flex h-full items-center gap-1" onClick={(event) => event.stopPropagation()}>
        {onAccount && (
          <DashboardTableActionButton title={`Ver cuenta de mesa ${row.codigoMesa}`} onClick={() => onAccount(row)}
            sx={{ color: '#10C4FC', backgroundColor: 'rgba(16, 196, 252, 0.1)' }}>
            <ReceiptLongOutlinedIcon sx={{ fontSize: 26 }} />
          </DashboardTableActionButton>
        )}
        {onAdvance && ORDER_STATES[row.estado]?.next && (
          <DashboardTableActionButton title={ORDER_STATES[row.estado].action} onClick={() => onAdvance(row)} disabled={busy}
            sx={{
              color: '#4ADE80',
              backgroundColor: 'rgba(34, 197, 94, 0.22)',
              border: '1px solid rgba(34, 197, 94, 0.55)',
              '&:hover': { color: '#86EFAC', backgroundColor: 'rgba(34, 197, 94, 0.35)' },
            }}>
            <PlayArrowIcon fontSize="small" />
          </DashboardTableActionButton>
        )}
        {onCancel && canCancelOrder(row) && (
          <DashboardTableActionButton title={`Cancelar pedido #${row.idPedido}`} onClick={() => onCancel(row)} disabled={busy}
            sx={{
              color: '#F87171',
              backgroundColor: 'rgba(239, 68, 68, 0.22)',
              border: '1px solid rgba(239, 68, 68, 0.55)',
              '&:hover': { color: '#FCA5A5', backgroundColor: 'rgba(239, 68, 68, 0.35)' },
            }}>
            <CancelOutlinedIcon fontSize="small" />
          </DashboardTableActionButton>
        )}
      </div>
    ),
  }] : []),
]

export const orderDetailColumns = [
  { field: 'nombreProducto', headerName: 'Producto', minWidth: 180, flex: 1 },
  { field: 'cantidad', headerName: 'Cantidad', type: 'number', minWidth: 90 },
  { field: 'precioUnitario', headerName: 'Precio', type: 'number', minWidth: 120, valueFormatter: formatPrice },
  { field: 'subtotal', headerName: 'Subtotal', type: 'number', minWidth: 120, valueFormatter: formatPrice },
  { field: 'observaciones', headerName: 'Observaciones', minWidth: 220, flex: 1 },
]
