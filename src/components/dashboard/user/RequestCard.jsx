/* Components */
import EstablishmentStatusChip from '../../dashboard/admin/establishments/EstablishmentStatusChip'

/* Utils */
import { formatDate } from '../../../utils/dateUtils'

const RequestCard = ({ request }) => {
  // Renderizado
  return (
    <article className="rounded-3xl border border-mesa-border bg-mesa-surface p-6 shadow-xl shadow-black/10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-display text-xl font-bold text-mesa-text">
            {request.nombre}
          </h2>

          {request.direccion && (
            <p className="mt-2 text-sm text-mesa-muted">
              {request.direccion}
            </p>
          )}
        </div>

        <EstablishmentStatusChip
          status={request.estadoEstablecimiento}
        />
      </div>

      {request.fechaSolicitud && (
        <p className="mt-5 border-t border-mesa-border pt-4 text-sm text-mesa-muted">
          Solicitud realizada: {formatDate(request.fechaSolicitud)}
        </p>
      )}
    </article>
  )
}

export default RequestCard