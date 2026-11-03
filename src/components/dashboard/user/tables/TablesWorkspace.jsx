
import { useMemo, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'

/* Components */
import Table from '../../../table/Table'
import { getTableColumns } from '../../../table/columns/tableColumns'
import DefaultButton from '../../../common/button/DefaultButton'
import DashboardFormDialog from '../../DashboardFormDialog'
import DashboardTabs from '../../DashboardTabs'
import SectorsSection from './SectorsSection'

/* Hooks */
import useCreateTableMutation from '../../../../hooks/mutations/useCreateTableMutation'
import useUpdateTableMutation from '../../../../hooks/mutations/useUpdateTableMutation'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../../styles/formStyles'

const TABLE_VIEWS = [
  { id: 'sectors', label: 'Plano' },
  { id: 'operational', label: 'Lista' },
]

const emptyTableForm = {
  codigo: '',
  capacidad: '',
  agrupable: false,
  idSector: '',
}

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback

const TablesWorkspace = ({
  idEstablecimiento,
  sectors = [],
  sectorsLoading = false,
  sectorsError = false,
  onRetrySectors,
  tables = [],
  tablesLoading = false,
  tablesError = false,
  onRetryTables,
  selectedConfiguration,
  activeConfiguration,
  distribution,
  distributionLoading = false,
  distributionError = false,
  activeDistribution,
  activeDistributionLoading = false,
  activeDistributionError = false,

  // Editor de distribución
  onMoveTable,
  editorDisabled = false,
}) => {
  // =========================================
  // ESTADOS
  // =========================================

  const [view, setView] = useState('sectors')

  const [tableDialogOpen, setTableDialogOpen] =
    useState(false)

  const [editingTable, setEditingTable] =
    useState(null)

  const [tableForm, setTableForm] = useState({
    ...emptyTableForm,
  })

  // =========================================
  // MUTACIONES
  // =========================================

  const createTableMutation =
    useCreateTableMutation(idEstablecimiento)

  const updateTableMutation =
    useUpdateTableMutation(idEstablecimiento)

  const isTableSaving =
    createTableMutation.isPending ||
    updateTableMutation.isPending

  // =========================================
  // DATOS DERIVADOS
  // =========================================

  const hasSectors = sectors.length > 0

  const canCreateTable =
    hasSectors &&
    !sectorsLoading &&
    !sectorsError &&
    !isTableSaving

  const isEditing = editingTable !== null

  const codigo = tableForm.codigo.trim()
  const capacidad = Number(tableForm.capacidad)
  const idSector = Number(tableForm.idSector)

  const isPhysicalDataValid =
    Boolean(codigo) &&
    codigo.length <= 20 &&
    tableForm.capacidad !== '' &&
    Number.isInteger(capacidad) &&
    capacidad > 0 &&
    typeof tableForm.agrupable === 'boolean'

  const isSectorValid =
    tableForm.idSector !== '' &&
    Number.isInteger(idSector) &&
    idSector > 0 &&
    sectors.some(
      (sector) =>
        Number(sector.idSector) === idSector
    )

  const isTableFormValid =
    isPhysicalDataValid &&
    (isEditing || isSectorValid)

  // =========================================
  // MESAS FÍSICAS POR ID
  // =========================================

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

  // =========================================
  // SECTORES POR ID
  // =========================================

  const sectorNameById = useMemo(
    () =>
      new Map(
        sectors.map((sector) => [
          Number(sector.idSector),
          sector.nombre,
        ])
      ),
    [sectors]
  )

  // =========================================
  // ESTADÍSTICAS
  // =========================================

  const totalCapacity = tables.reduce(
    (total, table) =>
      total + (Number(table.capacidad) || 0),
    0
  )

  const selectedDetails =
    distribution?.mesas ?? []

  const activeDetails =
    activeDistribution?.mesas ?? []

  const enabledTables = selectedDetails.filter(
    (detail) => detail.activa === true
  ).length

  // =========================================
  // FILAS PARA EL DATAGRID
  // SIEMPRE USA LA CONFIGURACIÓN ACTIVA
  // =========================================

  const operationalRows = activeDetails.map(
    (detail) => {
      const physicalTable =
        physicalTablesById.get(
          Number(detail.idMesa)
        )

      return {
        idMesa: detail.idMesa,

        codigo:
          physicalTable?.codigo ||
          detail.codigo ||
          `Mesa ${detail.idMesa}`,

        sector:
          sectorNameById.get(
            Number(detail.idSector)
          ) || 'Sin identificar',

        capacidad:
          physicalTable?.capacidad ?? null,

        agrupable:
          physicalTable?.agrupable ?? false,

        habilitada:
          detail.activa === true,

        physicalTable:
          physicalTable ?? null,
      }
    }
  )

  // =========================================
  // FORMULARIO DE MESAS
  // =========================================

  const resetTableForm = () => {
    setTableForm({ ...emptyTableForm })
    setEditingTable(null)
  }

  const handleOpenCreateTable = () => {
    if (!canCreateTable) return

    resetTableForm()
    setTableDialogOpen(true)
  }

  const handleOpenEditTable = (table) => {
    if (!table || isTableSaving) return

    setEditingTable(table)

    setTableForm({
      codigo: table.codigo ?? '',
      capacidad: String(
        table.capacidad ?? ''
      ),
      agrupable: Boolean(table.agrupable),
      idSector: '',
    })

    setTableDialogOpen(true)
  }

  const handleCloseTableDialog = () => {
    if (isTableSaving) return

    setTableDialogOpen(false)
    resetTableForm()
  }

  const handleSaveTable = async (event) => {
    event.preventDefault()

    if (
      !isTableFormValid ||
      isTableSaving
    ) {
      return
    }

    const tableData = {
      codigo,
      capacidad,
      agrupable: tableForm.agrupable,
    }

    try {
      if (isEditing) {
        await updateTableMutation.mutateAsync({
          idMesa: editingTable.idMesa,
          tableData,
        })

        toast.success(
          'Mesa modificada correctamente.'
        )
      } else {
        await createTableMutation.mutateAsync({
          ...tableData,
          idSector,
        })

        toast.success(
          'Mesa creada correctamente.'
        )
      }

      setTableDialogOpen(false)
      resetTableForm()
    } catch (error) {
      toast.error(
        getErrorMessage(
          error,
          isEditing
            ? 'No se pudo modificar la mesa.'
            : 'No se pudo crear la mesa.'
        )
      )
    }
  }

  // =========================================
  // COLUMNAS DATAGRID
  // =========================================

  const tableColumns = getTableColumns({
    onEditTable: handleOpenEditTable,
  })

  // =========================================
  // RENDERIZADO
  // =========================================

  return (
    <section className="mt-6 space-y-6">
      {/* ===================================== */}
      {/* RESUMEN                              */}
      {/* ===================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Sectores',
            value:
              sectorsLoading || sectorsError
                ? '—'
                : sectors.length,
            description:
              'Sectores registrados',
          },
          {
            label: 'Mesas físicas',
            value:
              tablesLoading || tablesError
                ? '—'
                : tables.length,
            description:
              'Mesas del establecimiento',
          },
          {
            label: 'Capacidad total',
            value:
              tablesLoading || tablesError
                ? '—'
                : totalCapacity,
            description:
              'Personas en mesas físicas',
          },
          {
            label: 'Mesas habilitadas',
            value:
              !selectedConfiguration ||
              distributionLoading ||
              distributionError ||
              !distribution
                ? '—'
                : enabledTables,
            description:
              'En la configuración seleccionada',
          },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-mesa-border bg-mesa-surface p-5"
          >
            <p className="text-sm text-mesa-muted">
              {item.label}
            </p>

            <p className="mt-3 font-display text-3xl font-bold text-mesa-text">
              {item.value}
            </p>

            <p className="mt-2 text-xs text-mesa-muted">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* ===================================== */}
      {/* ESPACIO PRINCIPAL                    */}
      {/* ===================================== */}

      <div className="rounded-3xl border border-mesa-border bg-mesa-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-xl font-bold text-mesa-text">
              Espacio de mesas
            </h2>

            <p className="mt-2 text-sm text-mesa-muted">
              Gestioná las mesas y consultá su
              distribución por sectores o en la
              lista operativa.
            </p>
          </div>

          <DefaultButton
            type="button"
            onClick={handleOpenCreateTable}
            disabled={!canCreateTable}
          >
            Nueva mesa
          </DefaultButton>
        </div>

        {/* ===================================== */}
        {/* PESTAÑAS REUTILIZABLES               */}
        {/* ===================================== */}

        <DashboardTabs
          tabs={TABLE_VIEWS}
          value={view}
          onChange={setView}
          ariaLabel="Vistas de mesas"
          className="mt-6"
        />

        {/* ===================================== */}
        {/* PLANO - CONFIGURACIÓN SELECCIONADA   */}
        {/* ===================================== */}

        {view === 'sectors' && (
          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm font-semibold text-mesa-text">
                {selectedConfiguration
                  ? `Distribución: ${selectedConfiguration.nombre}`
                  : 'Sin configuración seleccionada'}
              </p>

              <p className="mt-1 text-xs text-mesa-muted">
                Arrastrá las mesas para modificar
                su posición dentro de cada sector.
                Los cambios se guardan al pulsar
                Guardar cambios.
              </p>
            </div>

            {tablesError ? (
              <div className="space-y-3 rounded-xl border border-mesa-border p-5">
                <p className="text-sm text-red-400">
                  No se pudieron cargar
                  las mesas físicas.
                </p>

                <DefaultButton
                  type="button"
                  variant="secondary"
                  onClick={onRetryTables}
                >
                  Reintentar
                </DefaultButton>
              </div>
            ) : (
              <SectorsSection
                idEstablecimiento={
                  idEstablecimiento
                }
                sectors={sectors}
                sectorsLoading={sectorsLoading}
                sectorsError={sectorsError}
                onRetrySectors={
                  onRetrySectors
                }
                tables={tables}
                distribution={distribution}
                distributionLoading={
                  distributionLoading ||
                  tablesLoading
                }
                distributionError={
                  distributionError
                }
                onEditTable={
                  handleOpenEditTable
                }
                onMoveTable={
                  onMoveTable
                }
                editorDisabled={
                  editorDisabled
                }
              />
            )}
          </div>
        )}

        {/* ===================================== */}
        {/* LISTA - CONFIGURACIÓN ACTIVA        */}
        {/* ===================================== */}

        {view === 'operational' && (
          <div className="mt-6 space-y-4">
            <div>
              <h3 className="font-display text-xl font-bold text-mesa-text">
                Lista de mesas
              </h3>

              <p className="mt-1 text-sm text-mesa-muted">
                {activeConfiguration
                  ? `Configuración activa: ${activeConfiguration.nombre}`
                  : 'No hay configuración activa'}
              </p>

              <p className="mt-1 text-xs text-mesa-muted">
                Esta lista siempre corresponde
                a la configuración operativa
                del establecimiento.
              </p>
            </div>

            {!activeConfiguration ? (
              <div className="rounded-xl border border-dashed border-mesa-border p-6 text-center">
                <p className="text-sm text-mesa-muted">
                  No existe una configuración activa.
                </p>
              </div>
            ) : activeDistributionError ||
              tablesError ||
              sectorsError ? (
              <div className="space-y-3">
                <p className="text-sm text-red-400">
                  No se pudo cargar la lista operativa.
                </p>

                {tablesError && (
                  <DefaultButton
                    type="button"
                    variant="secondary"
                    onClick={onRetryTables}
                  >
                    Reintentar
                  </DefaultButton>
                )}
              </div>
            ) : (
              <Table
                rows={operationalRows}
                columns={tableColumns}
                getRowId={(row) =>
                  row.idMesa
                }
                loading={
                  activeDistributionLoading ||
                  tablesLoading ||
                  sectorsLoading
                }
                rowHeight={72}
                emptyMessage="No hay mesas en la configuración activa."
              />
            )}
          </div>
        )}

        {!hasSectors &&
          !sectorsLoading &&
          !sectorsError && (
            <p className="mt-5 text-sm text-mesa-muted">
              Para registrar mesas físicas,
              primero creá un sector.
            </p>
          )}
      </div>

      {/* ===================================== */}
      {/* FORMULARIO DE MESAS                  */}
      {/* ===================================== */}

      {tableDialogOpen && (
        <DashboardFormDialog
          open
          title={
            isEditing
              ? 'Editar mesa'
              : 'Nueva mesa'
          }
          description={
            isEditing
              ? 'Modificá las características físicas de la mesa.'
              : 'Registrá una mesa física del establecimiento.'
          }
          onClose={
            handleCloseTableDialog
          }
          onSubmit={
            handleSaveTable
          }
          isBusy={
            isTableSaving
          }
          submitDisabled={
            !isTableFormValid
          }
          submitLabel={
            isEditing
              ? 'Guardar cambios'
              : 'Crear mesa'
          }
        >
          <div className="flex flex-col gap-6">
            <TextField
              label="Código de mesa"
              value={tableForm.codigo}
              onChange={(event) =>
                setTableForm((prev) => ({
                  ...prev,
                  codigo: event.target.value,
                }))
              }
              placeholder="Ej: M01"
              fullWidth
              required
              disabled={isTableSaving}
              slotProps={{
                htmlInput: {
                  maxLength: 20,
                },
              }}
              sx={textFieldStyles}
            />

            <TextField
              label="Capacidad"
              type="number"
              value={tableForm.capacidad}
              onChange={(event) =>
                setTableForm((prev) => ({
                  ...prev,
                  capacidad: event.target.value,
                }))
              }
              slotProps={{
                htmlInput: {
                  min: 1,
                  step: 1,
                },
              }}
              fullWidth
              required
              disabled={isTableSaving}
              sx={textFieldStyles}
            />

            {!isEditing && (
              <TextField
                select
                label="Sector"
                value={tableForm.idSector}
                onChange={(event) =>
                  setTableForm((prev) => ({
                    ...prev,
                    idSector: event.target.value,
                  }))
                }
                fullWidth
                required
                disabled={isTableSaving}
                sx={textFieldStyles}
                slotProps={selectSlotProps}
              >
                {sectors.map((sector) => (
                  <MenuItem
                    key={sector.idSector}
                    value={sector.idSector}
                  >
                    {sector.nombre}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <FormControlLabel
              control={
                <Checkbox
                  checked={
                    tableForm.agrupable
                  }
                  onChange={(event) =>
                    setTableForm((prev) => ({
                      ...prev,
                      agrupable:
                        event.target.checked,
                    }))
                  }
                  disabled={isTableSaving}
                />
              }
              label="Permitir agrupar esta mesa con otras"
            />

            {isEditing && (
              <p className="text-xs leading-5 text-mesa-muted">
                El sector, la posición
                y la habilitación se
                administran desde la
                configuración de distribución.
              </p>
            )}
          </div>
        </DashboardFormDialog>
      )}
    </section>
  )
}

export default TablesWorkspace
