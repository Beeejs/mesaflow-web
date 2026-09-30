import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

import RefreshIcon from '@mui/icons-material/Refresh'

const DashboardRefreshButton = ({
  onClick,
  loading = false,
  tooltip = 'Recargar',
}) => {
  return (
    <Tooltip title={tooltip}>
      <span>
        <IconButton
          type="button"
          onClick={onClick}
          disabled={loading}
          sx={{
            width: 44,
            height: 44,
            border: '1px solid #1F2937',
            borderRadius: '14px',
            backgroundColor: '#0B111C',
            color: '#94A3B8',
            transition: 'all 0.2s ease',

            '&:hover': {
              borderColor: 'rgba(5, 110, 248, 0.6)',
              backgroundColor: '#111827',
              color: '#F8FAFC',
            },

            '&.Mui-disabled': {
              color: '#475569',
              borderColor: '#1F2937',
              backgroundColor: '#0B111C',
            },
          }}
        >
          <RefreshIcon
            sx={{
              fontSize: 22,
              animation: loading
                ? 'spin 0.8s linear infinite'
                : 'none',

              '@keyframes spin': {
                from: {
                  transform: 'rotate(0deg)',
                },
                to: {
                  transform: 'rotate(360deg)',
                },
              },
            }}
          />
        </IconButton>
      </span>
    </Tooltip>
  )
}

export default DashboardRefreshButton