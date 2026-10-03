import { useContext, useState } from 'react'

/* MUI Icons */
import StorefrontIcon from '@mui/icons-material/Storefront'

/* Components */
import AssignedEstablishmentCard from '../../components/workspace/AssignedEstablishmentCard'
import MyRequestsSummaryCard from '../../components/workspace/MyRequestsSummaryCard'
import MyEstablishmentsDialog from '../../components/workspace/MyEstablishmentsDialog'

/* Hooks */
import useAssignedEstablishmentsQuery from '../../hooks/queries/useAssignedEstablishmentsQuery'
import useMyEstablishmentsQuery from '../../hooks/queries/useMyEstablishmentsQuery'

/* Context */
import { SessionContext } from '../../context/SessionContext'

const WorkspaceSelector = () => {
  // Hooks
  const { user } = useContext(SessionContext)

  const [isRequestsOpen, setIsRequestsOpen] = useState(false)

  const {
    data: requests = [],
    isLoading: requestsLoading,
    isError: requestsError,
  } = useMyEstablishmentsQuery()

  const {
    data: assignedEstablishments = [],
    isLoading: assignedLoading,
    isError: assignedError,
  } = useAssignedEstablishmentsQuery()

  // Constantes derivadas
  const pendingRequestsCount = requests.filter(
    (establishment) =>
      establishment.estadoEstablecimiento === 'PENDIENTE'
  ).length

  // Funciones
  const handleSelectEstablishment = (establishment) => {
    console.log(
      'Establecimiento seleccionado:',
      establishment
    )
  }

  // Renderizado
  return (
    <main className="min-h-screen bg-mesa-bg px-4 py-10 text-mesa-text sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <header>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-mesa-cyan">
            MesaFlow
          </p>

          <h1 className="mt-3 font-poppins text-3xl font-bold sm:text-4xl">
            Hola{user?.nombre ? `, ${user.nombre}` : ''}
          </h1>

          <p className="mt-2 text-mesa-muted">
            Seleccioná el establecimiento en el que vas a trabajar.
          </p>
        </header>

        <section className="mt-10">
          <div className="mb-5">
            <h2 className="font-poppins text-xl font-bold">
              ¿Dónde vas a trabajar hoy?
            </h2>

            <p className="mt-1 text-sm text-mesa-muted">
              Elegí uno de los establecimientos en los que tenés acceso.
            </p>
          </div>

          {assignedLoading && (
            <div className="rounded-3xl border border-mesa-border bg-mesa-surface/60 p-8 text-center">
              <p className="text-sm text-mesa-muted">
                Cargando establecimientos...
              </p>
            </div>
          )}

          {assignedError && (
            <div className="rounded-3xl border border-mesa-border bg-mesa-surface/60 p-8 text-center">
              <p className="text-sm text-red-400">
                No se pudieron cargar tus establecimientos.
              </p>
            </div>
          )}

          {!assignedLoading &&
            !assignedError &&
            assignedEstablishments.length === 0 && (
              <div className="rounded-3xl border border-dashed border-mesa-border bg-mesa-surface/60 p-8 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-mesa-card text-mesa-cyan">
                  <StorefrontIcon />
                </div>

                <h3 className="mt-4 font-semibold">
                  Todavía no tenés establecimientos asignados
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-mesa-muted">
                  Cuando tengas una asignación activa, vas a poder
                  seleccionarla desde acá.
                </p>
              </div>
            )}

          {!assignedLoading &&
            !assignedError &&
            assignedEstablishments.length > 0 && (
              <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                {assignedEstablishments.map(
                  (establishment) => (
                    <AssignedEstablishmentCard
                      key={
                        establishment.idEstablecimiento
                      }
                      establishment={establishment}
                      onSelect={
                        handleSelectEstablishment
                      }
                    />
                  )
                )}
              </div>
            )}
        </section>

        <section className="mt-8">
          <MyRequestsSummaryCard
            pendingCount={pendingRequestsCount}
            onClick={() => setIsRequestsOpen(true)}
          />
        </section>
      </div>

      <MyEstablishmentsDialog
        open={isRequestsOpen}
        establishments={requests}
        isLoading={requestsLoading}
        isError={requestsError}
        onClose={() => setIsRequestsOpen(false)}
      />
    </main>
  )
}

export default WorkspaceSelector