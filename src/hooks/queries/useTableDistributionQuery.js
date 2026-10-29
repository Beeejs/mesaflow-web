import { useQuery } from '@tanstack/react-query'

/* API */
import { getTableDistribution } from '../../api/tableConfigurationService'
import { queryKeys } from '../../api/queryClient'

const useTableDistributionQuery = (
  idEstablecimiento,
  idConfiguracionMesa
) => {
  return useQuery({
    queryKey: queryKeys.tableDistribution(
      idEstablecimiento,
      idConfiguracionMesa
    ),
    queryFn: () =>
      getTableDistribution({
        idEstablecimiento,
        idConfiguracionMesa,
      }),
    enabled: Boolean(idEstablecimiento && idConfiguracionMesa),
  })
}

export default useTableDistributionQuery