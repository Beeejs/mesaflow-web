
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* Services */
import { deleteTableConfiguration } from '../../api/tableConfigurationService'

/* Query Keys */
import { queryKeys } from '../../api/queryClient'

const useDeleteTableConfigurationMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idConfiguracionMesa) =>
      deleteTableConfiguration({
        idEstablecimiento,
        idConfiguracionMesa,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tableConfigurations(idEstablecimiento),
      })
    },
  })
}

export default useDeleteTableConfigurationMutation
