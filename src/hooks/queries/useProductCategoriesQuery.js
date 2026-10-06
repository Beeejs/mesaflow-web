import { useQuery } from '@tanstack/react-query'

/* API */
import { listProductCategories } from '../../api/productCategoryService'
import { queryKeys } from '../../api/queryClient'

const useProductCategoriesQuery = (idEstablecimiento) => {
  return useQuery({
    queryKey: queryKeys.productCategories(idEstablecimiento),
    queryFn: () => listProductCategories(idEstablecimiento),
    enabled: Boolean(idEstablecimiento),
  })
}

export default useProductCategoriesQuery