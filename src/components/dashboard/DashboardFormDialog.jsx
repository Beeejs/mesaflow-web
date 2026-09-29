
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

import DefaultButton from '../common/button/DefaultButton'

const DashboardFormDialog = ({
  open,
  title,
  description,
  onClose,
  onSubmit,
  isBusy = false,
  submitDisabled = false,
  submitLabel = 'Guardar cambios',
  busyLabel = 'Guardando...',
  children,
}) => {
  const handleClose = () => {
    if (!isBusy) onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            border: '1px solid #1F2937',
            backgroundColor: '#0B111C',
            color: '#F8FAFC',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
          },
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgba(3, 7, 15, 0.78)',
            backdropFilter: 'blur(3px)',
          },
        },
      }}
    >
      <form onSubmit={onSubmit}>
        <DialogTitle
          sx={{
            px: { xs: 3, sm: 4 },
            pt: 4,
            pb: 1,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
          }}
        >
          {title}
        </DialogTitle>

        <DialogContent
          sx={{
            px: { xs: 3, sm: 4 },
            pt: 2,
            pb: 3,
          }}
        >
          {description && (
            <p className="mb-6 text-sm leading-6 text-mesa-muted">
              {description}
            </p>
          )}

          {children}
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 3, sm: 4 },
            pb: 4,
            gap: 2,
          }}
        >
          <DefaultButton
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={isBusy}
          >
            Cancelar
          </DefaultButton>

          <DefaultButton
            type="submit"
            disabled={isBusy || submitDisabled}
          >
            {isBusy ? (
              <span className="flex items-center gap-2">
                <CircularProgress size={16} color="inherit" />
                {busyLabel}
              </span>
            ) : (
              submitLabel
            )}
          </DefaultButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default DashboardFormDialog
