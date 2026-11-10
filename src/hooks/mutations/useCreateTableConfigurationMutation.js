import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { createTableConfiguration } from '../../api/tableConfigurationService'
import { queryKeys } from '../../api/queryClient'

const useCreateTableConfigurationMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nombre) =>
      createTableConfiguration({
        idEstablecimiento,
        nombre,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.tableConfigurations(idEstablecimiento),
      })
    },
  })
}

export default useCreateTableConfigurationMutation