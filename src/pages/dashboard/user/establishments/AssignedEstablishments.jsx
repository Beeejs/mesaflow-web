import { useContext, useState } from 'react'
import { useNavigate } from 'react-router'

/* Components */
import Loader from '../../../../components/common/loader/Loader'
import AssignedEstablishmentCard from '../../../../components/dashboard/user/establishments/AssignedEstablishmentCard'
import Table from '../../../../components/table/Table'

/* Hooks */
import useAssignedEstablishmentsQuery from '../../../../hooks/queries/useAssignedEstablishmentsQuery'

/* MUI Icons */
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded'
import ViewListRoundedIcon from '@mui/icons-material/ViewListRounded'

/* Columns */
import { getAssignedEstablishmentColumns } from '../../../../components/table/columns/assignedEstablishmentColumns'

/* Context */
import { WorkspaceContext } from '../../../../context/WorkspaceContext'
import { SessionContext } from '../../../../context/SessionContext'

const AssignedEstablishments = () => {
  // Hooks
  const navigate = useNavigate()

  const { user } = useContext(SessionContext)
  const { selectEstablishment } = useContext(WorkspaceContext)

  const [viewMode, setViewMode] = useState('grid')

  const {
    data: establishments = [],
    isLoading,
    isError,
  } = useAssignedEstablishmentsQuery()

  const isAdmin = user?.rol === 'ADMIN'

  // Funciones
  const handleSelectEstablishment = (establishment) => {
    selectEstablishment(establishment)

    navigate(
      `/dashboard/mis-establecimientos/${establishment.idEstablecimiento}`
    )
  }

  // Constantes derivadas
  const columns = getAssignedEstablishmentColumns({
    onSelectEstablishment: handleSelectEstablishment,
    canWork: !isAdmin,
  })

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
        No se pudieron cargar los establecimientos.
      </p>
    )
  }

  return (
    <section>
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Establecimientos
          </p>

          <h1 className="font-display mt-4 text-3xl font-bold tracking-tight text-mesa-text sm:text-4xl">
            Mis establecimientos
          </h1>

          <p className="mt-4 text-base leading-7 text-mesa-muted">
            Seleccioná el establecimiento en el que vas a trabajar.
          </p>
        </div>

        {establishments.length > 0 && (
          <div className="flex w-fit rounded-xl border border-mesa-border bg-mesa-surface p-1">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                viewMode === 'grid'
                  ? 'bg-mesa-primary text-white'
                  : 'text-mesa-muted hover:text-mesa-text'
              }`}
            >
              <GridViewRoundedIcon fontSize="small" />
              Tarjetas
            </button>

            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                viewMode === 'list'
                  ? 'bg-mesa-primary text-white'
                  : 'text-mesa-muted hover:text-mesa-text'
              }`}
            >
              <ViewListRoundedIcon fontSize="small" />
              Lista
            </button>
          </div>
        )}
      </div>

      {establishments.length === 0 ? (
        <div className="mt-8 rounded-3xl border border-mesa-border bg-mesa-surface p-6">
          <p className="text-sm text-mesa-muted">
            No tenés establecimientos asignados.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {establishments.map((establishment) => (
            <AssignedEstablishmentCard
              key={establishment.idEstablecimiento}
              establishment={establishment}
              onSelect={handleSelectEstablishment}
              canWork={!isAdmin}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 min-w-0 rounded-3xl border border-mesa-border bg-mesa-surface p-3 sm:p-6">
          <Table
            rows={establishments}
            columns={columns}
            getRowId={(establishment) =>
              establishment.idEstablecimiento
            }
            emptyMessage="No tenés establecimientos asignados."
          />
        </div>
      )}
    </section>
  )
}

export default AssignedEstablishments