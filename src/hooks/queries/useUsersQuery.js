import { useQuery } from '@tanstack/react-query'

/* Api */
import { listUsers } from '../../api/userService'
import { queryKeys } from '../../api/queryClient'

const useUsersQuery = () => {
  return useQuery({
    queryKey: queryKeys.users,
    queryFn: listUsers,
  })
}

export default useUsersQuery