import { Navigate, Outlet } from 'react-router'

/* Components */
import Loader from '../common/loader/Loader'

/* Hooks */
import useAssignedEstablishmentsQuery from '../../hooks/queries/useAssignedEstablishmentsQuery'
import useMyEstablishmentsQuery from '../../hooks/queries/useMyEstablishmentsQuery'

const WorkspaceRoute = () => {
  // Hooks
  const {
    data: assignedEstablishments = [],
    isLoading: assignedLoading,
  } = useAssignedEstablishmentsQuery()

  const {
    data: requests = [],
    isLoading: requestsLoading,
  } = useMyEstablishmentsQuery()

  // Constantes derivadas
  const isLoading =
    assignedLoading ||
    requestsLoading

  const hasWorkspaceAccess =
    assignedEstablishments.length > 0 ||
    requests.length > 0

  // Renderizado
  if (isLoading) {
    return (
      <Loader
        fullScreen
        size={250}
        showText={false}
      />
    )
  }

  if (!hasWorkspaceAccess) {
    return (
      <Navigate
        to="/"
        replace
      />
    )
  }

  return <Outlet />
}

export default WorkspaceRoute