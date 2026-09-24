
import {
  useMutation,
  useQueryClient,
} from '@tanstack/react-query'

/* Api */
import { updateEstablishment } from '../../api/establishmentService'

/* Query Keys */
import { queryKeys } from '../../api/queryClient'

const useUpdateEstablishmentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      idEstablecimiento,
      establishmentData,
    }) => {
      return updateEstablishment(
        idEstablecimiento,
        establishmentData
      )
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.establishments,
      })

      queryClient.invalidateQueries({
        queryKey: queryKeys.myEstablishments,
      })
    },
  })
}

export default useUpdateEstablishmentMutation