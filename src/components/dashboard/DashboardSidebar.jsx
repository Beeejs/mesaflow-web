import { Link } from 'react-router'
import { toast } from 'sonner'

/* MUI Icons */
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'

/* Components */
import DashboardNavLink from './DashboardNavLink'
import DashboardSidebarAction from './DashboardSidebarAction'

/* Constants */
import { dashboardNavigation } from '../../constants/constants'


const DashboardSidebar = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await onLogout()

      toast.success('Sesión cerrada correctamente.')
    } catch {
      toast.error('No se pudo cerrar la sesión.')
    }
  }

  return (
    <aside className="hidden w-72 shrink-0 border-r border-mesa-border bg-mesa-surface/70 px-5 py-6 lg:flex lg:flex-col">
      <Link to="/" className="flex items-center gap-3">
        <img
          src="/logo/mesaFlow_circular_logo.png"
          alt="Logo MesaFlow"
          className="h-12 w-12 rounded-full object-contain"
        />

        <div>
          <p className="font-display text-lg font-bold text-mesa-text">
            Mesa<span className="text-mesa-primary">Flow</span>
          </p>

          <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-mesa-muted">
            PANEL
          </p>
        </div>
      </Link>

      <nav className="mt-10 grid gap-2">
        {dashboardNavigation.map((item) => (
          <DashboardNavLink
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            end={item.end}
          />
        ))}
      </nav>

      <div className="mt-auto grid gap-2 border-t border-mesa-border pt-5">
        <DashboardSidebarAction
          to="/"
          label="Volver al inicio"
          icon={HomeIcon}
        />

        <DashboardSidebarAction
          label="Cerrar sesión"
          icon={LogoutIcon}
          onClick={handleLogout}
          variant="danger"
        />
      </div>
    </aside>
  )
}

export default DashboardSidebar