
import { useContext, useMemo, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import TextField from '@mui/material/TextField'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import DeleteIcon from '@mui/icons-material/Delete'

/* Components */
import DefaultButton from '../../../common/button/DefaultButton'
import DashboardFormDialog from '../../DashboardFormDialog'
import DashboardTableActionButton from '../../DashboardTableActionButton'
import SectorTableCanvas from './SectorTableCanvas'

/* Context */
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

/* Hooks */
import useCreateSectorMutation from '../../../../hooks/mutations/useCreateSectorMutation'
import useUpdateSectorMutation from '../../../../hooks/mutations/useUpdateSectorMutation'
import useDeleteSectorMutation from '../../../../hooks/mutations/useDeleteSectorMutation'

/* Styles */
import { textFieldStyles } from '../../../../styles/formStyles'

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback

const SectorsSection = ({
  idEstablecimiento,
  sectors = [],
  sectorsLoading = false,
  sectorsError = false,
  onRetrySectors,
  tables = [],
  distribution,
  distributionLoading = false,
  distributionError = false,
  onEditTable,
  onMoveTable,
  editorDisabled = false,
}) => {
  const { openActionDialog } =
    useContext(ActionDialogContext)

  const [sectorDialogOpen, setSectorDialogOpen] =
    useState(false)

  const [sectorName, setSectorName] =
    useState('')

  const [editingSector, setEditingSector] =
    useState(null)

  const createSectorMutation =
    useCreateSectorMutation(idEstablecimiento)

  const updateSectorMutation =
    useUpdateSectorMutation(idEstablecimiento)

  const deleteSectorMutation =
    useDeleteSectorMutation(idEstablecimiento)

  const isSectorSaving =
    createSectorMutation.isPending ||
    updateSectorMutation.isPending

  const isSectorDeleting =
    deleteSectorMutation.isPending

  const physicalTablesById = useMemo(
    () =>
      new Map(
        tables.map((table) => [
          Number(table.idMesa),
          table,
        ])
      ),
    [tables]
  )

  const distributionTables =
    distribution?.mesas ?? []

  const sectorGroups = sectors.map((sector) => {
    const mesas = distributionTables.filter(
      (detail) =>
        Number(detail.idSector) ===
        Number(sector.idSector)
    )

    const capacidad = mesas.reduce(
      (total, detail) => {
        const physical =
          physicalTablesById.get(
            Number(detail.idMesa)
          )

        return total +
          (Number(physical?.capacidad) || 0)
      },
      0
    )

    return {
      ...sector,
      mesas,
      capacidad,
    }
  })

  const unknownSectorTables =
    distributionTables.filter(
      (detail) =>
        !sectors.some(
          (sector) =>
            Number(sector.idSector) ===
            Number(detail.idSector)
        )
    )

  // =========================================
  // FORMULARIO DE SECTORES
  // =========================================

  const resetSectorForm = () => {
    setEditingSector(null)
    setSectorName('')
  }

  const handleOpenCreateSector = () => {
    resetSectorForm()
    setSectorDialogOpen(true)
  }

  const handleOpenEditSector = (sector) => {
    setEditingSector(sector)
    setSectorName(sector.nombre)
    setSectorDialogOpen(true)
  }

  const handleCloseSectorDialog = () => {
    if (isSectorSaving) return

    setSectorDialogOpen(false)
    resetSectorForm()
  }

  const handleSaveSector = async (event) => {
    event.preventDefault()

    const nombre = sectorName.trim()

    if (!nombre || isSectorSaving) return

    try {
      if (editingSector) {
        await updateSectorMutation.mutateAsync({
          idSector: editingSector.idSector,
          nombre,
        })

        toast.success(
          'Sector modificado correctamente.'
        )
      } else {
        await createSectorMutation.mutateAsync(nombre)

        toast.success(
          'Sector creado correctamente.'
        )
      }

      setSectorDialogOpen(false)
      resetSectorForm()
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          'No se pudo guardar el sector.'
        )
      )
    }
  }

  const handleDeleteSector = (sector) => {
    if (isSectorDeleting) return

    openActionDialog({
      title: 'Eliminar sector',
      description:
        `¿Querés eliminar el sector "${sector.nombre}"? ` +
        'Si contiene mesas en configuraciones vigentes, ' +
        'el backend puede rechazar la operación.',
      actionLabel: 'Eliminar',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      icon: 'delete',

      onAction: async () => {
        try {
          await deleteSectorMutation.mutateAsync(
            sector.idSector
          )

          toast.success(
            'Sector eliminado correctamente.'
          )
        } catch (error) {
          toast.error(
            getErrorMessage(
              error,
              'No se pudo eliminar el sector.'
            )
          )

          throw error
        }
      },
    })
  }

  // =========================================
  // RENDERIZADO
  // =========================================

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg font-bold text-mesa-text">
            Sectores
          </h3>

          <p className="mt-1 text-sm text-mesa-muted">
            Administrá los sectores y organizá
            visualmente sus mesas.
          </p>
        </div>

        <DefaultButton
          type="button"
          variant="secondary"
          onClick={handleOpenCreateSector}
          disabled={isSectorSaving}
        >
          Nuevo sector
        </DefaultButton>
      </div>

      {sectorsLoading || distributionLoading ? (
        <p className="text-sm text-mesa-muted">
          Cargando sectores y distribución...
        </p>
      ) : sectorsError ? (
        <div className="space-y-3 rounded-xl border border-mesa-border p-5">
          <p className="text-sm text-red-400">
            No se pudieron cargar los sectores.
          </p>

          <DefaultButton
            type="button"
            variant="secondary"
            onClick={onRetrySectors}
          >
            Reintentar
          </DefaultButton>
        </div>
      ) : distributionError ? (
        <p className="text-sm text-red-400">
          No se pudo cargar la distribución seleccionada.
        </p>
      ) : (
        <>
          <div className="grid gap-4 xl:grid-cols-2">
            {sectorGroups.map((sector) => (
              <article
                key={sector.idSector}
                className="min-w-0 rounded-2xl border border-mesa-border bg-mesa-card p-4 sm:p-5"
              >
                <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4 className="font-display text-lg font-bold text-mesa-text">
                      {sector.nombre}
                    </h4>

                    <p className="mt-1 text-xs text-mesa-muted">
                      {sector.mesas.length} mesas
                      {' · '}
                      {sector.capacidad} personas
                    </p>
                  </div>

                  <div className="flex items-center gap-1">
                    <DashboardTableActionButton
                      title={`Editar sector ${sector.nombre}`}
                      onClick={() =>
                        handleOpenEditSector(sector)
                      }
                    >
                      <EditOutlinedIcon
                        sx={{ fontSize: 20 }}
                      />
                    </DashboardTableActionButton>

                    <DashboardTableActionButton
                      title={`Eliminar sector ${sector.nombre}`}
                      disabled={isSectorDeleting}
                      onClick={() =>
                        handleDeleteSector(sector)
                      }
                    >
                      <DeleteIcon
                        sx={{ fontSize: 20 }}
                      />
                    </DashboardTableActionButton>
                  </div>
                </div>

                <SectorTableCanvas
                  mesas={sector.mesas}
                  physicalTablesById={physicalTablesById}
                  onMoveTable={onMoveTable}
                  onEditTable={onEditTable}
                  disabled={editorDisabled}
                />
              </article>
            ))}
          </div>

          {sectorGroups.length === 0 && (
            <div className="rounded-xl border border-dashed border-mesa-border p-7 text-center">
              <p className="text-sm text-mesa-muted">
                Todavía no hay sectores registrados.
              </p>
            </div>
          )}

          {unknownSectorTables.length > 0 && (
            <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/5 p-5">
              <p className="font-semibold text-mesa-text">
                Mesas con sector no identificado
              </p>

              <p className="mt-2 text-sm text-mesa-muted">
                Hay {unknownSectorTables.length} mesas
                asociadas a sectores que no aparecen
                en el listado actual.
              </p>
            </div>
          )}
        </>
      )}

      {sectorDialogOpen && (
        <DashboardFormDialog
          open
          title={
            editingSector
              ? 'Editar sector'
              : 'Nuevo sector'
          }
          description={
            editingSector
              ? 'Modificá el nombre del sector.'
              : 'Creá un nuevo sector para organizar las mesas del establecimiento.'
          }
          onClose={handleCloseSectorDialog}
          onSubmit={handleSaveSector}
          isBusy={isSectorSaving}
          submitDisabled={!sectorName.trim()}
          submitLabel={
            editingSector
              ? 'Guardar cambios'
              : 'Crear sector'
          }
        >
          <TextField
            label="Nombre del sector"
            value={sectorName}
            onChange={(event) =>
              setSectorName(event.target.value)
            }
            placeholder="Ej: Salón principal"
            fullWidth
            required
            disabled={isSectorSaving}
            sx={textFieldStyles}
          />
        </DashboardFormDialog>
      )}
    </section>
  )
}

export default SectorsSection
