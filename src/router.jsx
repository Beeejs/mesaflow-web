import { createBrowserRouter } from 'react-router'

/* Layouts */
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

/* Routes */
import ProtectedRoute from './components/route/ProtectedRoute'

/* Pages */
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import AdminDashboard from './pages/dashboard/admin/AdminDashboard'
import AdminUsers from './pages/dashboard/admin/users/AdminUsers'
import AdminEstablishments from './pages/dashboard/admin/establishments/AdminEstablishments'
import AdminEstablishmentUsers from './pages/dashboard/admin/establishments/AdminEstablishmentUsers'
import WorkspaceSelector from './pages/workspace/WorkspaceSelector'

const router = createBrowserRouter([
  {
    path: '/',
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
    ],
  },
  {
    path: '/login',
    Component: AuthLayout,
    children: [
      {
        index: true,
        Component: Login,
      },
    ],
  },
  {
    element: <ProtectedRoute allowedRoles={['ADMIN']} />,
    children: [
      {
        path: '/dashboard',
        Component: DashboardLayout,
        children: [
          {
            index: true,
            Component: AdminDashboard,
          },
          {
            path: 'usuarios',
            Component: AdminUsers,
          },
          {
            path: 'establecimientos',
            Component: AdminEstablishments,
          },
          {
            path: 'establecimientos/:idEstablecimiento/usuarios',
            Component: AdminEstablishmentUsers,
          },
        ],
      },
    ],
  },
  {
    element: (
      <ProtectedRoute
        allowedRoles={['ADMIN', 'ENCARGADO', 'MOZO']}
      />
    ),
    children: [
      {
        path: '/workspace',
        Component: WorkspaceSelector,
      },
    ],
  },
])

export default router