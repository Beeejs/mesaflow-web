
/* Components */
import DashboardDataGrid from '../DashboardDataGrid'

const formatDate = (date) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

const EstablishmentUsersTable = ({
  users = [],
  loading = false,
}) => {
  const columns = [
    {
      field: 'nombreCompleto',
      headerName: 'Usuario',
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) =>
        `${row.nombre || ''} ${row.apellido || ''}`.trim(),
      renderCell: (params) => (
        <span className="font-semibold text-mesa-text">
          {params.value}
        </span>
      ),
    },
    {
      field: 'email',
      headerName: 'Email',
      flex: 1.3,
      minWidth: 220,
    },
    {
      field: 'rolEstablecimiento',
      headerName: 'Rol',
      flex: 0.7,
      minWidth: 140,
      renderCell: (params) => (
        <span className="rounded-full border border-mesa-border px-3 py-1 text-xs font-bold text-mesa-cyan-light">
          {params.value}
        </span>
      ),
    },
    {
      field: 'fechaAsignacion',
      headerName: 'Asignación',
      flex: 0.8,
      minWidth: 145,
      valueFormatter: (value) => formatDate(value),
    },
  ]

  return (
    <DashboardDataGrid
      rows={users}
      columns={columns}
      getRowId={(row) => row.idUsuario}
      loading={loading}
      emptyMessage="No hay usuarios asociados a este establecimiento."
    />
  )
}

export default EstablishmentUsersTable
