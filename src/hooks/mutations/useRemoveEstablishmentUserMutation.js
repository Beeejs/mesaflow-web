
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { removeEstablishmentUser } from '../../api/establishmentUserService'
import { queryKeys } from '../../api/queryClient'

const useRemoveEstablishmentUserMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idUsuario) =>
      removeEstablishmentUser(idEstablecimiento, idUsuario),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishmentUsers(idEstablecimiento),
      })
    },
  })
}

export default useRemoveEstablishmentUserMutation
