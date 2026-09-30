
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { addEstablishmentUser } from '../../api/establishmentUserService'
import { queryKeys } from '../../api/queryClient'

const useAddEstablishmentUserMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userData) =>
      addEstablishmentUser(idEstablecimiento, userData),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishmentUsers(idEstablecimiento),
      })
    },
  })
}

export default useAddEstablishmentUserMutation
