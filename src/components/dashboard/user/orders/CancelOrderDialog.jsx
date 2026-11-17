import { useState } from 'react'
import { toast } from 'sonner'
import TextField from '@mui/material/TextField'
import DashboardFormDialog from '../../DashboardFormDialog'
import useUpdateOrderStateMutation from '../../../../hooks/mutations/useUpdateOrderStateMutation'
import { textFieldStyles } from '../../../../styles/formStyles'

const CancelOrderDialog = ({ order, idEstablecimiento, onClose }) => {
  const [motivo, setMotivo] = useState('')
  const mutation = useUpdateOrderStateMutation(idEstablecimiento)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (mutation.isPending) return
    if (!motivo.trim() || motivo.trim().length > 255) {
      toast.error('Indicá un motivo de cancelación de hasta 255 caracteres.')
      return
    }
    try {
      await mutation.mutateAsync({ idPedido: order.idPedido, estado: 'CANCELADO', motivo: motivo.trim() })
      toast.success('Pedido cancelado correctamente.')
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'No se pudo cancelar el pedido.')
    }
  }

  return (
    <DashboardFormDialog open title={`Cancelar pedido #${order.idPedido}`}
      description="La cancelación repone el stock cuando corresponde. Esta acción no se puede deshacer."
      onClose={onClose} onSubmit={handleSubmit} isBusy={mutation.isPending}
      submitDisabled={!motivo.trim()} submitLabel="Cancelar pedido">
      <TextField label="Motivo de cancelación" value={motivo} onChange={(event) => setMotivo(event.target.value)}
        fullWidth required multiline minRows={3} disabled={mutation.isPending}
        slotProps={{ htmlInput: { maxLength: 255 } }} sx={textFieldStyles} />
    </DashboardFormDialog>
  )
}

export default CancelOrderDialog
