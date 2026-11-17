
import { useQuery } from '@tanstack/react-query'

/* API */
import { listTables } from '../../api/tableService'
import { queryKeys } from '../../api/queryClient'

const useTablesQuery = (idEstablecimiento, { refetchInterval = false } = {}) => {
  return useQuery({
    queryKey: queryKeys.tables(idEstablecimiento),
    queryFn: ({ signal }) => listTables(idEstablecimiento, signal),
    enabled: Boolean(idEstablecimiento),
    refetchOnMount: 'always',
    refetchInterval,
  })
}

export default useTablesQuery
