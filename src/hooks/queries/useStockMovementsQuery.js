import { useQuery } from '@tanstack/react-query'

/* API */
import { listStockMovements } from '../../api/stockService'
import { queryKeys } from '../../api/queryClient'

const useStockMovementsQuery = (
  idEstablecimiento,
  products = [],
  enabled = true
) => {
  const productIds = products
    .filter((product) => product.controlaStock && product.stockInicializado)
    .map((product) => product.idProducto)

  return useQuery({
    queryKey: queryKeys.stockMovements(idEstablecimiento, productIds),
    queryFn: () => listStockMovements(idEstablecimiento, products),
    enabled: Boolean(idEstablecimiento) && enabled,
  })
}

export default useStockMovementsQuery