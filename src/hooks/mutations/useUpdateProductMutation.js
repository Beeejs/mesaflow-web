import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { updateProduct } from '../../api/productService'
import { queryKeys } from '../../api/queryClient'

const useUpdateProductMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: updateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products(idEstablecimiento),
      })
    },
  })
}

export default useUpdateProductMutation