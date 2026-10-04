import { useContext } from 'react'

/* Components */
import BackLink from '../../../components/common/button/BackLink'

/* Context */
import { WorkspaceContext } from '../../../context/WorkspaceContext'

const EstablishmentHome = () => {
  // Hooks
  const {
    selectedEstablishment,
    clearEstablishment,
  } = useContext(WorkspaceContext)

  // Funciones
  const handleBackToEstablishments = () => {
    clearEstablishment()
  }

  // Renderizado
  return (
    <section>
      <BackLink
        to="/dashboard/mis-establecimientos"
        onClick={handleBackToEstablishments}
      >
        Volver a mis establecimientos
      </BackLink>

      <h1 className="font-display mt-6 text-3xl font-bold text-mesa-text">
        {selectedEstablishment?.nombre}
      </h1>
    </section>
  )
}

export default EstablishmentHome