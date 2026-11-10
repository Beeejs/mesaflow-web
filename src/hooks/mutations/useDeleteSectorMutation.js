
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { deleteSector } from '../../api/sectorService'
import { queryKeys } from '../../api/queryClient'

const useDeleteSectorMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (idSector) =>
      deleteSector({
        idEstablecimiento,
        idSector,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sectors(idEstablecimiento),
      })
    },
  })
}

export default useDeleteSectorMutation
