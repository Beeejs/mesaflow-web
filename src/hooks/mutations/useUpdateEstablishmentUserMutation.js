
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { updateEstablishmentUser } from '../../api/establishmentUserService'
import { queryKeys } from '../../api/queryClient'

const useUpdateEstablishmentUserMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ idUsuario, idRolEstablecimiento }) =>
      updateEstablishmentUser(
        idEstablecimiento,
        idUsuario,
        { idRolEstablecimiento }
      ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishmentUsers(idEstablecimiento),
      })
    },
  })
}

export default useUpdateEstablishmentUserMutation
