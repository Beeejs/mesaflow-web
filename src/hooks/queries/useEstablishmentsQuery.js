
import { useQuery } from '@tanstack/react-query'

/* API */
import { listEstablishments } from '../../api/establishmentService'
import { queryKeys } from '../../api/queryClient'

const useEstablishmentsQuery = () => {
  return useQuery({
    queryKey: queryKeys.establishments,
    queryFn: listEstablishments,
  })
}

export default useEstablishmentsQuery