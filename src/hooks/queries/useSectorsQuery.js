
import { useQuery } from '@tanstack/react-query'

/* API */
import { listSectors } from '../../api/sectorService'
import { queryKeys } from '../../api/queryClient'

const useSectorsQuery = (idEstablecimiento) => {
  return useQuery({
    queryKey: queryKeys.sectors(idEstablecimiento),
    queryFn: () => listSectors(idEstablecimiento),
    enabled: Boolean(idEstablecimiento),
  })
}

export default useSectorsQuery
