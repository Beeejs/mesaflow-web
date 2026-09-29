import { useContext } from 'react'
import { useMutation } from '@tanstack/react-query'

/* Context */
import { SessionContext } from '../../context/SessionContext'

const useGoogleLoginMutation = () => {
  const { googleLoginUser } = useContext(SessionContext)

  return useMutation({
    mutationFn: googleLoginUser,
  })
}

export default useGoogleLoginMutation