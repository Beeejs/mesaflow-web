import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { deleteProduct } from '../../api/productService'
import { queryKeys } from '../../api/queryClient'

const useDeleteProductMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.products(idEstablecimiento),
      })
    },
  })
}

export default useDeleteProductMutation