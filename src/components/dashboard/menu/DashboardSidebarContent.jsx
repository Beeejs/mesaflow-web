
import { Link } from 'react-router'
import { toast } from 'sonner'

/* MUI Icons */
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'

/* Components */
import DashboardNavLink from './DashboardNavLink'
import DashboardSidebarAction from './DashboardSidebarAction'
import MobileMenuButton from '../../menu/MobileMenuButton'

/* Constants */
import { dashboardNavigation } from '../../../constants/constants'

const DashboardSidebarContent = ({
  onLogout,
  onClose,
  mobile = false,
}) => {
  const handleLogout = async () => {
    try {
      await onLogout()
      onClose()
      toast.success('Sesión cerrada correctamente.')
    } catch {
      toast.error('No se pudo cerrar la sesión.')
    }
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex items-center justify-between gap-3">
        <Link
          to="/"
          onClick={onClose}
          className="flex items-center gap-3"
        >
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

        {mobile && (
          <MobileMenuButton
            variant="close"
            onClick={onClose}
          />
        )}
      </div>

      <nav className="mt-10 grid gap-2">
        {dashboardNavigation.map((item) => (
          <DashboardNavLink
            key={item.to}
            to={item.to}
            label={item.label}
            icon={item.icon}
            end={item.end}
            onClick={onClose}
          />
        ))}
      </nav>

      <div className="mt-auto grid gap-2 border-t border-mesa-border pt-5">
        <DashboardSidebarAction
          to="/"
          label="Volver al inicio"
          icon={HomeIcon}
          onClick={onClose}
        />

        <DashboardSidebarAction
          label="Cerrar sesión"
          icon={LogoutIcon}
          onClick={handleLogout}
          variant="danger"
        />
      </div>
    </div>
  )
}

export default DashboardSidebarContent