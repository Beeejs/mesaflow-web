
import { useQuery } from '@tanstack/react-query'

import { listDistricts } from '../../api/locationService'
import { queryKeys } from '../../api/queryClient'

const useDistrictsQuery = (provinceId) => {
  return useQuery({
    queryKey: queryKeys.districts(provinceId),
    queryFn: () => listDistricts(provinceId),
    enabled: provinceId != null && provinceId !== '', // -> impide consultar partidos mientras todavía no hay una provincia seleccionada. Cuando cambia la provincia, TanStack Query utiliza otra clave y trae sus partidos.
  })
}

export default useDistrictsQuery