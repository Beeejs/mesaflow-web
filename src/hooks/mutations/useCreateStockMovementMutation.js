import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

/* API */
import { createStockMovement } from '../../api/stockService'
import { queryKeys } from '../../api/queryClient'

const useCreateStockMovementMutation = (
  idEstablecimiento
) => {
  // Hooks
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createStockMovement,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey:
          queryKeys.products(
            idEstablecimiento
          ),
      })

      queryClient.invalidateQueries({
        queryKey:
          queryKeys.stockMovementsPrefix(
            idEstablecimiento
          ),
      })
    },
  })
}

export default useCreateStockMovementMutation