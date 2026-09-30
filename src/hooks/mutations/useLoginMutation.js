import { useContext } from 'react'
import { useMutation } from '@tanstack/react-query'

/* Context */
import { SessionContext } from '../../context/SessionContext'

const useLoginMutation = () => {
  const { loginUser } = useContext(SessionContext)

  return useMutation({
    mutationFn: loginUser,
  })
}

export default useLoginMutation