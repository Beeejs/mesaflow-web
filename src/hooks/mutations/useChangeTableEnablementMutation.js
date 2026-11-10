
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { queryKeys } from '../../api/queryClient'
import {
  changeTableEnablement,
  changeTableEnablementInAll,
} from '../../api/tableConfigurationService'

// =========================================
// HABILITACIÓN DE MESAS
// =========================================

const useChangeTableEnablementMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ applyToAll = false, ...params }) => {
      const changeEnablement = applyToAll
        ? changeTableEnablementInAll
        : changeTableEnablement

      return changeEnablement({
        idEstablecimiento,
        ...params,
      })
    },

    onSuccess: async () => {
      // Una habilitación (individual o global) puede cambiar
      // las versiones de las configuraciones y sus distribuciones.
      // Este prefijo incluye ambas consultas del establecimiento,
      // sin invalidar usuarios, productos u otros módulos.
      await queryClient.invalidateQueries({
        queryKey: queryKeys.tableDistributionsPrefix(idEstablecimiento),
      })
    },
  })
}

export default useChangeTableEnablementMutation
