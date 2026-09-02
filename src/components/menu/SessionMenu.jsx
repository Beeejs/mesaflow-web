import { useContext, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

/* MUI */
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

/* MUI Icons */
import DashboardIcon from '@mui/icons-material/Dashboard'
import LogoutIcon from '@mui/icons-material/Logout'

/* Context */
import { SessionContext } from '../../context/SessionContext'

const getInitials = (user) => {
  if (!user) {
    return ''
  }

  const nombre = user.nombre || ''
  const apellido = user.apellido || ''
  const email = user.email || ''

  const firstInitial = nombre.charAt(0)
  const secondInitial = apellido.charAt(0)

  if (firstInitial || secondInitial) {
    return `${firstInitial}${secondInitial}`.toUpperCase()
  }

  return email.charAt(0).toUpperCase()
}

const SessionMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null)

  const navigate = useNavigate()

  const {
    user,
    isAuthenticated,
    isLoadingSession,
    logoutUser,
  } = useContext(SessionContext)

  const isMenuOpen = Boolean(anchorEl)

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseMenu = () => {
    setAnchorEl(null)
  }

  const handleGoToDashboard = () => {
    handleCloseMenu()
    navigate('/dashboard')
  }

  const handleLogout = async () => {
    try {
      await logoutUser()

      handleCloseMenu()

      toast.success('Sesión cerrada correctamente.')

      navigate('/')
    } catch {
      toast.error('No se pudo cerrar la sesión.')
    }
  }

  if (isLoadingSession) {
    return null
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <>
      <Tooltip title="Cuenta">
        <IconButton
          onClick={handleOpenMenu}
          size="small"
          sx={{
            padding: 0,
          }}
          aria-controls={isMenuOpen ? 'session-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={isMenuOpen ? 'true' : undefined}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#056EF8',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 800,
              border: '1px solid #1F2937',
              boxShadow: '0 10px 15px -3px rgba(5, 110, 248, 0.25)',
            }}
          >
            {getInitials(user)}
          </Avatar>
        </IconButton>
      </Tooltip>

      <Menu
        id="session-menu"
        anchorEl={anchorEl}
        open={isMenuOpen}
        onClose={handleCloseMenu}
        transformOrigin={{
          horizontal: 'right',
          vertical: 'top',
        }}
        anchorOrigin={{
          horizontal: 'right',
          vertical: 'bottom',
        }}
        slotProps={{
          paper: {
            sx: {
              mt: 1.5,
              minWidth: 245,
              overflow: 'hidden',
              borderRadius: '16px',
              backgroundColor: '#0B111C',
              color: '#F8FAFC',
              border: '1px solid #1F2937',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.45)',
            },
          },
        }}
      >
        <Box
          sx={{
            px: 2,
            py: 1.5,
            backgroundColor: '#0B111C',
          }}
        >
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 14,
              color: '#F8FAFC',
            }}
          >
            {user.nombre} {user.apellido}
          </Typography>

          <Typography
            sx={{
              mt: 0.25,
              color: '#94A3B8',
              fontSize: 13,
            }}
          >
            {user.email}
          </Typography>
        </Box>

        <Divider sx={{ borderColor: '#1F2937' }} />

        <MenuItem
          onClick={handleGoToDashboard}
          sx={{
            gap: 1,
            py: 1.2,
            fontSize: 14,
            color: '#F8FAFC',
            backgroundColor: '#0B111C',
            '&:hover': {
              backgroundColor: '#111827',
              color: '#10C4FC',
            },
          }}
        >
          <ListItemIcon>
            <DashboardIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
          </ListItemIcon>
          Mi panel
        </MenuItem>

        <MenuItem
          onClick={handleLogout}
          sx={{
            gap: 1,
            py: 1.2,
            fontSize: 14,
            color: '#F87171',
            backgroundColor: '#0B111C',
            '&:hover': {
              backgroundColor: '#111827',
              color: '#FCA5A5',
            },
          }}
        >
          <ListItemIcon>
            <LogoutIcon sx={{ color: '#FFFFFF', fontSize: 20 }} />
          </ListItemIcon>
          Cerrar sesión
        </MenuItem>
      </Menu>
    </>
  )
}

export default SessionMenu