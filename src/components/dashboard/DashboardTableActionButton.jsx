/* MUI */
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

const DashboardTableActionButton = ({
  title,
  onClick,
  children,
  ariaLabel,
  highlight = false,
  disabled = false,
}) => {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          type="button"
          onClick={onClick}
          disabled={disabled}
          aria-label={ariaLabel || title}
          sx={{
            color: '#94A3B8',

            '&:hover': {
              color: highlight ? '#10C4FC' : '#F8FAFC',
              backgroundColor: '#111827',
            },

            '&.Mui-disabled': {
              color: '#475569',
            },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default DashboardTableActionButton