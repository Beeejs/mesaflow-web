/* MUI Icons */
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'

/* Components */
import DashboardTableActionButton from '../../dashboard/DashboardTableActionButton'

export const getAssignedEstablishmentColumns = ({
  onSelectEstablishment,
  canWork = true,
}) => [
  {
    field: 'nombre',
    headerName: 'Establecimiento',
    flex: 1,
    minWidth: 220,
    renderCell: (params) => (
      <span className="font-semibold text-mesa-text">
        {params.value}
      </span>
    ),
  },
  {
    field: 'acciones',
    headerName: 'Acciones',
    minWidth: 130,
    sortable: false,
    filterable: false,
    align: 'right',
    headerAlign: 'right',
    renderCell: (params) => (
      <div className="flex h-full items-center justify-end">
        {canWork && (
          <DashboardTableActionButton
            title="Trabajar aquí"
            ariaLabel={`Trabajar en ${params.row.nombre}`}
            onClick={() =>
              onSelectEstablishment(params.row)
            }
            highlight
          >
            <ArrowForwardRoundedIcon
              sx={{ fontSize: 20 }}
            />
          </DashboardTableActionButton>
        )}
      </div>
    ),
  },
]