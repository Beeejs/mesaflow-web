import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { createProductCategory } from '../../api/productCategoryService'
import { queryKeys } from '../../api/queryClient'

const useCreateProductCategoryMutation = (idEstablecimiento) => {
  // Hooks
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProductCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.productCategories(idEstablecimiento),
      })
    },
  })
}

export default useCreateProductCategoryMutation