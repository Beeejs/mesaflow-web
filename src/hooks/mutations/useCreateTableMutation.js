
import { useMutation, useQueryClient } from '@tanstack/react-query'

/* API */
import { createTable } from '../../api/tableService'
import { queryKeys } from '../../api/queryClient'

const useCreateTableMutation = (idEstablecimiento) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (tableData) =>
      createTable({
        idEstablecimiento,
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

export default useCreateTableMutation
