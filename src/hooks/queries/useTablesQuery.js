
import { useQuery } from '@tanstack/react-query'

/* API */
import { listTables } from '../../api/tableService'
import { queryKeys } from '../../api/queryClient'

const useTablesQuery = (idEstablecimiento) => {
  return useQuery({
    queryKey: queryKeys.tables(idEstablecimiento),
    queryFn: () => listTables(idEstablecimiento),
    enabled: Boolean(idEstablecimiento),
  })
}

export default useTablesQuery
