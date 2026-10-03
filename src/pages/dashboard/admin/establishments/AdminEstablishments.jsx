
import { useEffect, useState } from 'react'
import { toast } from 'sonner'


/* Components */
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import DashboardRefreshButton from '../../../../components/dashboard/DashboardRefreshButton'


/* Hooks */
import useEstablishmentsQuery from '../../../../hooks/queries/useEstablishmentsQuery'
import useEstablishmentStatesQuery from '../../../../hooks/queries/useEstablishmentStatesQuery'
import useUpdateEstablishmentMutation from '../../../../hooks/mutations/useUpdateEstablishmentMutation'

/* Components */
import EstablishmentsTable from '../../../../components/dashboard/admin/establishments/EstablishmentsTable'
import EstablishmentFormDialog from '../../../../components/dashboard/admin/establishments/EstablishmentFormDialog'

const AdminEstablishments = () => {
  // Query para obtener los establecimientos
  const {
    data: establishments = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useEstablishmentsQuery()

  const {
    data: establishmentStates = [],
  } = useEstablishmentStatesQuery()

  const updateMutation = useUpdateEstablishmentMutation()

  // Estado para manejar el establecimiento seleccionado para editar
  const [selectedEstablishment, setSelectedEstablishment] = useState(null)

  // Constantes derivadas
  const approvedState = establishmentStates.find(
    (state) => state.descripcion?.toUpperCase() === 'APROBADO'
  )

  // UseEffect para mostrar un toast de error si ocurre un error al cargar los establecimientos
  useEffect(() => {
    if (error) {
      toast.error('No se pudieron cargar los establecimientos.')
    }
  }, [error])


  // Funcion para manejar la aprobacion de un establecimiento
  const handleApproveEstablishment = (establishment) => {
    if (!approvedState || updateMutation.isPending) return

    toast(
      `¿Querés aprobar ${establishment.nombre}?`,
      {
        description:
          'El establecimiento será aprobado y el solicitante pasará a ser encargado.',
        action: {
          label: 'Aprobar',
          onClick: async () => {
            try {
              const establishmentData = {
                nombre: establishment.nombre,
                razonSocial: establishment.razonSocial,
                cuit: establishment.cuit,
                direccion: establishment.direccion,
                idPartido: establishment.idPartido,
                codigoPostal: establishment.codigoPostal,
                telefono: establishment.telefono,
                email: establishment.email,
                idEstadoEstablecimiento:
                  approvedState.idEstadoEstablecimiento,
              }

              await updateMutation.mutateAsync({
                idEstablecimiento: establishment.idEstablecimiento,
                establishmentData,
              })

              toast.success('Establecimiento aprobado correctamente.')
            } catch (error) {
              toast.error(
                error.response?.data?.message ||
                  'No se pudo aprobar el establecimiento.'
              )
            }
          },
        },
        cancel: {
          label: 'Cancelar',
          onClick: () => {},
        },
      }
    )
  }

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
          onApproveEstablishment={handleApproveEstablishment}
          approvalLoading={updateMutation.isPending}
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