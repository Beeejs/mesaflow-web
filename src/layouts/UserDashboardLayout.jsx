import { useContext } from 'react'

/* Layouts */
import DashboardLayout from './DashboardLayout'

/* Context */
import { SessionContext } from '../context/SessionContext'
import { WorkspaceContext } from '../context/WorkspaceContext'

/* Constants */
import {
  userDashboardNavigation,
  adminDashboardNavigation,
  getEstablishmentDashboardNavigation,
} from '../constants/constants'

const UserDashboardLayout = () => {
  // Hooks
  const { user } = useContext(SessionContext)
  const { selectedEstablishment } = useContext(WorkspaceContext)

  // Constantes derivadas
  const isAdmin = user?.rol === 'ADMIN'

  const navigation = isAdmin
    ? [
        ...userDashboardNavigation,
        ...adminDashboardNavigation,
      ]
    : selectedEstablishment
      ? getEstablishmentDashboardNavigation(selectedEstablishment.idEstablecimiento)
      : userDashboardNavigation

  // Renderizado
  return (
    <DashboardLayout
      navigation={navigation}
    />
  )
}

export default UserDashboardLayout