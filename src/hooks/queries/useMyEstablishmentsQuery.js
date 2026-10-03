import { useQuery } from '@tanstack/react-query'

/* API */
import { listMyEstablishments } from '../../api/establishmentService'
import { queryKeys } from '../../api/queryClient'

const useMyEstablishmentsQuery = () => {
  return useQuery({
    queryKey: queryKeys.myEstablishments,
    queryFn: listMyEstablishments,
  })
}

export default useMyEstablishmentsQuery