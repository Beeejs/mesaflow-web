
const establishmentStatusStyles = {
  PENDIENTE: 'bg-amber-500/10 text-amber-400',
  APROBADO: 'bg-green-500/10 text-green-400',
  RECHAZADO: 'bg-red-500/10 text-red-400',
}

const EstablishmentStatusChip = ({ status }) => {
  const normalizedStatus = status?.toUpperCase() || ''

  const statusStyle =
    establishmentStatusStyles[normalizedStatus] ||
    'bg-mesa-card text-mesa-muted'

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyle}`}
    >
      {status || 'Sin estado'}
    </span>
  )
}

export default EstablishmentStatusChip