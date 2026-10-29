import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { activateTableConfiguration } from '../../api/tableConfigurationService'
import { queryKeys } from '../../api/queryClient'

const useActivateTableConfigurationMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idConfiguracionMesa) =>
      activateTableConfiguration({
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

export default useActivateTableConfigurationMutation