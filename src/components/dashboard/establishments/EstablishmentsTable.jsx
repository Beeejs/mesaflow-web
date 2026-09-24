
/* MUI */
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'

/* MUI Icons */
import EditIcon from '@mui/icons-material/Edit'

/* Components */
import DashboardDataGrid from '../DashboardDataGrid'
import EstablishmentStatusChip from './EstablishmentStatusChip'

const formatDate = (date) => {
  if (!date) return '-'

  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

const EstablishmentsTable = ({
  establishments = [],
  loading = false,
  onEditEstablishment,
}) => {
  const columns = [
    {
      field: 'nombre',
      headerName: 'Establecimiento',
      flex: 1,
      minWidth: 190,
      renderCell: (params) => (
        <span className="font-semibold text-mesa-text">
          {params.value}
        </span>
      ),
    },
    {
      field: 'solicitante',
      headerName: 'Solicitante',
      flex: 1,
      minWidth: 180,
      valueGetter: (_, row) =>
        `${row.nombreUsuarioSolicitante || ''} ${row.apellidoUsuarioSolicitante || ''}`.trim(),
    },
    {
      field: 'provincia',
      headerName: 'Provincia',
      flex: 0.8,
      minWidth: 160,
    },
    {
      field: 'partido',
      headerName: 'Partido',
      flex: 0.8,
      minWidth: 150,
    },
    {
      field: 'estadoEstablecimiento',
      headerName: 'Estado',
      flex: 0.8,
      minWidth: 150,
      renderCell: (params) => (
        <EstablishmentStatusChip status={params.value} />
      ),
    },
    {
      field: 'fechaSolicitud',
      headerName: 'Fecha de solicitud',
      flex: 0.8,
      minWidth: 160,
      valueFormatter: (value) => formatDate(value),
    },
    {
      field: 'acciones',
      headerName: 'Acciones',
      minWidth: 110,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => (
        <Tooltip title="Editar establecimiento">
          <IconButton
            onClick={() => onEditEstablishment(params.row)}
            disabled={!onEditEstablishment}
            sx={{
              color: '#94A3B8',
              '&:hover': {
                color: '#F8FAFC',
                backgroundColor: '#111827',
              },
            }}
          >
            <EditIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      ),
    },
  ]

  return (
    <DashboardDataGrid
      rows={establishments}
      columns={columns}
      getRowId={(row) => row.idEstablecimiento}
      loading={loading}
      emptyMessage="No hay establecimientos registrados."
    />
  )
}

export default EstablishmentsTable