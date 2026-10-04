import { useQuery } from '@tanstack/react-query'

/* API */
import { listAssignedEstablishments } from '../../api/establishmentService'
import { queryKeys } from '../../api/queryClient'

const useAssignedEstablishmentsQuery = () => {
  return useQuery({
    queryKey: queryKeys.assignedEstablishments,
    queryFn: listAssignedEstablishments,
  })
}

export default useAssignedEstablishmentsQuery