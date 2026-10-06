import { createBrowserRouter } from 'react-router'

/* Layouts */
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'

/* Routes */
import ProtectedRoute from './components/route/ProtectedRoute'
import UserDashboardLayout from './layouts/UserDashboardLayout'
import AssignedEstablishmentRoute from './components/route/AssignedEstablishmentRoute'

/* Pages */
import Home from './pages/home/Home'
import Login from './pages/auth/Login'
import AdminUsers from './pages/dashboard/admin/users/AdminUsers'
import AdminEstablishments from './pages/dashboard/admin/establishments/AdminEstablishments'
import AdminEstablishmentUsers from './pages/dashboard/admin/establishments/AdminEstablishmentUsers'
import MyRequests from './pages/dashboard/user/requests/MyRequests'
import AssignedEstablishments from './pages/dashboard/user/establishments/AssignedEstablishments'
import EstablishmentHome from './pages/dashboard/user/EstablishmentHome'
import DashboardHome from './pages/dashboard/user/DashboardHome'
import MenuStock from './pages/dashboard/user/menuStock/MenuStock'

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
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        Component: UserDashboardLayout,
        children: [
          {
            index: true,
            Component: DashboardHome,
          },

          // Rutas comunes
          {
            path: 'mis-solicitudes',
            Component: MyRequests,
          },
          {
            path: 'mis-establecimientos',
            Component: AssignedEstablishments,
          },
          {
            element: <AssignedEstablishmentRoute />,
            children: [
              {
                path: 'mis-establecimientos/:idEstablecimiento',
                Component: EstablishmentHome,
              },
              {
                path: 'mis-establecimientos/:idEstablecimiento/menu-stock',
                Component: MenuStock,
              },
            ],
          },

          // Rutas exclusivas de ADMIN
          {
            element: <ProtectedRoute allowedRoles={['ADMIN']} />,
            children: [
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
    ],
  },
])

export default router