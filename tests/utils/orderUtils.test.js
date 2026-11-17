import { test } from 'node:test'
import assert from 'node:assert/strict'
import { ORDER_STATES, canCancelOrder, canCloseAccount, filterOperationalOrders, getOperationalOrders, searchOrders } from '../../src/utils/orderUtils.js'

test('los filtros de Inicio seleccionan pedidos sin modificar pedidos ni mesas originales', () => {
  const orders = [
    { idPedido: 1, idMesa: '1', estado: 'PENDIENTE' },
    { idPedido: 2, idMesa: 2, estado: 'EN_PREPARACION' },
    { idPedido: 3, idMesa: 1, estado: 'ENTREGADO' },
    { idPedido: 4, idMesa: 1, estado: 'CANCELADO' },
    { idPedido: 5, idMesa: 3, estado: 'PENDIENTE' },
  ]
  const tables = [
    { idMesa: 1, estado: 'OCUPADA', activa: true },
    { idMesa: 2, estado: 'RESERVADA', activa: true },
    { idMesa: 3, estado: 'OCUPADA', activa: false },
  ]
  assert.deepEqual(filterOperationalOrders(orders, '', tables), [orders[0], orders[1], orders[2], orders[4]])
  assert.deepEqual(filterOperationalOrders(orders, 'PENDIENTE', tables), [orders[0], orders[4]])
  assert.deepEqual(filterOperationalOrders(orders, 'EN_PREPARACION', tables), [orders[1]])
  assert.deepEqual(filterOperationalOrders(orders, 'OCUPADA', tables), [orders[0], orders[2]])
  assert.deepEqual(filterOperationalOrders(orders, 'OCUPADA', []), [])
  assert.equal(orders.length, 5)
  assert.equal(tables.length, 3)
})

test('Inicio conserva entregados de cuentas abiertas y oculta cancelados sin alterar el historial', () => {
  const orders = [
    { idPedido: 1, estado: 'PENDIENTE' },
    { idPedido: 2, estado: 'EN_PREPARACION' },
    { idPedido: 3, estado: 'ENTREGADO' },
    { idPedido: 4, estado: 'CANCELADO' },
  ]
  assert.deepEqual(getOperationalOrders(orders), orders.slice(0, 3))
  assert.equal(orders.length, 4)
  assert.deepEqual(getOperationalOrders([]), [])
})

test('el encargado puede avanzar directamente de preparacion a entregado', () => {
  assert.equal(ORDER_STATES.PENDIENTE.next, 'EN_PREPARACION')
  assert.equal(ORDER_STATES.EN_PREPARACION.next, 'ENTREGADO')
  assert.equal(ORDER_STATES.LISTO, undefined)
})

test('busqueda instantanea combina palabras sin distinguir mayusculas ni acentos', () => {
  const orders = [
    { idPedido: 12, codigoMesa: 'T-3', idUsuarioCliente: 7, estado: 'PENDIENTE',
      detalles: [{ nombreProducto: 'Cóctel', observaciones: 'Sin azúcar' }] },
    { idPedido: 13, codigoMesa: 'S-1', idUsuarioCliente: 8, estado: 'ENTREGADO',
      detalles: [{ nombreProducto: 'Pizza' }] },
  ]
  assert.deepEqual(searchOrders(orders, ' T-3 COCTEL '), [orders[0]])
  assert.deepEqual(searchOrders(orders, '#12 sin azucar'), [orders[0]])
  assert.deepEqual(searchOrders(orders, 'pizza').filter((order) => order.estado === 'PENDIENTE'), [])
  assert.deepEqual(searchOrders(orders, '8'), [orders[1]])
  assert.deepEqual(searchOrders(orders, 'inexistente'), [])
  assert.deepEqual(searchOrders(orders, '  '), orders)
})

test('cancelacion disponible solo para pedidos pendientes o en preparacion', () => {
  assert.equal(canCancelOrder({ estado: 'PENDIENTE' }), true)
  assert.equal(canCancelOrder({ estado: 'EN_PREPARACION' }), true)
  for (const estado of ['LISTO', 'ENTREGADO', 'CANCELADO', 'DESCONOCIDO']) {
    assert.equal(canCancelOrder({ estado }), false)
  }
})

test('no cerrar una cuenta abierta mientras haya un pedido sin resolver', () => {
  for (const estado of ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'DESCONOCIDO']) {
    assert.equal(canCloseAccount({
      estado: 'ABIERTA',
      pedidos: [{ estado: 'ENTREGADO' }, { estado }],
    }), false)
  }
  assert.equal(canCloseAccount({
    estado: 'ABIERTA',
    pedidos: [{ estado: 'ENTREGADO' }, { estado: 'CANCELADO' }],
  }), true)
})

test('no habilitar cierre sin datos de cuenta o para una cuenta cerrada', () => {
  assert.equal(canCloseAccount(null), false)
  assert.equal(canCloseAccount({ estado: 'ABIERTA' }), false)
  assert.equal(canCloseAccount({ estado: 'CERRADA', pedidos: [{ estado: 'ENTREGADO' }] }), false)
})
