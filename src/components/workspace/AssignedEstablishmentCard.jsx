/* MUI Icons */
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined'

const AssignedEstablishmentCard = ({
  establishment,
  onSelect,
}) => {
  // Constantes derivadas
  const status = establishment.estadoEstablecimiento
  const canWork = status === 'APROBADO'

  const statusStyles = {
    APROBADO: 'bg-green-500/15 text-green-400',
    PENDIENTE: 'bg-amber-500/15 text-amber-400',
    RECHAZADO: 'bg-red-500/15 text-red-400',
  }

  const statusLabel = {
    APROBADO: 'Aprobado',
    PENDIENTE: 'Pendiente',
    RECHAZADO: 'Rechazado',
  }

  // Renderizado
  return (
    <article
      className="
        overflow-hidden rounded-3xl
        border border-mesa-border
        bg-mesa-surface/70
      "
    >
      <div className="h-40 bg-mesa-card">
        {establishment.imagenUrl ? (
          <img
            src={establishment.imagenUrl}
            alt={establishment.nombre}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-mesa-muted">
            Sin imagen
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="font-poppins text-xl font-bold text-mesa-text">
              {establishment.nombre}
            </h3>

            <div className="mt-3 flex flex-wrap gap-2">
              <span
                className="
                  rounded-full bg-mesa-primary/10
                  px-3 py-1 text-xs font-bold
                  text-mesa-cyan
                "
              >
                {establishment.rolEstablecimiento}
              </span>

              <span
                className={`
                  rounded-full px-3 py-1
                  text-xs font-bold
                  ${statusStyles[status] ?? 'bg-mesa-card text-mesa-muted'}
                `}
              >
                {statusLabel[status] ?? status}
              </span>
            </div>
          </div>
        </div>

        {establishment.direccion && (
          <div className="mt-5 flex items-center gap-2 text-sm text-mesa-muted">
            <LocationOnOutlinedIcon fontSize="small" />

            <span>{establishment.direccion}</span>
          </div>
        )}

        <button
          type="button"
          disabled={!canWork}
          onClick={() => onSelect(establishment)}
          className="
            mt-6 w-full rounded-2xl
            px-5 py-3.5 font-semibold
            transition
            enabled:cursor-pointer
            enabled:bg-mesa-primary
            enabled:text-white
            enabled:hover:brightness-110
            disabled:cursor-not-allowed
            disabled:bg-mesa-card
            disabled:text-mesa-muted
          "
        >
          Trabajar aquí
        </button>

        {!canWork && (
          <p className="mt-3 text-center text-xs leading-5 text-mesa-muted">
            {status === 'PENDIENTE'
              ? 'Este establecimiento todavía está pendiente de aprobación.'
              : status === 'RECHAZADO'
                ? 'La solicitud de este establecimiento fue rechazada.'
                : 'Este establecimiento no está disponible para trabajar.'}
          </p>
        )}
      </div>
    </article>
  )
}

export default AssignedEstablishmentCard