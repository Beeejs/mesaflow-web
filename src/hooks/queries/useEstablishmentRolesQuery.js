
import { useQuery } from '@tanstack/react-query'

/* API */
import { listEstablishmentRoles } from '../../api/establishmentUserService'
import { queryKeys } from '../../api/queryClient'

const useEstablishmentRolesQuery = () => {
  return useQuery({
    queryKey: queryKeys.establishmentRoles,
    queryFn: listEstablishmentRoles,
  })
}

export default useEstablishmentRolesQuery
