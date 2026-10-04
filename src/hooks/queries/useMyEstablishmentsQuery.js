import { useContext } from 'react'
import { useQuery } from '@tanstack/react-query'

/* API */
import { listMyEstablishments } from '../../api/establishmentService'
import { queryKeys } from '../../api/queryClient'

/* Context */
import { SessionContext } from '../../context/SessionContext'

const useMyEstablishmentsQuery = () => {
  // Hooks
  const {
    user,
    isAuthenticated,
  } = useContext(SessionContext)

  return useQuery({
    queryKey: [
      ...queryKeys.myEstablishments,
      user?.email,
    ],
    queryFn: listMyEstablishments,
    enabled: isAuthenticated && Boolean(user?.email),
  })
}

export default useMyEstablishmentsQuery