import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// Diálogo informativo compartido. Las confirmaciones continúan usando
// DashboardActionDialog y los formularios DashboardFormDialog.
const DashboardInfoDialog = ({
  open = true,
  title,
  onClose,
  actions,
  children,
  maxWidth = 'md',
  wide = false,
  busy = false,
}) => (
  <Dialog
    open={open}
    onClose={busy ? undefined : onClose}
    fullWidth
    maxWidth={wide ? false : maxWidth}
    slotProps={{
      paper: {
        sx: {
          width: wide ? 'calc(100% - 32px)' : undefined,
          maxWidth: wide ? 1440 : undefined,
          margin: '16px',
          maxHeight: 'calc(100% - 32px)',
          backgroundColor: '#0B111C',
          backgroundImage: 'none',
          color: '#F8FAFC',
          borderRadius: '24px',
          border: '1px solid #1F2937',
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
    <DialogTitle sx={{ fontFamily: 'Poppins, sans-serif', fontWeight: 800 }}>
      {title}
    </DialogTitle>
    <DialogContent>{children}</DialogContent>
    <DialogActions sx={{ gap: 1.5, padding: 2 }}>{actions}</DialogActions>
  </Dialog>
)

export default DashboardInfoDialog
