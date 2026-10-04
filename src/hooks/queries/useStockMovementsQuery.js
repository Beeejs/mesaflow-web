import { useQuery } from '@tanstack/react-query'

/* API */
import { listStockMovements } from '../../api/stockService'
import { queryKeys } from '../../api/queryClient'

const useStockMovementsQuery = (idEstablecimiento) => {
  return useQuery({
    queryKey: queryKeys.stockMovements(idEstablecimiento),
    queryFn: () => listStockMovements(idEstablecimiento),
    enabled: Boolean(idEstablecimiento),
  })
}

export default useStockMovementsQuery