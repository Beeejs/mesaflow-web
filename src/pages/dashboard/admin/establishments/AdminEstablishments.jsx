import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

/* Components */
import Table from '../../../../components/table/Table'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import DashboardRefreshButton from '../../../../components/dashboard/DashboardRefreshButton'
import EstablishmentFormDialog from '../../../../components/dashboard/admin/establishments/EstablishmentFormDialog'

/* Columns */
import { getEstablishmentColumns } from '../../../../components/table/columns/establishmentColumns'

/* Context */
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

/* Hooks */
import useEstablishmentsQuery from '../../../../hooks/queries/useEstablishmentsQuery'
import useEstablishmentStatesQuery from '../../../../hooks/queries/useEstablishmentStatesQuery'
import useUpdateEstablishmentMutation from '../../../../hooks/mutations/useUpdateEstablishmentMutation'

const AdminEstablishments = () => {
  // Hooks
  const navigate = useNavigate()
  const { openActionDialog } = useContext(ActionDialogContext)

  const [selectedEstablishment, setSelectedEstablishment] =
    useState(null)

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

  const updateMutation =
    useUpdateEstablishmentMutation()

  // Constantes derivadas
  const approvedState = establishmentStates.find(
    (state) =>
      state.descripcion?.toUpperCase() === 'APROBADO'
  )

  // useEffect
  useEffect(() => {
    if (error) {
      toast.error(
        'No se pudieron cargar los establecimientos.'
      )
    }
  }, [error])

  // Funciones
  const handleApproveEstablishment = (establishment) => {
    if (!approvedState || updateMutation.isPending) {
      return
    }

    openActionDialog({
      title: 'Aprobar establecimiento',
      description: `¿Querés aprobar "${establishment.nombre}"? El establecimiento será aprobado y el solicitante pasará a ser encargado.`,
      actionLabel: 'Aprobar',
      cancelLabel: 'Cancelar',
      variant: 'primary',
      icon: 'confirm',
      onAction: async () => {
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
            idEstablecimiento:
              establishment.idEstablecimiento,
            establishmentData,
          })

          toast.success(
            'Establecimiento aprobado correctamente.'
          )
        } catch (error) {
          toast.error(
            error.response?.data?.message ||
              'No se pudo aprobar el establecimiento.'
          )

          throw error
        }
      },
    })
  }

  const handleManageUsers = (establishment) => {
    navigate(
      `/dashboard/establecimientos/${establishment.idEstablecimiento}/usuarios`
    )
  }

  const handleEditEstablishment = (establishment) => {
    setSelectedEstablishment(establishment)
  }

  // Constantes derivadas
  const columns = getEstablishmentColumns({
    onApproveEstablishment:
      handleApproveEstablishment,
    onManageUsers: handleManageUsers,
    onEditEstablishment:
      handleEditEstablishment,
    approvalLoading:
      updateMutation.isPending,
  })

  // Renderizado
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
        <Table
          rows={establishments}
          columns={columns}
          getRowId={(row) =>
            row.idEstablecimiento
          }
          loading={isLoading}
          emptyMessage="No hay establecimientos registrados."
        />
      </div>

      {selectedEstablishment && (
        <EstablishmentFormDialog
          key={
            selectedEstablishment.idEstablecimiento
          }
          open={Boolean(
            selectedEstablishment
          )}
          establishment={
            selectedEstablishment
          }
          onClose={() =>
            setSelectedEstablishment(null)
          }
        />
      )}
    </section>
  )
}

export default AdminEstablishments