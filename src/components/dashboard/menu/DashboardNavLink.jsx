import { NavLink } from 'react-router'

const DashboardNavLink = ({ to, label, icon: Icon, end = false, onClick }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
          isActive
            ? 'bg-mesa-primary text-white shadow-lg shadow-mesa-primary/20'
            : 'text-mesa-muted hover:bg-mesa-card hover:text-mesa-text'
        }`
      }
    >
      <Icon sx={{ fontSize: 20 }} />

      <span>{label}</span>
    </NavLink>
  )
}

export default DashboardNavLink