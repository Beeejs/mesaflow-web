
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { updateSector } from '../../api/sectorService'
import { queryKeys } from '../../api/queryClient'

const useUpdateSectorMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ idSector, nombre }) =>
      updateSector({
        idEstablecimiento,
        idSector,
        nombre,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sectors(idEstablecimiento),
      })
    },
  })
}

export default useUpdateSectorMutation
