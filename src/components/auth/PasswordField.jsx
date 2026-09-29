import { useState } from 'react'

/* MUI */
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

/* MUI Icons */
import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

const PasswordField = ({
  label,
  name,
  value,
  onChange,
  sx,
  disabled = false,
  required = true,
  autoComplete,
}) => {
  // Hooks
  const [showPassword, setShowPassword] = useState(false)

  // Funciones
  const handleToggleVisibility = () => {
    setShowPassword((current) => !current)
  }

  // Renderizado
  return (
    <TextField
      label={label}
      name={name}
      type={showPassword ? 'text' : 'password'}
      value={value}
      onChange={onChange}
      disabled={disabled}
      required={required}
      autoComplete={autoComplete}
      fullWidth
      sx={sx}
      slotProps={{
        input: {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                type="button"
                onClick={handleToggleVisibility}
                edge="end"
                aria-label={
                  showPassword
                    ? `Ocultar ${label.toLowerCase()}`
                    : `Mostrar ${label.toLowerCase()}`
                }
                sx={{
                  color: '#94A3B8',

                  '&:hover': {
                    color: '#F8FAFC',
                  },
                }}
              >
                {showPassword
                  ? <VisibilityOffIcon />
                  : <VisibilityIcon />
                }
              </IconButton>
            </InputAdornment>
          ),
        },
      }}
    />
  )
}

export default PasswordField