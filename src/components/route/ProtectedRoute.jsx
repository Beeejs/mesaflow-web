import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router'

/* Context */
import { SessionContext } from '../../context/SessionContext'
import AppLoader from '../loader/AppLoader'

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const {
    user,
    isAuthenticated,
    isLoadingSession,
  } = useContext(SessionContext)

  if (isLoadingSession) {
    return <AppLoader />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.rol)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default ProtectedRoute