
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DefaultButton from '../../../../components/common/button/DefaultButton'
import TableConfigurationsSection from '../../../../components/dashboard/user/tables/TableConfigurationsSection'
import TablesWorkspace from '../../../../components/dashboard/user/tables/TablesWorkspace'

/* Context */
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

/* Hooks - Queries */
import useTableConfigurationsQuery from '../../../../hooks/queries/useTableConfigurationsQuery'
import useTableDistributionQuery from '../../../../hooks/queries/useTableDistributionQuery'
import useSectorsQuery from '../../../../hooks/queries/useSectorsQuery'
import useTablesQuery from '../../../../hooks/queries/useTablesQuery'

/* Hooks - Editor */
import useTableDistributionDraft from '../../../../hooks/useTableDistributionDraft'
import useUpdateTableDistributionMutation from '../../../../hooks/mutations/useUpdateTableDistributionMutation'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../../styles/formStyles'

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback

const Tables = () => {
  const { idEstablecimiento } = useParams()

  const { openActionDialog } =
    useContext(ActionDialogContext)

  const [selectedId, setSelectedId] = useState('')
  const [editingTableId, setEditingTableId] = useState('')

  // =========================================
  // CONSULTAS COMPARTIDAS
  // =========================================

  const {
    data: configurations = [],
    isLoading: configurationsLoading,
    isError: configurationsError,
    refetch: refetchConfigurations,
  } = useTableConfigurationsQuery(idEstablecimiento)

  const {
    data: sectors = [],
    isLoading: sectorsLoading,
    isError: sectorsError,
    refetch: refetchSectors,
  } = useSectorsQuery(idEstablecimiento)

  const {
    data: tables = [],
    isLoading: tablesLoading,
    isError: tablesError,
    refetch: refetchTables,
  } = useTablesQuery(idEstablecimiento)

  // =========================================
  // CONFIGURACIONES
  // =========================================

  const activeConfiguration = configurations.find(
    (configuration) => configuration.activa
  )

  const selectedConfiguration =
    configurations.find(
      (configuration) =>
        configuration.idConfiguracionMesa === Number(selectedId)
    ) ??
    activeConfiguration ??
    configurations[0]

  const selectedConfigurationId =
    selectedConfiguration?.idConfiguracionMesa

  const activeConfigurationId =
    activeConfiguration?.idConfiguracionMesa

  // =========================================
  // DISTRIBUCIONES
  // =========================================

  const {
    data: distribution,
    isLoading: distributionLoading,
    isError: distributionError,
    refetch: refetchDistribution,
  } = useTableDistributionQuery(
    idEstablecimiento,
    selectedConfigurationId
  )

  const {
    data: activeDistribution,
    isLoading: activeDistributionLoading,
    isError: activeDistributionError,
  } = useTableDistributionQuery(
    idEstablecimiento,
    activeConfigurationId
  )

  // =========================================
  // BORRADOR LOCAL
  // =========================================

  const {
    draft,
    isDirty,
    hasRemoteChanges,
    moveTable,
    discardChanges,
    markSaved,
  } = useTableDistributionDraft(
    distribution,
    selectedConfigurationId
  )

  const updateDistributionMutation =
    useUpdateTableDistributionMutation(
      idEstablecimiento,
      selectedConfigurationId
    )

  const isSaving = updateDistributionMutation.isPending

  // Esta representación utiliza las mesas del borrador,
  // conservando el resto de los datos del GET.
  const editedDistribution =
    distribution && draft
      ? {
          ...distribution,
          mesas: draft.mesas,
        }
      : distribution

  // =========================================
  // MESA SELECCIONADA PARA PROBAR POSICIONES
  // =========================================

  const editingTable =
    draft?.mesas.find(
      (mesa) => String(mesa.idMesa) === editingTableId
    ) ??
    draft?.mesas[0] ??
    null

  const physicalTablesById = new Map(
    tables.map((table) => [Number(table.idMesa), table])
  )

  const getTableLabel = (idMesa) =>
    physicalTablesById.get(Number(idMesa))?.codigo ??
    `Mesa ${idMesa}`

  const handleChangePosition = (axis, value) => {
    if (!editingTable || isSaving || hasRemoteChanges) return

    if (value === '') return

    const position = Number(value)

    if (
      !Number.isFinite(position) ||
      position < 0 ||
      position > 1
    ) {
      return
    }

    moveTable(
      editingTable.idMesa,
      axis === 'x'
        ? position
        : Number(editingTable.posicionX),
      axis === 'y'
        ? position
        : Number(editingTable.posicionY)
    )
  }

  // =========================================
  // GUARDAR DISTRIBUCIÓN
  // =========================================

  const handleSaveDistribution = async () => {
    if (!isDirty || !draft || isSaving) return

    if (hasRemoteChanges) {
      toast.error(
        'La distribución cambió en el servidor. Revisá los cambios antes de volver a guardar.'
      )
      return
    }

    if (
      draft.version == null ||
      !Array.isArray(draft.mesas) ||
      !Array.isArray(draft.grupos) ||
      !Array.isArray(draft.mozosSectores) ||
      !Array.isArray(draft.mozosMesas)
    ) {
      toast.error('La distribución está incompleta.')
      return
    }

    const validTables = draft.mesas.every((mesa) =>
      mesa.idMesa != null &&
      mesa.idSector != null &&
      Number.isFinite(mesa.posicionX) &&
      Number.isFinite(mesa.posicionY) &&
      mesa.posicionX >= 0 &&
      mesa.posicionX <= 1 &&
      mesa.posicionY >= 0 &&
      mesa.posicionY <= 1 &&
      typeof mesa.activa === 'boolean'
    )

    if (!validTables) {
      toast.error(
        'Hay mesas con datos o posiciones inválidas.'
      )
      return
    }

    const payload = structuredClone(draft)

    try {
      const savedConfiguration =
        await updateDistributionMutation.mutateAsync(payload)

      markSaved(payload, savedConfiguration.version)

      toast.success('Distribución guardada correctamente.')
    } catch (error) {
      toast.error(
        error?.response?.status === 409
          ? 'La versión de la distribución está desactualizada. No se guardaron los cambios.'
          : getErrorMessage(
              error,
              'No se pudo guardar la distribución.'
            )
      )
    }
  }

  // =========================================
  // DESCARTAR CAMBIOS
  // =========================================

  const handleDiscardChanges = () => {
    if (!isDirty || isSaving) return

    openActionDialog({
      title: 'Descartar cambios',
      description:
        '¿Querés descartar las modificaciones realizadas en esta distribución?',
      actionLabel: 'Descartar cambios',
      cancelLabel: 'Seguir editando',
      variant: 'danger',
      icon: 'warning',
      onAction: async () => {
        discardChanges()
      },
    })
  }

  // =========================================
  // CAMBIAR CONFIGURACIÓN
  // =========================================

  const handleSelectConfiguration = (nextId) => {
    const nextConfigurationId = String(nextId)

    if (isSaving) return

    if (
      nextConfigurationId ===
      String(selectedConfigurationId ?? '')
    ) {
      return
    }

    if (!isDirty) {
      setSelectedId(nextConfigurationId)
      setEditingTableId('')
      return
    }

    openActionDialog({
      title: 'Cambios sin guardar',
      description:
        'Tenés modificaciones pendientes en la distribución actual. Si cambiás de configuración, se perderán.',
      actionLabel: 'Salir sin guardar',
      cancelLabel: 'Seguir editando',
      variant: 'danger',
      icon: 'warning',
      onAction: async () => {
        discardChanges()
        setSelectedId(nextConfigurationId)
        setEditingTableId('')
      },
    })
  }

  // Advertencia nativa al cerrar o recargar la pestaña.
  useEffect(() => {
    if (!isDirty && !isSaving) return

    const handleBeforeUnload = (event) => {
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener(
      'beforeunload',
      handleBeforeUnload
    )

    return () => {
      window.removeEventListener(
        'beforeunload',
        handleBeforeUnload
      )
    }
  }, [isDirty, isSaving])

  // =========================================
  // RENDERIZADO
  // =========================================

  return (
    <section className="min-w-0">
      {/* Configuraciones */}
      <TableConfigurationsSection
        idEstablecimiento={idEstablecimiento}
        configurations={configurations}
        selectedConfiguration={selectedConfiguration}
        activeConfiguration={activeConfiguration}
        onSelectConfiguration={handleSelectConfiguration}
        isLoading={configurationsLoading}
        isError={configurationsError}
        onRetry={refetchConfigurations}
      />

      {/* Barra de edición */}
      {selectedConfiguration && (
        <div className="mt-6 rounded-2xl border border-mesa-border bg-mesa-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-semibold text-mesa-text">
                Editor de distribución
              </p>

              <p className="mt-1 text-sm text-mesa-muted">
                {selectedConfiguration.nombre}
                {' · '}
                Versión {draft?.version ?? '—'}
              </p>

              {hasRemoteChanges ? (
                <p className="mt-2 text-sm text-red-400">
                  La versión del servidor cambió.
                  No se puede guardar este borrador sin
                  revisar la distribución.
                </p>
              ) : isDirty ? (
                <p className="mt-2 text-sm text-yellow-400">
                  Tenés cambios sin guardar.
                </p>
              ) : (
                <p className="mt-2 text-sm text-mesa-muted">
                  No hay cambios pendientes.
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <DefaultButton
                type="button"
                variant="secondary"
                onClick={handleDiscardChanges}
                disabled={!isDirty || isSaving}
              >
                Descartar
              </DefaultButton>

              <DefaultButton
                type="button"
                onClick={handleSaveDistribution}
                disabled={
                  !isDirty ||
                  isSaving ||
                  hasRemoteChanges ||
                  distributionLoading
                }
              >
                {isSaving
                  ? 'Guardando...'
                  : 'Guardar cambios'}
              </DefaultButton>
            </div>
          </div>

          {/* Control temporal para verificar el guardado */}
          {draft?.mesas?.length > 0 && (
            <div className="mt-5 border-t border-mesa-border pt-5">
              <p className="mb-4 text-sm text-mesa-muted">
                Ajuste de posiciones (temporal).
                Las coordenadas van de 0 a 1.
              </p>

              <div className="grid gap-4 sm:grid-cols-3">
                <TextField
                  select
                  label="Mesa"
                  value={editingTable?.idMesa ?? ''}
                  onChange={(event) =>
                    setEditingTableId(
                      String(event.target.value)
                    )
                  }
                  disabled={isSaving}
                  fullWidth
                  sx={textFieldStyles}
                  slotProps={selectSlotProps}
                >
                  {draft.mesas.map((mesa) => (
                    <MenuItem
                      key={mesa.idMesa}
                      value={mesa.idMesa}
                    >
                      {getTableLabel(mesa.idMesa)}
                    </MenuItem>
                  ))}
                </TextField>

                <TextField
                  label="Posición X"
                  type="number"
                  value={editingTable?.posicionX ?? ''}
                  onChange={(event) =>
                    handleChangePosition(
                      'x',
                      event.target.value
                    )
                  }
                  disabled={isSaving || hasRemoteChanges}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 1,
                      step: 0.05,
                    },
                  }}
                  fullWidth
                  sx={textFieldStyles}
                />

                <TextField
                  label="Posición Y"
                  type="number"
                  value={editingTable?.posicionY ?? ''}
                  onChange={(event) =>
                    handleChangePosition(
                      'y',
                      event.target.value
                    )
                  }
                  disabled={isSaving || hasRemoteChanges}
                  slotProps={{
                    htmlInput: {
                      min: 0,
                      max: 1,
                      step: 0.05,
                    },
                  }}
                  fullWidth
                  sx={textFieldStyles}
                />
              </div>
            </div>
          )}

          {hasRemoteChanges && (
            <div className="mt-4">
              <DefaultButton
                type="button"
                variant="secondary"
                onClick={async () => {
                  discardChanges()
                  await refetchDistribution()
                }}
                disabled={isSaving}
              >
                Descartar y cargar versión actual
              </DefaultButton>
            </div>
          )}
        </div>
      )}

      {/* Plano y lista */}
      <TablesWorkspace
        idEstablecimiento={idEstablecimiento}
        sectors={sectors}
        sectorsLoading={sectorsLoading}
        sectorsError={sectorsError}
        onRetrySectors={refetchSectors}
        tables={tables}
        tablesLoading={tablesLoading}
        tablesError={tablesError}
        onRetryTables={refetchTables}
        selectedConfiguration={selectedConfiguration}
        activeConfiguration={activeConfiguration}
        distribution={editedDistribution}
        distributionLoading={distributionLoading}
        distributionError={distributionError}
        activeDistribution={activeDistribution}
        activeDistributionLoading={activeDistributionLoading}
        activeDistributionError={activeDistributionError}
        onMoveTable={moveTable}
        editorDisabled={
          isSaving ||
          hasRemoteChanges ||
          distributionLoading ||
          distributionError ||
          !draft
        }
        />
    </section>
  )
}

export default Tables
