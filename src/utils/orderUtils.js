export const ORDER_STATES = {
  PENDIENTE: { label: 'Pendiente', color: 'text-orange-400', next: 'EN_PREPARACION', action: 'Preparar' },
  EN_PREPARACION: { label: 'En preparación', color: 'text-mesa-cyan-light', next: 'ENTREGADO', action: 'Marcar entregado' },
  ENTREGADO: { label: 'Entregado', color: 'text-mesa-muted' },
  CANCELADO: { label: 'Cancelado', color: 'text-red-400' },
}

export const canCancelOrder = (order) =>
  order.estado === 'PENDIENTE' || order.estado === 'EN_PREPARACION'

export const getOperationalOrders = (orders) =>
  orders.filter((order) => order.estado !== 'CANCELADO')

export const filterOperationalOrders = (orders, filter, tables) => {
  const operational = getOperationalOrders(orders)
  if (filter === 'OCUPADA') {
    const occupiedIds = new Set(tables
      .filter((table) => table.activa !== false && table.estado === 'OCUPADA')
      .map((table) => Number(table.idMesa)))
    return operational.filter((order) => occupiedIds.has(Number(order.idMesa)))
  }
  return filter ? operational.filter((order) => order.estado === filter) : operational
}

const normalizeSearch = (value) => String(value ?? '')
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()

export const searchOrders = (orders, search) => {
  const terms = normalizeSearch(search).trim().split(/\s+/).filter(Boolean)
  if (!terms.length) return orders

  return orders.filter((order) => {
    const text = normalizeSearch([
      order.idPedido,
      `#${order.idPedido}`,
      order.codigoMesa,
      order.idUsuarioCliente,
      order.idSesionMesa,
      ORDER_STATES[order.estado]?.label,
      order.motivoCancelacion,
      ...(order.detalles ?? []).flatMap((item) => [
        item.nombreProducto,
        item.observaciones,
      ]),
    ].join(' '))
    return terms.every((term) => text.includes(term))
  })
}

export const canCloseAccount = (account) =>
  account?.estado === 'ABIERTA' &&
  Array.isArray(account.pedidos) &&
  account.pedidos.every((order) =>
    order.estado === 'ENTREGADO' || order.estado === 'CANCELADO'
  )
