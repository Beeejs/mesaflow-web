import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateOrderState } from '../../api/orderService'
import { queryKeys } from '../../api/queryClient'

const useUpdateOrderStateMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateOrderState,
    onSuccess: (order) => {
      queryClient.setQueryData(queryKeys.order(order.idPedido), order)
      queryClient.invalidateQueries({ queryKey: queryKeys.orders(idEstablecimiento) })
      queryClient.invalidateQueries({ queryKey: queryKeys.sessionAccount(order.idSesionMesa) })
      queryClient.invalidateQueries({ queryKey: queryKeys.products(idEstablecimiento) })
      queryClient.invalidateQueries({ queryKey: queryKeys.stockMovementsPrefix(idEstablecimiento) })
    },
  })
}

export default useUpdateOrderStateMutation
