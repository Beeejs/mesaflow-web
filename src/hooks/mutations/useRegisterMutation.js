import { useMutation } from '@tanstack/react-query'

/* API */
import { register } from '../../api/authService'

const useRegisterMutation = () => {
  return useMutation({
    mutationFn: register,
  })
}

export default useRegisterMutation