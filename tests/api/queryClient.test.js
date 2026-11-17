import { test } from 'node:test'
import assert from 'node:assert/strict'
import { QueryClient, QueryObserver } from '@tanstack/react-query'
import { queryKeys } from '../../src/api/queryClient.js'
import { createOrderRefreshQueue, refreshOrderQueries } from '../../src/api/orderEvents.js'

test('una rafaga SSE recarga una vez por consulta, conserva avisos tardios y cancela HTTP al salir', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, gcTime: Infinity } },
  })
  const keys = [queryKeys.orders(1), queryKeys.tables(1)]
  const requests = []
  let active = 0
  let peak = 0
  let aborted = 0
  const queryFn = ({ signal }) => new Promise((resolve, reject) => {
    active++
    peak = Math.max(peak, active)
    let settled = false
    const finish = (value, cancelled = false) => {
      if (settled) return
      settled = true
      active--
      signal.removeEventListener('abort', cancel)
      if (cancelled) {
        aborted++
        reject(new Error('Consulta cancelada'))
      } else {
        resolve(value)
      }
    }
    const cancel = () => finish(undefined, true)
    signal.addEventListener('abort', cancel, { once: true })
    requests.push({ complete: finish })
  })
  const observers = keys.map((queryKey) => new QueryObserver(client, { queryKey, queryFn }))
  const unsubscribe = observers.map((observer) => observer.subscribe(() => {}))
  const queue = createOrderRefreshQueue((isActive) => refreshOrderQueries(client, keys, isActive))
  const waitFor = async (condition) => {
    const deadline = Date.now() + 2000
    while (!condition()) {
      assert.ok(Date.now() < deadline, 'La recarga debe terminar sin bloquearse')
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }
  try {
    const initial = Promise.all(observers.map((observer) => observer.refetch({ cancelRefetch: false })))
    requests.forEach((request) => request.complete(0))
    await initial
    assert.equal(requests.length, 2)
    peak = 0

    for (let i = 0; i < 5; i++) queue.request()
    await waitFor(() => requests.length === 4)
    assert.equal(active, 2)
    assert.equal(peak, 2)
    assert.equal(aborted, 0)

    queue.request()
    requests[2].complete(1)
    requests[3].complete(1)
    await waitFor(() => requests.length === 6)
    assert.equal(peak, 2)
    requests[4].complete(2)
    requests[5].complete(2)
    await waitFor(() => keys.every((key) => client.getQueryData(key) === 2))

    queue.request()
    await waitFor(() => requests.length === 8)
    queue.request()
    queue.stop()
    unsubscribe.forEach((stop) => stop())
    assert.equal(active, 0)
    assert.equal(aborted, 2)
    await new Promise((resolve) => setTimeout(resolve, 300))
    assert.equal(requests.length, 8)
  } finally {
    queue.stop()
    unsubscribe.forEach((stop) => stop())
    client.clear()
  }
})

test('un evento durante una consulta previa fuerza datos nuevos y salir evita una recarga posterior', async () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity, gcTime: Infinity } },
  })
  const key = queryKeys.orders(1)
  const requests = []
  const observer = new QueryObserver(client, {
    queryKey: key,
    queryFn: ({ signal }) => new Promise((resolve, reject) => {
      signal.addEventListener('abort', () => reject(new Error('Consulta cancelada')), { once: true })
      requests.push(resolve)
    }),
  })
  const unsubscribe = observer.subscribe(() => {})
  const queue = createOrderRefreshQueue((isActive) => refreshOrderQueries(client, [key], isActive))
  const waitFor = async (condition) => {
    const deadline = Date.now() + 2000
    while (!condition()) {
      assert.ok(Date.now() < deadline, 'La sincronizacion debe terminar sin perder el evento')
      await new Promise((resolve) => setTimeout(resolve, 10))
    }
  }
  try {
    queue.request()
    await new Promise((resolve) => setTimeout(resolve, 300))
    assert.equal(requests.length, 1)
    requests[0]('resultado anterior al evento')
    await waitFor(() => requests.length === 2)
    requests[1]('resultado posterior al evento')
    await waitFor(() => client.getQueryData(key) === 'resultado posterior al evento')

    const manualRefresh = observer.refetch({ cancelRefetch: false })
    assert.equal(requests.length, 3)
    queue.request()
    await new Promise((resolve) => setTimeout(resolve, 300))
    queue.stop()
    unsubscribe()
    await manualRefresh
    await new Promise((resolve) => setTimeout(resolve, 300))
    assert.equal(requests.length, 3)
  } finally {
    queue.stop()
    unsubscribe()
    client.clear()
  }
})

test('las cuentas abiertas, cerradas e historial no comparten resultados y se invalidan juntas', async () => {
  const client = new QueryClient()
  const all = queryKeys.orders(1)
  const open = queryKeys.orders(1, 'ABIERTA')
  const closed = queryKeys.orders(1, 'CERRADA')
  const other = queryKeys.orders(2, 'ABIERTA')
  try {
    client.setQueryData(all, [{ idPedido: 1 }, { idPedido: 2 }])
    client.setQueryData(open, [{ idPedido: 1 }])
    client.setQueryData(closed, [{ idPedido: 2 }])
    client.setQueryData(other, [{ idPedido: 3 }])
    assert.deepEqual(client.getQueryData(all), [{ idPedido: 1 }, { idPedido: 2 }])
    assert.deepEqual(client.getQueryData(open), [{ idPedido: 1 }])
    assert.deepEqual(client.getQueryData(closed), [{ idPedido: 2 }])
    await client.invalidateQueries({ queryKey: queryKeys.orders(1) })
    for (const key of [all, open, closed]) {
      assert.equal(client.getQueryState(key).isInvalidated, true)
    }
    assert.equal(client.getQueryState(other).isInvalidated, false)
  } finally {
    client.clear()
  }
})
