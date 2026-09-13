import { useMutation, useQueryClient } from '@tanstack/react-query'

/* Api */
import { updateUser } from '../../api/userService'

/* Query Keys */
import { queryKeys } from '../../api/queryClient'

const useUpdateUserMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ idUsuario, userData }) => {
      return updateUser(idUsuario, userData)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.users,
      })
    },
  })
}

export default useUpdateUserMutation