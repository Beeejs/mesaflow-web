import { useContext, useEffect } from 'react'
import { Navigate, Outlet, useParams } from 'react-router'

/* Components */
import Loader from '../common/loader/Loader'

/* Hooks */
import useAssignedEstablishmentsQuery from '../../hooks/queries/useAssignedEstablishmentsQuery'

/* Context */
import { WorkspaceContext } from '../../context/WorkspaceContext'

const EstablishmentRoute = () => {
  // Hooks
  const { idEstablecimiento } = useParams()

  const { selectEstablishment } = useContext(WorkspaceContext)

  const {
    data: assignedEstablishments = [],
    isLoading,
    isError,
  } = useAssignedEstablishmentsQuery()

  // Constantes derivadas
  const establishment = assignedEstablishments.find(
    (item) =>
      item.idEstablecimiento === Number(idEstablecimiento)
  )

  // useEffect
  useEffect(() => {
    if (!establishment) {
      return
    }

    selectEstablishment(establishment)
  }, [establishment, selectEstablishment])

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

  if (isError || !establishment) {
    return (
      <Navigate
        to="/workspace"
        replace
      />
    )
  }

  return <Outlet />
}

export default EstablishmentRoute