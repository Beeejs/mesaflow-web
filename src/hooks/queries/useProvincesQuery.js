
import { useQuery } from '@tanstack/react-query'

import { listProvinces } from '../../api/locationService'
import { queryKeys } from '../../api/queryClient'

const useProvincesQuery = () => {
  return useQuery({
    queryKey: queryKeys.provinces,
    queryFn: listProvinces,
  })
}

export default useProvincesQuery