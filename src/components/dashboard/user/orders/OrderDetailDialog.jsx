import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import DashboardInfoDialog from '../../DashboardInfoDialog'
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
    <DashboardInfoDialog
      onClose={onClose}
      title={`Pedido #${idPedido}`}
      actions={
        <>
          <DefaultButton variant="secondary" onClick={onClose}>Cerrar</DefaultButton>
          {onViewAccount && (
            <DefaultButton disabled={!order} onClick={() => onViewAccount(order)}>
              Ver cuenta de la mesa
            </DefaultButton>
          )}
        </>
      }
    >
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
    </DashboardInfoDialog>
  )
}

export default OrderDetailDialog
