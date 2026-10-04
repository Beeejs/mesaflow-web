import { useContext } from 'react'

/* Context */
import { WorkspaceContext } from '../../../context/WorkspaceContext'

const EstablishmentDashboard = () => {
  // Hooks
  const { selectedEstablishment } = useContext(WorkspaceContext)

  // Constantes derivadas
  const establishmentName = selectedEstablishment?.nombre

  // Renderizado
  return (
    <section>
      <div>
        <h1 className="font-display text-3xl font-bold text-mesa-text sm:text-4xl">
          Buenos días, {establishmentName} 👋
        </h1>

        <p className="mt-2 text-sm text-mesa-muted">
          Panel operativo del establecimiento
        </p>
      </div>
    </section>
  )
}

export default EstablishmentDashboard