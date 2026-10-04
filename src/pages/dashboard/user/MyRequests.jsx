/* Components */
import Loader from '../../../components/common/loader/Loader'
import RequestCard from '../../../components/dashboard/user/RequestCard'

/* Hooks */
import useMyEstablishmentsQuery from '../../../hooks/queries/useMyEstablishmentsQuery'

const MyRequests = () => {
  // Hooks
  const {
    data: requests = [],
    isLoading,
    isError,
  } = useMyEstablishmentsQuery()

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
      <div className="max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
          Solicitudes
        </p>

        <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
          Mis solicitudes
        </h1>

        <p className="mt-4 text-base leading-7 text-mesa-muted">
          Consultá el estado de los establecimientos que solicitaste.
        </p>
      </div>

      {requests.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-6">
          <p className="text-sm text-mesa-muted">
            Todavía no realizaste solicitudes de establecimientos.
          </p>
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
    </section>
  )
}

export default MyRequests