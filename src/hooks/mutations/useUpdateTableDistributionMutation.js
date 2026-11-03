
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { updateTableDistribution } from '../../api/tableConfigurationService'
import { queryKeys } from '../../api/queryClient'

const useUpdateTableDistributionMutation = (
  idEstablecimiento,
  idConfiguracionMesa
) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (distributionData) =>
      updateTableDistribution({
        idEstablecimiento,
        idConfiguracionMesa,
        distributionData,
      }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.tableDistribution(
            idEstablecimiento,
            idConfiguracionMesa
          ),
          exact: true,
        }),

        queryClient.invalidateQueries({
          queryKey: queryKeys.tableConfigurations(
            idEstablecimiento
          ),
          exact: true,
        }),
      ])
    },
  })
}

export default useUpdateTableDistributionMutation
