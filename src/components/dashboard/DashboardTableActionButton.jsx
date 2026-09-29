/* MUI */
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

const DashboardTableActionButton = ({
  title,
  onClick,
  children,
  ariaLabel,
  highlight = false,
}) => {
  return (
    <Tooltip title={title}>
      <IconButton
        type="button"
        onClick={onClick}
        aria-label={ariaLabel || title}
        sx={{
          color: '#94A3B8',

          '&:hover': {
            color: highlight ? '#10C4FC' : '#F8FAFC',
            backgroundColor: '#111827',
          },
        }}
      >
        {children}
      </IconButton>
    </Tooltip>
  )
}

export default DashboardTableActionButton