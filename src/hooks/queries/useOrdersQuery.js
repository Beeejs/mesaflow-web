import { useQuery } from '@tanstack/react-query'
import { listOrders } from '../../api/orderService'
import { queryKeys } from '../../api/queryClient'

const useOrdersQuery = (idEstablecimiento, connected, sesionEstado = '') => useQuery({
  queryKey: queryKeys.orders(idEstablecimiento, sesionEstado),
  queryFn: ({ signal }) => listOrders(idEstablecimiento, sesionEstado, signal),
  enabled: Boolean(idEstablecimiento),
  refetchInterval: connected ? false : 15000,
  refetchOnMount: 'always',
})

export default useOrdersQuery
