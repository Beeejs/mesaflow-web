import { createBrowserRouter, Navigate } from 'react-router'

/* Layouts */
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import DashboardLayout from './layouts/DashboardLayout'

/* Routes */
import ProtectedRoute from './components/route/ProtectedRoute'

/* Pages */
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import AdminUsers from './pages/dashboard/users/AdminUsers'
import AdminEstablishments from './pages/dashboard/establishments/AdminEstablishments'
import AdminEstablishmentUsers from './pages/dashboard/establishments/AdminEstablishmentUsers'
import MenuStock from './pages/dashboard/menu-stock/MenuStock'

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
          {
            path: 'establecimientos/:idEstablecimiento/usuarios',
            Component: AdminEstablishmentUsers,
          },
        ],
      },
    ],
  },
  {
    // El acceso real lo controla el backend según el rol en el establecimiento
    element: <ProtectedRoute />,
    children: [
      {
        path: '/gestion',
        Component: DashboardLayout,
        children: [
          {
            index: true,
            element: <Navigate to="menu-stock" replace />,
          },
          {
            path: 'menu-stock',
            Component: MenuStock,
          },
        ],
      },
    ],
  },
])

export default router