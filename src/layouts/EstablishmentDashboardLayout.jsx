import { useContext } from 'react'

/* Layouts */
import DashboardLayout from './DashboardLayout'

/* Context */
import { WorkspaceContext } from '../context/WorkspaceContext'

/* Constants */
import {
  managerDashboardNavigation,
  waiterDashboardNavigation,
} from '../constants/constants'

const EstablishmentDashboardLayout = () => {
  // Hooks
  const { selectedEstablishment } = useContext(WorkspaceContext)

  // Constantes derivadas
  const role = selectedEstablishment?.rolEstablecimiento

  const navigation =
    role === 'MOZO'
      ? waiterDashboardNavigation
      : managerDashboardNavigation

  // Renderizado
  return (
    <DashboardLayout
      navigation={navigation}
    />
  )
}

export default EstablishmentDashboardLayout