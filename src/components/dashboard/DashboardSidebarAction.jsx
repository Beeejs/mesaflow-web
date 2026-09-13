import { Link } from 'react-router'

const DashboardSidebarAction = ({
  to,
  label,
  icon: Icon,
  onClick,
  variant = 'default',
}) => {
  const isDanger = variant === 'danger'

  const className = `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
    isDanger
      ? 'text-mesa-muted hover:bg-mesa-card hover:text-red-300'
      : 'text-mesa-muted hover:bg-mesa-card hover:text-mesa-text'
  }`

  if (to) {
    return (
      <Link to={to} className={className}>
        <Icon sx={{ fontSize: 20 }} />
        {label}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`${className} w-full cursor-pointer text-left`}
    >
      <Icon sx={{ fontSize: 20 }} />
      {label}
    </button>
  )
}

export default DashboardSidebarAction