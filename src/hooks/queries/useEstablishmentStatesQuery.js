
import { useQuery } from '@tanstack/react-query'

import { listEstablishmentStates } from '../../api/establishmentStatusService'
import { queryKeys } from '../../api/queryClient'

const useEstablishmentStatesQuery = () => {
  return useQuery({
    queryKey: queryKeys.establishmentStates,
    queryFn: listEstablishmentStates,
  })
}

export default useEstablishmentStatesQuery