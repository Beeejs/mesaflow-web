import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { createProduct } from '../../api/productService'
import { queryKeys } from '../../api/queryClient'

const useCreateProductMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products(idEstablecimiento),
      })
    },
  })
}

export default useCreateProductMutation