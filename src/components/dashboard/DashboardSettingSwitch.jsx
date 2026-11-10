
import Switch from '@mui/material/Switch'

// =========================================
// COMPONENTE REUTILIZABLE
// =========================================

const DashboardSettingSwitch = ({
  label,
  description,
  checked = false,
  onChange,
  disabled = false,
  name,
}) => {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 py-3">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-mesa-text">
          {label}
        </p>

        {description && (
          <p className="mt-1 text-xs leading-5 text-mesa-muted">
            {description}
          </p>
        )}
      </div>

      <Switch
        name={name}
        checked={checked}
        onChange={(event) =>
          onChange?.(event.target.checked)
        }
        disabled={disabled}
        slotProps={{
          input: {
            'aria-label': label,
          },
        }}
        sx={{
          '& .MuiSwitch-switchBase.Mui-checked': {
            color: '#fff',
          },
          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            backgroundColor: '#16c784',
            opacity: 1,
          },
        }}
      />
    </label>
  )
}

export default DashboardSettingSwitch
