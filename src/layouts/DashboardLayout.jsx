
import { useContext, useState, useRef } from 'react'
import { Outlet } from 'react-router'

/* Components */
import DashboardSidebar from '../components/dashboard/menu/DashboardSidebar'
import DashboardTopbar from '../components/dashboard/menu/DashboardTopbar'

/* Context */
import { SessionContext } from '../context/SessionContext'

const DashboardLayout = () => {
  const { logoutUser } = useContext(SessionContext)

  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Referencia para el trigger del sidebar
  const sidebarTriggerRef = useRef(null)

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <div className="min-h-screen bg-mesa-bg text-mesa-text">
      <div className="flex min-h-screen">
        <DashboardSidebar
          onLogout={logoutUser}
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          triggerRef={sidebarTriggerRef}
        />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar
            onOpenSidebar={() => setIsSidebarOpen(true)}
            triggerRef={sidebarTriggerRef}
          />

          <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout