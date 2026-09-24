
/* Components */
import MobileDrawer from '../../menu/MobileDrawer'
import DashboardSidebarContent from './DashboardSidebarContent'

const DashboardSidebar = ({
  onLogout,
  isOpen = false,
  onClose,
  triggerRef
}) => {
  return (
    <>
      {/* Menú mobile y tablet */}
      <MobileDrawer
        variant="dashboard"
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
      >
        <DashboardSidebarContent
          onLogout={onLogout}
          onClose={onClose}
          mobile
        />
      </MobileDrawer>

      {/* Sidebar fijo desktop */}
      <aside
        className="
          hidden w-72 shrink-0 flex-col
          border-r border-mesa-border
          bg-mesa-surface/70 px-5 py-6
          min-[1200px]:flex
        "
        aria-label="Navegación del dashboard"
      >
        <DashboardSidebarContent
          onLogout={onLogout}
          onClose={onClose}
        />
      </aside>
    </>
  )
}

export default DashboardSidebar