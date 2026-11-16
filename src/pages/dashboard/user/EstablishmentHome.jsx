import { useContext } from 'react'

/* Components */
import BackLink from '../../../components/common/button/BackLink'
import OrdersPanel from '../../../components/dashboard/user/orders/OrdersPanel'
import DashboardPageHeader from '../../../components/dashboard/DashboardPageHeader'

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
  const now = new Date()
  const greeting = now.getHours() < 12 ? 'Buenos días' : now.getHours() < 20 ? 'Buenas tardes' : 'Buenas noches'

  // Renderizado
  return (
    <section className="min-w-0 space-y-8">
      <BackLink
        to="/dashboard/mis-establecimientos"
        onClick={handleBackToEstablishments}
      >
        Volver a mis establecimientos
      </BackLink>

      <DashboardPageHeader title={`${greeting}, ${selectedEstablishment?.nombre}`}
        description={now.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />
      <OrdersPanel key={selectedEstablishment?.idEstablecimiento} operational />
    </section>
  )
}

export default EstablishmentHome