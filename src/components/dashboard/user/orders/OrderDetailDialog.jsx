import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Table from '../../../table/Table'
import DefaultButton from '../../../common/button/DefaultButton'
import { orderDetailColumns } from '../../../table/columns/orderColumns'
import { getOrder } from '../../../../api/orderService'
import { queryKeys } from '../../../../api/queryClient'
import { formatPrice } from '../../../../utils/productUtils'
import { ORDER_STATES } from '../../../../utils/orderUtils'

const OrderDetailDialog = ({ idPedido, liveConnected, onViewAccount, onClose }) => {
  const { data: order, isLoading, error } = useQuery({
    queryKey: queryKeys.order(idPedido),
    queryFn: ({ signal }) => getOrder(idPedido, signal),
    staleTime: 0,
    refetchInterval: liveConnected ? false : 15000,
  })

  useEffect(() => {
    if (error) toast.error(error.response?.data?.message || error.message || 'No se pudo cargar el pedido.')
  }, [error])

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md"
      slotProps={{ paper: { sx: { margin: '16px', maxHeight: 'calc(100% - 32px)', backgroundColor: '#0B111C', color: '#F8FAFC', borderRadius: '24px', border: '1px solid #1F2937' } } }}>
      <DialogTitle>Pedido #{idPedido}</DialogTitle>
      <DialogContent>
        {error && <p role="alert" className="mb-4 text-red-400">No se pudo actualizar el detalle del pedido.</p>}
        {order && (
          <div className="mb-5 space-y-2 text-sm text-mesa-muted">
            <p>Mesa {order.codigoMesa} · {ORDER_STATES[order.estado]?.label ?? order.estado}</p>
            <p>Cliente #{order.idUsuarioCliente} · Sesión #{order.idSesionMesa}</p>
            <p>Total: <strong className="text-mesa-text">{formatPrice(order.total)}</strong></p>
            {order.motivoCancelacion && <p>Motivo de cancelación: {order.motivoCancelacion}</p>}
          </div>
        )}
        <Table rows={order?.detalles ?? []} columns={orderDetailColumns}
          getRowId={(item) => item.idPedidoDetalle} loading={isLoading} showToolbar={false}
          getRowHeight={() => 'auto'}
          sx={{
            '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', paddingY: 1.5 },
            '& .MuiDataGrid-cell[data-field="nombreProducto"], & .MuiDataGrid-cell[data-field="observaciones"]': {
              whiteSpace: 'normal', lineHeight: 1.5, overflowWrap: 'anywhere',
            },
          }}
          emptyMessage="No hay detalles para mostrar." />
      </DialogContent>
      <DialogActions>
        <DefaultButton variant="secondary" onClick={onClose}>Cerrar</DefaultButton>
        {onViewAccount && <DefaultButton disabled={!order} onClick={() => onViewAccount(order)}>
          Ver cuenta de la mesa
        </DefaultButton>}
      </DialogActions>
    </Dialog>
  )
}

export default OrderDetailDialog
