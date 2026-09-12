import { createBrowserRouter } from 'react-router'

/* Layouts */
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import AdminLayout from './layouts/AdminLayout'

/* Routes */
import ProtectedRoute from './components/route/ProtectedRoute'

/* Pages */
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Dashboard from './pages/admin/dashboard/Dashboard'
import AdminUsers from './pages/admin/users/AdminUsers'
import AdminEstablishments from './pages/admin/establishments/AdminEstablishments'

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
        Component: AdminLayout,
        children: [
          {
            index: true,
            Component: Dashboard,
          },
          {
            path: 'usuarios',
            Component: AdminUsers,
          },
          {
            path: 'establecimientos',
            Component: AdminEstablishments,
          },
        ],
      },
    ],
  },
])

export default router