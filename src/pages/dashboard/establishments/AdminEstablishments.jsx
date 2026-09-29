
import { useEffect, useState } from 'react'
import { toast } from 'sonner'


/* Components */
import DashboardPageHeader from '../../../components/dashboard/DashboardPageHeader'
import DashboardRefreshButton from '../../../components/dashboard/DashboardRefreshButton'


/* Hooks */
import useEstablishmentsQuery from '../../../hooks/queries/useEstablishmentsQuery'

/* Components */
import EstablishmentsTable from '../../../components/dashboard/establishments/EstablishmentsTable'
import EstablishmentFormDialog from '../../../components/dashboard/establishments/EstablishmentFormDialog'

const AdminEstablishments = () => {
  // Query para obtener los establecimientos
  const {
    data: establishments = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEstablishmentsQuery()

  // Estado para manejar el establecimiento seleccionado para editar
  const [selectedEstablishment, setSelectedEstablishment] = useState(null)

  // UseEffect para mostrar un toast de error si ocurre un error al cargar los establecimientos
  useEffect(() => {
    if (error) {
      toast.error('No se pudieron cargar los establecimientos.')
    }
  }, [error])

  return (
    <section>
      <DashboardPageHeader
        eyebrow="Establecimientos"
        title="Administración de establecimientos"
        description="Consultá los establecimientos registrados y gestioná sus solicitudes."
        action={
          <DashboardRefreshButton
            onClick={() => refetch()}
            loading={isFetching}
            tooltip="Recargar establecimientos"
          />
        }
      />

      <div className="mt-8 min-w-0 rounded-3xl border border-mesa-border bg-mesa-surface p-3 sm:p-6">
        <EstablishmentsTable
          establishments={establishments}
          loading={isLoading}
          onEditEstablishment={setSelectedEstablishment}
        />
      </div>

      {/* Dialog para editar un establecimiento */}
      {selectedEstablishment && (
        <EstablishmentFormDialog
          key={selectedEstablishment.idEstablecimiento}
          open={Boolean(selectedEstablishment)}
          establishment={selectedEstablishment}
          onClose={() => setSelectedEstablishment(null)}
        />
      )}
    </section>
  )
}

export default AdminEstablishments