import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Pagination from '@mui/material/Pagination'
import { Link } from 'react-router'
import DefaultButton from '../../../common/button/DefaultButton'
import DashboardSummaryCard from '../../DashboardSummaryCard'
import DashboardRefreshButton from '../../DashboardRefreshButton'
import { ORDER_STATES, canCancelOrder, filterOperationalOrders } from '../../../../utils/orderUtils'
import { getTableState } from '../../../../utils/tableStateUtils'
import { formatPrice } from '../../../../utils/productUtils'

const OperationalOrdersBoard = ({
  orders,
  allOrders,
  tables,
  ordersLoading,
  tablesLoading,
  tablesError,
  ordersError,
  busy,
  paginationModel,
  onPaginationModelChange,
  onViewOrder,
  onViewAccount,
  onAdvance,
  onCancel,
  onRefresh,
  refreshing,
  idEstablecimiento,
}) => {
  const [activeFilter, setActiveFilter] = useState('')
  const enabledTables = tables.filter((table) => table.activa !== false)
  const occupiedTables = enabledTables.filter((table) => table.estado === 'OCUPADA').length
  const remainingTables = enabledTables.length - occupiedTables
  const occupancy = enabledTables.length ? occupiedTables / enabledTables.length * 100 : 0
  const accounts = new Set(allOrders.map((order) => order.idSesionMesa)).size
  const pending = allOrders.filter((order) => order.estado === 'PENDIENTE').length
  const preparing = allOrders.filter((order) => order.estado === 'EN_PREPARACION').length
  const filteredOrders = filterOperationalOrders(orders, activeFilter, tables)
  const pageCount = Math.ceil(filteredOrders.length / paginationModel.pageSize)
  const page = Math.min(paginationModel.page, Math.max(0, pageCount - 1))
  const pageOrders = filteredOrders.slice(page * paginationModel.pageSize, (page + 1) * paginationModel.pageSize)
  const orderValue = (value) => ordersLoading || ordersError ? '-' : value
  const selectFilter = (filter) => {
    setActiveFilter(filter)
    onPaginationModelChange({ ...paginationModel, page: 0 })
  }
  const filterTitle = activeFilter === 'OCUPADA' ? 'Pedidos de mesas ocupadas'
    : activeFilter === 'PENDIENTE' ? 'Pedidos por preparar'
    : activeFilter === 'EN_PREPARACION' ? 'Pedidos por entregar'
    : 'Pedidos de cuentas abiertas'

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <article className="rounded-2xl border border-mesa-border bg-mesa-surface px-6 py-5">
          <p className="text-sm font-medium text-mesa-muted">Ingresos de hoy</p>
          <p className="font-display mt-2 text-2xl font-bold text-mesa-muted">Pendiente</p>
          <p className="mt-1 text-xs text-mesa-muted">Sin integración de cobros</p>
        </article>
        <DashboardSummaryCard label="Cuentas abiertas" value={orderValue(accounts)} dot="cyan"
          active={activeFilter === ''} onClick={() => selectFilter('')} />
        <DashboardSummaryCard label="Pedidos por preparar" value={orderValue(pending)} dot="orange"
          active={activeFilter === 'PENDIENTE'} onClick={() => selectFilter('PENDIENTE')} />
        <DashboardSummaryCard label="Pedidos por entregar" value={orderValue(preparing)} dot="green"
          active={activeFilter === 'EN_PREPARACION'} onClick={() => selectFilter('EN_PREPARACION')} />
        <DashboardSummaryCard label="Ocupación de mesas"
          active={activeFilter === 'OCUPADA'} onClick={() => selectFilter('OCUPADA')}>
          {tablesLoading || tablesError ? (
            <p className="font-display mt-2 text-3xl font-bold text-mesa-text">-</p>
          ) : (
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <div className="relative h-20 w-20 shrink-0" role="img"
                aria-label={enabledTables.length
                  ? `${occupiedTables} de ${enabledTables.length} mesas habilitadas ocupadas, ${Math.round(occupancy)} por ciento`
                  : 'Sin mesas habilitadas'}>
                <CircularProgress variant="determinate" value={100} size={80} thickness={5}
                  aria-hidden="true" sx={{ color: enabledTables.length ? '#10C4FC' : '#1F2937', position: 'absolute', inset: 0 }} />
                <CircularProgress variant="determinate" value={occupancy} size={80} thickness={5}
                  aria-hidden="true" sx={{ color: '#F97316', position: 'absolute', inset: 0 }} />
                <span aria-hidden="true" className="absolute inset-0 flex items-center justify-center font-display text-xl font-bold text-mesa-text">
                  {enabledTables.length ? `${Math.round(occupancy)}%` : '-'}
                </span>
              </div>
              {enabledTables.length ? (
                <div className="space-y-2 text-xs text-mesa-muted">
                  <p className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-orange-500" />
                    Ocupadas: <strong className="text-mesa-text">{occupiedTables}</strong>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <span className="h-2 w-2 shrink-0 rounded-full bg-mesa-cyan-light" />
                    Restantes: <strong className="text-mesa-text">{remainingTables}</strong>
                  </p>
                </div>
              ) : <p className="text-xs text-mesa-muted">Sin mesas habilitadas</p>}
            </div>
          )}
        </DashboardSummaryCard>
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <section className="min-w-0 overflow-hidden rounded-2xl border border-mesa-border bg-mesa-surface">
          <div className="flex items-center justify-between gap-4 border-b border-mesa-border px-6 py-5">
            <div>
              <h2 className="font-display text-xl font-bold text-mesa-text">{filterTitle}</h2>
              <p className="mt-2 text-sm text-mesa-muted">Los entregados permanecen hasta cerrar la cuenta. Cancelados en la cuenta o en Pedidos.</p>
            </div>
            <DashboardRefreshButton onClick={onRefresh} loading={refreshing} tooltip="Actualizar operación" />
          </div>
          {activeFilter === 'OCUPADA' && tablesError ? (
            <p role="alert" className="p-6 text-red-400">No se pueden filtrar los pedidos por mesa hasta actualizar su estado.</p>
          ) : ordersLoading || (activeFilter === 'OCUPADA' && tablesLoading) ? (
            <p role="status" className="p-6 text-mesa-muted">Cargando pedidos...</p>
          ) : !filteredOrders.length && !ordersError ? (
            <p className="p-6 text-mesa-muted">{activeFilter ? 'No hay pedidos para este filtro.' : 'No hay pedidos de cuentas abiertas.'}</p>
          ) : (
            <div className="divide-y divide-mesa-border">
              {pageOrders.map((order) => {
                const state = ORDER_STATES[order.estado]
                return (
                  <article key={order.idPedido} className="p-6 transition hover:bg-mesa-primary/5 focus-within:bg-mesa-primary/5">
                    <button type="button" onClick={() => onViewOrder(order)}
                      aria-label={`Ver pedido #${order.idPedido} de mesa ${order.codigoMesa}`}
                      className="block w-full cursor-pointer rounded-lg text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-mesa-primary">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <span className="rounded-lg border border-mesa-primary/40 bg-mesa-primary/10 px-3 py-1 text-sm font-bold text-mesa-cyan-light">
                          Pedido #{order.idPedido}
                        </span>
                        <span className={`rounded-full border border-mesa-border px-3 py-1 text-xs font-bold ${state?.color ?? 'text-mesa-muted'}`}>
                          {state?.label ?? order.estado}
                        </span>
                      </div>
                      <p className="mt-4 text-lg font-bold text-mesa-text">Mesa {order.codigoMesa}</p>
                      <p className="mt-1 break-words text-sm leading-6 text-mesa-muted">
                        {order.detalles.map((item) => `${item.nombreProducto} ×${item.cantidad}`).join(', ')}
                      </p>
                      <p className="mt-3 text-lg font-bold text-mesa-text">{formatPrice(order.total)}</p>
                    </button>
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <DefaultButton variant="secondary" onClick={() => onViewAccount(order)}
                        sx={{ padding: '8px 16px', color: '#10C4FC' }}>Ver cuenta</DefaultButton>
                      {state?.next && (
                        <DefaultButton disabled={busy} onClick={() => onAdvance(order)}
                          sx={{
                            padding: '8px 16px', color: '#4ADE80', backgroundColor: 'rgba(34, 197, 94, 0.22)',
                            border: '1px solid rgba(34, 197, 94, 0.55)', boxShadow: 'none',
                            '&:hover': { color: '#86EFAC', backgroundColor: 'rgba(34, 197, 94, 0.35)' },
                          }}>{state.action}</DefaultButton>
                      )}
                      {canCancelOrder(order) && (
                        <DefaultButton variant="secondary" disabled={busy} onClick={() => onCancel(order)}
                          sx={{
                            padding: '8px 16px', color: '#F87171', backgroundColor: 'rgba(239, 68, 68, 0.22)',
                            border: '1px solid rgba(239, 68, 68, 0.55)',
                            '&:hover': { color: '#FCA5A5', backgroundColor: 'rgba(239, 68, 68, 0.35)' },
                          }}>Cancelar pedido</DefaultButton>
                      )}
                      {order.estado === 'ENTREGADO' && <span className="text-sm text-mesa-muted">Cuenta abierta</span>}
                    </div>
                  </article>
                )
              })}
            </div>
          )}
          {pageCount > 1 && <div className="flex justify-center border-t border-mesa-border p-4">
            <Pagination count={pageCount} page={page + 1}
              onChange={(_event, nextPage) => onPaginationModelChange({ ...paginationModel, page: nextPage - 1 })}
              sx={{
                '& .MuiPaginationItem-root': { color: '#94A3B8' },
                '& .Mui-selected': { color: '#10C4FC', backgroundColor: 'rgba(16, 196, 252, 0.15)' },
              }} />
          </div>}
        </section>

        <div className="min-w-0 space-y-6">
          <section className="rounded-2xl border border-mesa-border bg-mesa-surface">
            <h2 className="border-b border-mesa-border px-6 py-5 font-display text-xl font-bold text-mesa-text">Reservas de hoy</h2>
            <div className="p-6">
              <p className="text-mesa-muted">Sin Reservas</p>
              <p className="mt-2 text-xs text-mesa-muted">Vista pendiente de integración</p>
            </div>
          </section>
          <section className="min-w-0 rounded-2xl border border-mesa-border bg-mesa-surface">
          <div className="flex items-center justify-between gap-4 border-b border-mesa-border px-6 py-5">
            <h2 className="font-display text-xl font-bold text-mesa-text">Estado de mesas</h2>
            <Link to={`/dashboard/mis-establecimientos/${idEstablecimiento}/mesas`}
              className="text-sm font-semibold text-mesa-cyan-light hover:underline">Ver mesas</Link>
          </div>
          <div className="p-6">
            {tablesError ? (
              <p role="alert" className="text-red-400">No se pudo actualizar el estado de las mesas. Volvé a intentar con Actualizar.</p>
            ) : tablesLoading ? (
              <p role="status" className="text-mesa-muted">Cargando mesas...</p>
            ) : !enabledTables.length ? (
              <p className="text-mesa-muted">No hay mesas habilitadas.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {enabledTables.map((table) => {
                  const state = getTableState(table.estado)
                  return <div key={table.idMesa} className={`flex min-h-24 flex-col items-center justify-center rounded-xl border p-3 text-center ${state.classes}`}>
                    <span className="text-lg font-bold">{table.codigo}</span>
                    <span className="mt-1 text-xs">{state.label}</span>
                  </div>
                })}
              </div>
            )}
          </div>
          </section>
        </div>
      </div>
    </div>
  )
}

export default OperationalOrdersBoard
