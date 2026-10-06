import { useQuery } from '@tanstack/react-query'

/* API */
import { listStockMovementReasons } from '../../api/stockService'
import { queryKeys } from '../../api/queryClient'

const useStockMovementReasonsQuery = (
  idEstablecimiento,
  tipoMovimiento
) => {
  return useQuery({
    queryKey: queryKeys.stockMovementReasons(
      idEstablecimiento,
      tipoMovimiento
    ),
    queryFn: () =>
      listStockMovementReasons(
        idEstablecimiento,
        tipoMovimiento
      ),
    enabled: Boolean(
      idEstablecimiento &&
      tipoMovimiento
    ),
  })
}

export default useStockMovementReasonsQuery