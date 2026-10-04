import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'

/* API */
import { listAssignedEstablishments } from '../../api/establishmentService'
import { queryKeys } from '../../api/queryClient'

/* Context */
import { SessionContext } from '../../context/SessionContext'

const useAssignedEstablishmentsQuery = () => {
  // Hooks
  const {
    user,
    isAuthenticated,
  } = useContext(SessionContext)

  return useQuery({
    queryKey: [
      ...queryKeys.assignedEstablishments,
      user?.email,
    ],
    queryFn: listAssignedEstablishments,
    enabled: isAuthenticated && Boolean(user?.email),
  })
}

export default useAssignedEstablishmentsQuery