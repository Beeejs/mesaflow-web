import { useQuery } from '@tanstack/react-query'

/* API */
import { listProducts } from '../../api/productService'
import { queryKeys } from '../../api/queryClient'

const useProductsQuery = (idEstablecimiento) => {
  return useQuery({
    queryKey: queryKeys.products(idEstablecimiento),
    queryFn: () => listProducts(idEstablecimiento),
    enabled: Boolean(idEstablecimiento),
  })
}

export default useProductsQuery