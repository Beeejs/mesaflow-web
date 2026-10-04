import { useNavigate } from 'react-router'

/* MUI Icons */
import EditIcon from '@mui/icons-material/Edit'
import GroupIcon from '@mui/icons-material/Group'
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

/* Components */
import DashboardDataGrid from '../../DashboardDataGrid'
import EstablishmentStatusChip from './EstablishmentStatusChip'
import DashboardTableActionButton from '../../DashboardTableActionButton'

/* Utils */
import { formatDate } from '../../../../utils/dateUtils'

const EstablishmentsTable = ({
  establishments = [],
  loading = false,
  onEditEstablishment,
  onApproveEstablishment,
  approvalLoading = false,
}) => {
  const navigate = useNavigate()

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
      minWidth: 120,
      sortable: false,
      filterable: false,
      align: 'right',
      headerAlign: 'right',
      renderCell: (params) => {
        const status =
          params.row.estadoEstablecimiento?.toUpperCase()

        const isPending = status === 'PENDIENTE'
        const isApproved = status === 'APROBADO'

        return (
          <div className="flex h-full items-center justify-end gap-1">
            {isPending && (
              <DashboardTableActionButton
                title="Aprobar establecimiento"
                onClick={() =>
                  onApproveEstablishment(params.row)
                }
                ariaLabel={`Aprobar establecimiento ${params.row.nombre}`}
                disabled={approvalLoading}
                highlight
              >
                <CheckCircleIcon sx={{ fontSize: 20 }} />
              </DashboardTableActionButton>
            )}

            {isApproved && (
              <DashboardTableActionButton
                title="Administrar usuarios"
                onClick={() =>
                  navigate(
                    `/dashboard/establecimientos/${params.row.idEstablecimiento}/usuarios`
                  )
                }
                ariaLabel={`Administrar usuarios de ${params.row.nombre}`}
                highlight
              >
                <GroupIcon sx={{ fontSize: 20 }} />
              </DashboardTableActionButton>
            )}

            <DashboardTableActionButton
              title="Editar establecimiento"
              onClick={() => onEditEstablishment(params.row)}
              ariaLabel={`Editar establecimiento ${params.row.nombre}`}
            >
              <EditIcon sx={{ fontSize: 20 }} />
            </DashboardTableActionButton>
          </div>
        )
      },
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