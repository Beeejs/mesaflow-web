
import { useQuery } from '@tanstack/react-query'

/* API */
import { listEstablishmentUsers } from '../../api/establishmentUserService'
import { queryKeys } from '../../api/queryClient'

const useEstablishmentUsersQuery = (idEstablecimiento) => {
  return useQuery({
    queryKey: queryKeys.establishmentUsers(idEstablecimiento),
    queryFn: () => listEstablishmentUsers(idEstablecimiento),
    enabled: idEstablecimiento != null,
  })
}

export default useEstablishmentUsersQuery
