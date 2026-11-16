import { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import TextField from '@mui/material/TextField'
import { WorkspaceContext } from '../../../../context/WorkspaceContext'
import { SessionContext } from '../../../../context/SessionContext'
import { ActionDialogContext } from '../../../../context/ActionDialogContext'
import useEstablishmentUsersQuery from '../../../../hooks/queries/useEstablishmentUsersQuery'
import useOrdersQuery from '../../../../hooks/queries/useOrdersQuery'
import useTablesQuery from '../../../../hooks/queries/useTablesQuery'
import useOrderEvents from '../../../../hooks/useOrderEvents'
import useUpdateOrderStateMutation from '../../../../hooks/mutations/useUpdateOrderStateMutation'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import DashboardRefreshButton from '../../../../components/dashboard/DashboardRefreshButton'
import DashboardSummaryCard from '../../../../components/dashboard/DashboardSummaryCard'
import DashboardTabs from '../../DashboardTabs'
import Table from '../../../../components/table/Table'
import { getOrderColumns } from '../../../../components/table/columns/orderColumns'
import OrderDetailDialog from '../../../../components/dashboard/user/orders/OrderDetailDialog'
import CancelOrderDialog from '../../../../components/dashboard/user/orders/CancelOrderDialog'
import SessionAccountDialog from '../../../../components/dashboard/user/orders/SessionAccountDialog'
import OperationalOrdersBoard from './OperationalOrdersBoard'
import { ORDER_STATES, getOperationalOrders, searchOrders } from '../../../../utils/orderUtils'
import { textFieldStyles } from '../../../../styles/formStyles'

const STATE_FILTERS = [
  { value: '', label: 'Todos los pedidos' },
  { value: 'PENDIENTE', label: 'Pendientes', dot: 'orange' },
  { value: 'EN_PREPARACION', label: 'En preparación', dot: 'cyan' },
  { value: 'ENTREGADO', label: 'Entregados', dot: 'green' },
  { value: 'CANCELADO', label: 'Cancelados', dot: 'red' },
]

const ORDER_TABS = [
  { id: 'ABIERTA', label: 'Pedidos Activos' },
  { id: 'CERRADA', label: 'Historial Pedidos' },
]

const OrdersPanel = ({ operational = false }) => {
  const { selectedEstablishment } = useContext(WorkspaceContext)
  const { user } = useContext(SessionContext)
  const { openActionDialog } = useContext(ActionDialogContext)
  const idEstablecimiento = selectedEstablishment.idEstablecimiento
  const [stateFilter, setStateFilter] = useState('')
  const [sessionFilter, setSessionFilter] = useState('ABIERTA')
  const [search, setSearch] = useState('')
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 })
  const [dialog, setDialog] = useState(null)
  const readOnly = !operational && sessionFilter === 'CERRADA'
  const permission = useEstablishmentUsersQuery(idEstablecimiento)
  const isEncargado = permission.data?.some(
    (item) => item.email === user?.email && item.rolEstablecimiento === 'ENCARGADO'
  )
  const liveConnected = useOrderEvents(isEncargado ? idEstablecimiento : null)
  const ordersQuery = useOrdersQuery(
    isEncargado ? idEstablecimiento : null,
    liveConnected,
    operational ? 'ABIERTA' : sessionFilter,
  )
  const mutation = useUpdateOrderStateMutation(idEstablecimiento)
  const tablesQuery = useTablesQuery(operational && isEncargado ? idEstablecimiento : null, {
    refetchInterval: liveConnected ? false : 15000,
  })
  const orders = ordersQuery.data ?? []
  const searchedOrders = searchOrders(operational ? getOperationalOrders(orders) : orders, search)
  const filteredOrders = !operational && stateFilter
    ? searchedOrders.filter((order) => order.estado === stateFilter)
    : searchedOrders
  const error = permission.error || ordersQuery.error || (operational && tablesQuery.error)

  useEffect(() => {
    if (error) toast.error(error.response?.data?.message || error.message || 'No se pudieron cargar los pedidos.')
  }, [error])

  const handleAdvance = (order) => {
    const state = ORDER_STATES[order.estado]
    if (!state?.next || mutation.isPending) return
    openActionDialog({
      title: `${state.action} · Pedido #${order.idPedido}`,
      description: `Mesa ${order.codigoMesa}: el pedido pasará a ${ORDER_STATES[state.next].label.toLowerCase()}.`,
      actionLabel: state.action,
      icon: 'confirm',
      onAction: async () => {
        try {
          await mutation.mutateAsync({ idPedido: order.idPedido, estado: state.next })
          toast.success('Estado del pedido actualizado.')
        } catch (error) {
          toast.error(error.response?.data?.message || error.message || 'No se pudo actualizar el pedido.')
          throw error
        }
      },
    })
  }

  const handleRefresh = () => {
    if (!isEncargado) return
    ordersQuery.refetch()
    if (operational) tablesQuery.refetch()
  }

  if (!permission.isLoading && !isEncargado) {
    if (operational && !permission.error) return null
    return <p role={permission.error ? 'alert' : undefined} className="text-mesa-muted">
      {permission.error
        ? permission.error.response?.data?.message || 'No se pudieron comprobar los permisos del establecimiento.'
        : 'Solo el encargado puede gestionar los pedidos del establecimiento.'}
    </p>
  }

  return (
    <section className="min-w-0 space-y-8">
      {!operational && <DashboardPageHeader eyebrow={selectedEstablishment.nombre} title="Pedidos"
        description={readOnly
          ? 'Historial de cuentas cerradas: consultá pedidos y cuentas, sin modificar sus registros.'
          : 'Pedidos de cuentas abiertas, incluidos los entregados y cancelados.'}
        action={<DashboardRefreshButton onClick={handleRefresh}
          loading={ordersQuery.isFetching || permission.isLoading} tooltip="Recargar pedidos" />} />}

      {!operational && <div className="space-y-4">
        <DashboardTabs tabs={ORDER_TABS} value={sessionFilter} ariaLabel="Pedidos activos e historial"
          onChange={(value) => {
            setSessionFilter(value)
            setPaginationModel((current) => ({ ...current, page: 0 }))
          }} />
        <div role="group" aria-label="Filtrar pedidos por estado"
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {STATE_FILTERS.map(({ value, label, dot }) => (
            <DashboardSummaryCard key={value} label={label} dot={dot}
              value={value ? searchedOrders.filter((order) => order.estado === value).length : searchedOrders.length}
              active={stateFilter === value}
              onClick={() => {
                setStateFilter(value)
                setPaginationModel((current) => ({ ...current, page: 0 }))
              }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-4">
          <TextField label="Buscar pedidos" placeholder="Pedido, mesa, producto o cliente"
          value={search} onChange={(event) => {
            setSearch(event.target.value)
            setPaginationModel((current) => ({ ...current, page: 0 }))
          }}
          sx={{ ...textFieldStyles, width: { xs: '100%', sm: 300 } }}
          slotProps={{ input: { startAdornment: (
            <InputAdornment position="start"><SearchIcon sx={{ color: '#94A3B8' }} /></InputAdornment>
          ) } }} />
        </div>
      </div>}

      {ordersQuery.error && <p role="alert" className="text-red-400">No se pudieron actualizar los pedidos. Volvé a intentar con Actualizar.</p>}
      {operational ? (
        <OperationalOrdersBoard orders={filteredOrders} allOrders={orders} tables={tablesQuery.data ?? []}
          ordersLoading={permission.isLoading || ordersQuery.isLoading} tablesLoading={tablesQuery.isLoading}
          ordersError={ordersQuery.error} tablesError={tablesQuery.error}
          busy={mutation.isPending || Boolean(ordersQuery.error)}
          paginationModel={paginationModel} onPaginationModelChange={setPaginationModel}
          onViewOrder={(order) => setDialog({ type: 'detail', order })}
          onViewAccount={(order) => setDialog({ type: 'account', order })}
          onAdvance={handleAdvance} onCancel={(order) => setDialog({ type: 'cancel', order })}
          onRefresh={handleRefresh} refreshing={ordersQuery.isFetching || tablesQuery.isFetching || permission.isLoading}
          idEstablecimiento={idEstablecimiento} />
      ) : <Table rows={filteredOrders}
        paginationModel={paginationModel} onPaginationModelChange={setPaginationModel}
        columns={getOrderColumns({
          onAccount: (order) => setDialog({ type: 'account', order }),
          onAdvance: readOnly ? undefined : handleAdvance,
          onCancel: readOnly ? undefined : (order) => setDialog({ type: 'cancel', order }),
          busy: mutation.isPending || Boolean(ordersQuery.error),
        })}
        onRowClick={({ row }, event) => {
          if (!event.target.closest('[data-field="acciones"]')) setDialog({ type: 'detail', order: row })
        }}
        onCellKeyDown={({ row, field }, event) => {
          if (event.key === 'Enter' && field !== 'acciones') {
            event.preventDefault()
            setDialog({ type: 'detail', order: row })
          }
        }}
        sx={{
          '& .MuiDataGrid-row': { cursor: 'pointer', transition: 'background-color 150ms ease' },
          '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(16, 196, 252, 0.12)' },
        }}
        getRowId={(order) => order.idPedido} loading={permission.isLoading || ordersQuery.isLoading}
        emptyMessage={search.trim()
          ? 'No hay pedidos que coincidan con la búsqueda y los filtros.'
          : readOnly ? 'No hay pedidos de cuentas cerradas para estos filtros.' : 'No hay pedidos de cuentas abiertas para estos filtros.'}
        rowHeight={64} />}

      {dialog?.type === 'detail' && (
        <OrderDetailDialog idPedido={dialog.order.idPedido} liveConnected={liveConnected}
          onViewAccount={(order) => setDialog({ type: 'account', order })}
          onClose={() => setDialog(null)} />
      )}
      {!readOnly && dialog?.type === 'cancel' && (
        <CancelOrderDialog order={dialog.order} idEstablecimiento={idEstablecimiento} onClose={() => setDialog(null)} />
      )}
      {dialog?.type === 'account' && (
        <SessionAccountDialog idSesionMesa={dialog.order.idSesionMesa}
          idEstablecimiento={idEstablecimiento} liveConnected={liveConnected} readOnly={readOnly}
          onViewOrder={(order) => setDialog({ type: 'detail', order })}
          onClose={() => setDialog(null)} />
      )}
    </section>
  )
}

export default OrdersPanel
