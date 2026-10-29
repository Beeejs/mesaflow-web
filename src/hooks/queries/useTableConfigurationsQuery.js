import { useQuery } from '@tanstack/react-query'

/* API */
import { listTableConfigurations } from '../../api/tableConfigurationService'
import { queryKeys } from '../../api/queryClient'

const useTableConfigurationsQuery = (idEstablecimiento) => {
  return useQuery({
    queryKey: queryKeys.tableConfigurations(idEstablecimiento),
    queryFn: () => listTableConfigurations(idEstablecimiento),
    enabled: Boolean(idEstablecimiento),
  })
}

export default useTableConfigurationsQuery