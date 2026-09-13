import { useContext } from 'react'
import { Outlet } from 'react-router'

/* Components */
import DashboardSidebar from '../components/dashboard/DashboardSidebar'
import DashboardTopbar from '../components/dashboard/DashboardTopbar'

/* Context */
import { SessionContext } from '../context/SessionContext'

const DashboardLayout = () => {
  const {
    logoutUser,
  } = useContext(SessionContext)

  return (
    <div className="min-h-screen bg-mesa-bg text-mesa-text">
      <div className="flex min-h-screen">
        <DashboardSidebar onLogout={logoutUser} />

        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardTopbar />

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default DashboardLayout