import { useQuery } from '@tanstack/react-query'

/* Api */
import { listRoles } from '../../api/roleService'
import { queryKeys } from '../../api/queryClient'

const useRolesQuery = () => {
  return useQuery({
    queryKey: queryKeys.roles,
    queryFn: listRoles,
  })
}

export default useRolesQuery