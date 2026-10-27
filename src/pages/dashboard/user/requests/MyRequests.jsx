import { useState } from 'react'

/* Components */
import Loader from '../../../../components/common/loader/Loader'
import DefaultButton from '../../../../components/common/button/DefaultButton'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import RequestCard from '../../../../components/dashboard/user/requests/RequestCard'
import AssociateDialog from '../../../../components/home/associate/AssociateDialog'

/* Hooks */
import useMyEstablishmentsQuery from '../../../../hooks/queries/useMyEstablishmentsQuery'

const MyRequests = () => {
  // Hooks
  const [associateDialogOpen, setAssociateDialogOpen] =
    useState(false)

  const {
    data: requests = [],
    isLoading,
    isError,
  } = useMyEstablishmentsQuery()

  // Funciones
  const handleOpenAssociateDialog = () => {
    setAssociateDialogOpen(true)
  }

  const handleCloseAssociateDialog = () => {
    setAssociateDialogOpen(false)
  }

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

  if (isError) {
    return (
      <p className="text-mesa-muted">
        No se pudieron cargar las solicitudes.
      </p>
    )
  }

  return (
    <section>
      <DashboardPageHeader
        eyebrow="Solicitudes"
        title="Mis solicitudes"
        description="Consultá el estado de los establecimientos que solicitaste."
        action={
          <DefaultButton
            type="button"
            onClick={handleOpenAssociateDialog}
          >
            Solicitar establecimiento
          </DefaultButton>
        }
      />

      {requests.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-6">
          <p className="text-sm text-mesa-muted">
            Todavía no realizaste solicitudes de establecimientos.
          </p>

          <div className="mt-5">
            <DefaultButton
              type="button"
              onClick={handleOpenAssociateDialog}
            >
              Solicitar establecimiento
            </DefaultButton>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {requests.map((request) => (
            <RequestCard
              key={request.idEstablecimiento}
              request={request}
            />
          ))}
        </div>
      )}

      <AssociateDialog
        open={associateDialogOpen}
        onClose={handleCloseAssociateDialog}
      />
    </section>
  )
}

export default MyRequests