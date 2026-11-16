import { useContext, useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Table from '../../../table/Table'
import DefaultButton from '../../../common/button/DefaultButton'
import { getOrderColumns } from '../../../table/columns/orderColumns'
import { getSessionAccount, closeSessionAccount } from '../../../../api/orderService'
import { queryKeys } from '../../../../api/queryClient'
import { ActionDialogContext } from '../../../../context/ActionDialogContext'
import { formatPrice } from '../../../../utils/productUtils'
import { canCloseAccount } from '../../../../utils/orderUtils'

const SessionAccountDialog = ({ idSesionMesa, idEstablecimiento, liveConnected, readOnly = false, onViewOrder, onClose }) => {
  const { openActionDialog } = useContext(ActionDialogContext)
  const queryClient = useQueryClient()
  const { data: account, isLoading, isFetching, error } = useQuery({
    queryKey: queryKeys.sessionAccount(idSesionMesa),
    queryFn: ({ signal }) => getSessionAccount(idSesionMesa, signal),
    staleTime: 0,
    refetchInterval: liveConnected ? false : 15000,
  })
  const mutation = useMutation({
    mutationFn: closeSessionAccount,
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.sessionAccount(idSesionMesa), result)
      queryClient.invalidateQueries({ queryKey: queryKeys.orders(idEstablecimiento) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tables(idEstablecimiento) })
      queryClient.invalidateQueries({ queryKey: queryKeys.tableDistributionsPrefix(idEstablecimiento) })
    },
  })

  useEffect(() => {
    if (error) toast.error(error.response?.data?.message || error.message || 'No se pudo consultar la cuenta.')
  }, [error])

  const handleCloseAccount = () => {
    openActionDialog({
      title: 'Cerrar cuenta y liberar mesa',
      description: 'Confirmá que el cobro se realizó fuera del sistema. La cuenta se cerrará y la mesa quedará disponible. Esta acción no procesa pagos.',
      actionLabel: 'Confirmar cierre',
      icon: 'confirm',
      onAction: async () => {
        try {
          await mutation.mutateAsync(idSesionMesa)
          toast.success('Cuenta cerrada y mesa liberada.')
        } catch (error) {
          toast.error(error.response?.data?.message || error.message || 'No se pudo cerrar la cuenta.')
          throw error
        }
      },
    })
  }

  return (
    <>
      <Dialog open onClose={mutation.isPending ? undefined : onClose} fullWidth maxWidth={false}
        slotProps={{ paper: { sx: { width: 'calc(100% - 32px)', maxWidth: 1440, margin: '16px', maxHeight: 'calc(100% - 32px)', backgroundColor: '#0B111C', color: '#F8FAFC', borderRadius: '24px', border: '1px solid #1F2937' } } }}>
        <DialogTitle>Cuenta de mesa {account?.codigoMesa ?? ''} · Sesión #{idSesionMesa}</DialogTitle>
        <DialogContent>
          {error && <p role="alert" className="mb-4 text-red-400">No se pudo actualizar la cuenta.</p>}
          {account && (
            <div className="mb-5 space-y-2 text-sm text-mesa-muted">
              <p>Estado: {account.estado === 'ABIERTA' ? 'Abierta' : 'Cerrada'}</p>
              <p>Total sin cancelados: <strong className="text-mesa-text">{formatPrice(account.total)}</strong></p>
              {!readOnly && account.estado === 'ABIERTA' && !canCloseAccount(account) && (
                <p>Para cerrar la cuenta, todos los pedidos deben estar entregados o cancelados.</p>
              )}
            </div>
          )}
          <Table rows={account?.pedidos ?? []} columns={getOrderColumns()}
            onRowClick={({ row }) => { if (!mutation.isPending) onViewOrder(row) }}
            onCellKeyDown={({ row }, event) => {
              if (event.key === 'Enter' && !mutation.isPending) {
                event.preventDefault()
                onViewOrder(row)
              }
            }}
            getRowId={(order) => order.idPedido} loading={isLoading} showToolbar={false}
            getRowHeight={() => 'auto'}
            sx={{
              '& .MuiDataGrid-row': { cursor: mutation.isPending ? 'default' : 'pointer', transition: 'background-color 150ms ease' },
              '& .MuiDataGrid-row:hover': { backgroundColor: 'rgba(16, 196, 252, 0.12)' },
              '& .MuiDataGrid-cell': { display: 'flex', alignItems: 'center', paddingY: 1.5 },
              '& .MuiDataGrid-cell[data-field="productos"]': { whiteSpace: 'normal', lineHeight: 1.5, overflowWrap: 'anywhere' },
            }}
            emptyMessage="No hay pedidos en esta cuenta." />
        </DialogContent>
        <DialogActions>
          <DefaultButton variant="secondary" onClick={onClose} disabled={mutation.isPending}>Cerrar</DefaultButton>
          {!readOnly && account?.estado === 'ABIERTA' && (
            <DefaultButton onClick={handleCloseAccount}
              disabled={!canCloseAccount(account) || Boolean(error) || isFetching || mutation.isPending}>
              Cerrar cuenta y liberar mesa
            </DefaultButton>
          )}
        </DialogActions>
      </Dialog>
    </>
  )
}

export default SessionAccountDialog
