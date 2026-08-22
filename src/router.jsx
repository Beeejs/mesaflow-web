import { createBrowserRouter } from 'react-router'

/* Layouts */
import MainLayout from './layouts/MainLayout.jsx'
import AuthLayout from './layouts/AuthLayout'

/* Pages */
import Home from './pages/home/Home'
import Login from './pages/auth/Login'

const router = createBrowserRouter([
  {
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
])

export default router