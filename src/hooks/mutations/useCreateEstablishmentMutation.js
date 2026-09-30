import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { createEstablishment } from '../../api/establishmentService'
import { queryKeys } from '../../api/queryClient'

const useCreateEstablishmentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createEstablishment,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments,
      })
    },
  })
}

export default useCreateEstablishmentMutation