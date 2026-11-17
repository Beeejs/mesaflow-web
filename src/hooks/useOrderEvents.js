import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import api from '../api/axiosConfig'
import { createOrderRefreshQueue, refreshOrderQueries, subscribeOrderEvents } from '../api/orderEvents'
import { queryKeys } from '../api/queryClient'

const useOrderEvents = (idEstablecimiento) => {
  const queryClient = useQueryClient()
  const [connection, setConnection] = useState(null)
  const connected = Boolean(idEstablecimiento) &&
    connection?.idEstablecimiento === idEstablecimiento && connection.connected

  useEffect(() => {
    if (!idEstablecimiento) return

    const refreshQueue = createOrderRefreshQueue((isActive) => refreshOrderQueries(queryClient, [
      queryKeys.orders(idEstablecimiento),
      ['orders'],
      ['session-accounts'],
      queryKeys.tables(idEstablecimiento),
      queryKeys.tableDistributionsPrefix(idEstablecimiento),
      queryKeys.products(idEstablecimiento),
      queryKeys.stockMovementsPrefix(idEstablecimiento),
    ], isActive))

    const unsubscribe = subscribeOrderEvents(
      api.getUri({ url: `/api/establecimientos/${idEstablecimiento}/pedidos/eventos` }),
      {
        onConnected: () => {
          setConnection({ idEstablecimiento, connected: true })
          refreshQueue.request(true)
        },
        onDisconnected: () => setConnection({ idEstablecimiento, connected: false }),
        onChange: () => refreshQueue.request(),
      },
    )
    return () => {
      unsubscribe()
      refreshQueue.stop()
    }
  }, [idEstablecimiento, queryClient])

  return connected
}

export default useOrderEvents
