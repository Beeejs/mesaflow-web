/* MUI */
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
/* Components */
import AssociateForm from './AssociateForm'

const AssociateDialog = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '24px',
          backgroundColor: '#0B111C',
          border: '1px solid #1F2937',
          color: '#F8FAFC',
        },
      }}
    >
      <DialogContent sx={{ padding: '32px' }}>
        <div className="mb-6 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
              Asociación
            </p>

            <h2 className="font-display mt-3 text-3xl font-bold">
              Asociate con MesaFlow
            </h2>

            <p className="mt-3 text-sm leading-6 text-mesa-muted">
              Dejanos los datos de tu establecimiento y nuestro equipo revisará
              la solicitud para habilitar el acceso a la plataforma.
            </p>
          </div>

          <IconButton
            onClick={onClose}
            sx={{
              color: '#94A3B8',
              '&:hover': {
                color: '#F8FAFC',
                backgroundColor: '#111827',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </div>

        <AssociateForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}

export default AssociateDialog