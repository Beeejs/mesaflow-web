
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { updateTable } from '../../api/tableService'
import { queryKeys } from '../../api/queryClient'

const useUpdateTableMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ idMesa, tableData }) =>
      updateTable({
        idEstablecimiento,
        idMesa,
        tableData,
      }),

    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: queryKeys.tables(idEstablecimiento),
        }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.tableDistributionsPrefix(
            idEstablecimiento
          ),
        }),
      ])
    },
  })
}

export default useUpdateTableMutation
