
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { createSector } from '../../api/sectorService'
import { queryKeys } from '../../api/queryClient'

const useCreateSectorMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (nombre) =>
      createSector({
        idEstablecimiento,
        nombre,
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.sectors(idEstablecimiento),
      })
    },
  })
}

export default useCreateSectorMutation
