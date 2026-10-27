import { useContext } from 'react'

/* MUI */
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

/* MUI Icons */
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/* Context */
import { ActionDialogContext } from '../../context/ActionDialogContext'

/* Components */
import DefaultButton from '../common/button/DefaultButton'

const dialogIcons = {
  delete: DeleteIcon,
  warning: WarningAmberRoundedIcon,
  cancel: CancelOutlinedIcon,
  block: BlockOutlinedIcon,
  info: InfoOutlinedIcon,
  confirm: CheckCircleIcon,
}

const variantStyles = {
  primary: {
    border: '1px solid rgba(5, 110, 248, 0.55)',
    iconBackground: 'rgba(5, 110, 248, 0.12)',
    iconColor: '#099CF7',
    iconBorder: '1px solid rgba(5, 110, 248, 0.25)',
  },
  warning: {
    border: '1px solid rgba(245, 158, 11, 0.55)',
    iconBackground: 'rgba(245, 158, 11, 0.12)',
    iconColor: '#FBBF24',
    iconBorder: '1px solid rgba(245, 158, 11, 0.25)',
  },
  danger: {
    border: '1px solid rgba(239, 68, 68, 0.55)',
    iconBackground: 'rgba(239, 68, 68, 0.12)',
    iconColor: '#F87171',
    iconBorder: '1px solid rgba(239, 68, 68, 0.25)',
  },
}

const DashboardActionDialog = () => {
  // Hooks
  const {
    dialog,
    closeActionDialog,
    resetActionDialog,
  } = useContext(ActionDialogContext)

  // Constantes derivadas
  const styles =
    variantStyles[dialog.variant] ??
    variantStyles.primary

  const DialogIcon =
    dialogIcons[dialog.icon] ??
    dialogIcons.warning

  // Funciones
  const handleClose = () => {
    closeActionDialog()
  }

  const handleConfirm = async () => {
    try {
      if (dialog.onAction) {
        await dialog.onAction()
      }

      closeActionDialog()
    } catch {
      // El error lo maneja la acción que abrió el diálogo.
    }
  }

  // Renderizado
  return (
    <Dialog
      open={dialog.open}
      onClose={handleClose}
      fullWidth
      maxWidth="xs"
      slotProps={{
        paper: {
          sx: {
            width: '100%',
            maxWidth: 460,
            borderRadius: '20px',
            border: styles.border,
            backgroundColor: '#0B111C',
            backgroundImage: 'none',
            color: '#F8FAFC',
            overflow: 'hidden',
            boxShadow: '0 24px 60px rgba(0, 0, 0, 0.55)',
          },
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgba(3, 7, 15, 0.78)',
            backdropFilter: 'blur(4px)',
          },
        },
        transition: {
          onExited: resetActionDialog,
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          px: 3,
          pt: 3,
          pb: 1,
        }}
      >
        <IconButton
          onClick={handleClose}
          aria-label="Cerrar"
          sx={{
            position: 'absolute',
            top: 14,
            right: 14,
            color: '#94A3B8',
            '&:hover': {
              color: '#F8FAFC',
              backgroundColor: '#111827',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 56,
              height: 56,
              borderRadius: '16px',
              backgroundColor: styles.iconBackground,
              color: styles.iconColor,
              border: styles.iconBorder,
            }}
          >
            <DialogIcon sx={{ fontSize: 28 }} />
          </Box>
        </Box>

        <DialogTitle
          sx={{
            p: 0,
            textAlign: 'center',
            fontSize: '1.35rem',
            fontWeight: 800,
            lineHeight: 1.2,
            color: '#F8FAFC',
          }}
        >
          {dialog.title}
        </DialogTitle>
      </Box>

      <DialogContent
        sx={{
          px: 3,
          pt: 1.5,
          pb: 3.5,
        }}
      >
        <Typography
          sx={{
            textAlign: 'center',
            color: '#94A3B8',
            fontSize: 15,
            lineHeight: 1.7,
          }}
        >
          {dialog.description}
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: '1px solid #1F2937',
          justifyContent: 'center',
          gap: 1.5,
          backgroundColor: '#0B111C',
        }}
      >
        <DefaultButton
          variant="secondary"
          onClick={handleClose}
        >
          {dialog.cancelLabel || 'Cancelar'}
        </DefaultButton>

        <DefaultButton
          variant={dialog.variant || 'primary'}
          onClick={handleConfirm}
        >
          {dialog.actionLabel || 'Confirmar'}
        </DefaultButton>
      </DialogActions>
    </Dialog>
  )
}

export default DashboardActionDialog