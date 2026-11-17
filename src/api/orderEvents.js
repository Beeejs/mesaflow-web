const ORDER_EVENTS = [
  'PEDIDO_NUEVO',
  'PEDIDO_ACTUALIZADO',
  'PEDIDO_CANCELADO',
  'SESION_CERRADA',
]

export const refreshOrderQueries = async (queryClient, keys, isActive) => {
  await Promise.all(keys.map((queryKey) => queryClient.refetchQueries(
    { queryKey, type: 'active', fetchStatus: 'fetching' },
    { cancelRefetch: false },
  )))
  if (!isActive()) return
  await Promise.all(keys.map((queryKey) =>
    queryClient.invalidateQueries({ queryKey }, { cancelRefetch: false })
  ))
}

export const createOrderRefreshQueue = (refresh) => {
  let timer
  let running = false
  let pending = false
  let stopped = false

  const run = async () => {
    timer = undefined
    if (stopped || running || !pending) return
    pending = false
    running = true
    try {
      await refresh(() => !stopped)
    } catch (error) {
      console.error('No se pudieron sincronizar los pedidos en tiempo real.', error)
    } finally {
      running = false
      if (pending && !stopped) timer = setTimeout(run, 250)
    }
  }

  return {
    request(immediate = false) {
      if (stopped) return
      pending = true
      if (running) return
      if (immediate) {
        clearTimeout(timer)
        void run()
      } else if (timer === undefined) {
        timer = setTimeout(run, 250)
      }
    },
    stop() {
      stopped = true
      clearTimeout(timer)
    },
  }
}

export const subscribeOrderEvents = (url, { onConnected, onDisconnected, onChange }) => {
  let source
  let retryTimer
  let stopped = false

  const handleResume = () => {
    if (!stopped) onChange()
  }
  const handleVisibilityChange = () => {
    if (document.visibilityState === 'visible') handleResume()
  }

  const connect = () => {
    retryTimer = undefined
    if (stopped) return
    try {
      const current = new EventSource(url, { withCredentials: true })
      source = current
      current.addEventListener('CONECTADO', () => {
        if (!stopped && current === source) onConnected()
      })
      current.onerror = () => {
        if (stopped || current !== source) return
        onDisconnected()
        if (current.readyState === EventSource.CLOSED && !retryTimer) {
          retryTimer = setTimeout(connect, 10000)
        }
      }
      ORDER_EVENTS.forEach((event) => current.addEventListener(event, () => {
        if (!stopped && current === source) onChange()
      }))
    } catch (error) {
      console.error('No se pudo iniciar la conexión de pedidos en tiempo real.', error)
      onDisconnected()
      if (!stopped) retryTimer = setTimeout(connect, 10000)
    }
  }

  document.addEventListener('visibilitychange', handleVisibilityChange)
  window.addEventListener('online', handleResume)
  connect()

  return () => {
    stopped = true
    clearTimeout(retryTimer)
    document.removeEventListener('visibilitychange', handleVisibilityChange)
    window.removeEventListener('online', handleResume)
    source?.close()
  }
}
