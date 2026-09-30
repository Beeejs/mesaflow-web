import Button from '@mui/material/Button'

const getButtonStyles = (variant) => {
  // Estilos base
  const baseStyles = {
    borderRadius: '12px',
    padding: '12px 24px',
    fontWeight: 700,
    textTransform: 'none',
  }

  const variants = {
    primary: {
      backgroundColor: '#056EF8',
      color: '#FFFFFF',
      boxShadow: '0 10px 15px -3px rgba(5, 110, 248, 0.25)',
      '&:hover': {
        backgroundColor: '#1E60DB',
      },
      '&.Mui-disabled': {
        backgroundColor: '#056EF8',
        color: '#FFFFFF',
        opacity: 0.65,
      },
    },

    secondary: {
      backgroundColor: '#0B111C',
      color: '#F8FAFC',
      border: '1px solid #1F2937',
      '&:hover': {
        borderColor: '#056EF8',
        backgroundColor: '#111827',
      },
      '&.Mui-disabled': {
        backgroundColor: '#0B111C',
        color: '#94A3B8',
        opacity: 0.65,
      },
    },

    danger: {
      backgroundColor: '#DC2626',
      color: '#FFFFFF',
      '&:hover': {
        backgroundColor: '#B91C1C',
      },
      '&.Mui-disabled': {
        backgroundColor: '#DC2626',
        color: '#FFFFFF',
        opacity: 0.65,
      },
    },
  }

  return {
    ...baseStyles,
    ...variants[variant],
  }
}

const DefaultButton = ({
  children,
  type = 'button',
  variant = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  sx = {},
}) => {
  return (
    <Button
      type={type}
      loading={loading}
      loadingPosition="end"
      variant="contained"
      fullWidth={fullWidth}
      disabled={disabled || loading}
      onClick={onClick}
      sx={{
        ...getButtonStyles(variant),
        ...sx,
      }}
    >
      {children}
    </Button>
  )
}

export default DefaultButton