
import { useContext, useMemo, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
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

// =========================================
// UTILIDADES
// =========================================

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback

// Mantener la misma identidad visual
// de los mozos en todo el módulo.
const WAITER_COLORS = [
  '#E87722',
  '#0D9488',
  '#7C3AED',
  '#2563EB',
  '#DB2777',
  '#65A30D',
  '#D97706',
]

const getWaiterColor = (idUsuario) => {
  const id = Number(idUsuario)

  return WAITER_COLORS[
    Number.isFinite(id)
      ? Math.abs(id) % WAITER_COLORS.length
      : 0
  ]
}

const getWaiterInitial = (waiter) =>
  String(
    waiter?.nombre ||
    waiter?.apellido ||
    waiter?.email ||
    '?'
  )
    .charAt(0)
    .toUpperCase()

const getWaiterLabel = (waiter) =>
  [waiter?.nombre, waiter?.apellido]
    .filter(Boolean)
    .join(' ') ||
  waiter?.email ||
  `Usuario ${waiter?.idUsuario ?? 'desconocido'}`

const emptyGroupForm = {
  nombre: '',
  idsMesas: [],
  idUsuario: '',
}

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

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
  onMoveTableToSector,
  onMoveGroupToSector,
  editorDisabled = false,

  isDirty = false,
  hasRemoteChanges = false,

  // Acciones del editor de distribución
  isDistributionSaving = false,
  onSaveDistribution,
  onCancelDistribution,
  onReloadDistribution,

  // Apertura de sector desde Tables.jsx
  createSectorOpen = false,
  onCloseCreateSector,

  // Mozos del establecimiento
  waiters = [],
  waitersLoading = false,
  waitersError = false,
  onRetryWaiters,

  // Asignaciones del borrador
  onSetSectorWaiter,

  // Agrupaciones del borrador
  onSaveGroup,

  // Solicitud para modificar integrantes
  // desde el formulario "Editar mesa".
  groupEditRequest = null,
  groupingRequested = false,
  onStopGrouping,
}) => {
  const { openActionDialog } =
    useContext(ActionDialogContext)

  // =========================================
  // ESTADOS DE SECTORES
  // =========================================

  const [sectorDialogOpen, setSectorDialogOpen] =
    useState(false)

  const [sectorName, setSectorName] =
    useState('')

  const [editingSector, setEditingSector] =
    useState(null)

  const [hoveredSectorId, setHoveredSectorId] =
    useState(null)

  // =========================================
  // ESTADOS DE AGRUPACIÓN
  // =========================================

  // La selección puede comenzar desde:
  //
  // - "Agrupar mesas" general (primer clic determina sector).
  // - "Modificar integrantes" de Editar mesa
  //   (external).
  //
  // Guardamos juntos la sesión y su formulario
  // para evitar estados desincronizados.

  const [selectionState, setSelectionState] =
    useState(null)

  const [groupDialogOpen, setGroupDialogOpen] =
    useState(false)

  // Cuando cancelamos una solicitud externa,
  // recordamos su sequence para impedir que
  // se abra nuevamente durante otro render.
  const [
    dismissedRequestSequence,
    setDismissedRequestSequence,
  ] = useState(null)

  // =========================================
  // MUTACIONES DE SECTORES
  // =========================================

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
  // DATOS DE DISTRIBUCIÓN
  // =========================================

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

  // =========================================
  // GRUPOS DEL BORRADOR
  // =========================================

  // draftIndex identifica el grupo en React.
  // No es el idGrupo del backend.

  const allGroups = (
    distribution?.grupos ?? []
  ).map((group, index) => ({
    ...group,
    draftIndex: index,
  }))

  // Identificar si una mesa ya está agrupada.
  const groupTableIds = new Map()

  allGroups.forEach((group) => {
    (group.idsMesas ?? []).forEach((idMesa) => {
      groupTableIds.set(
        Number(idMesa),
        group.draftIndex
      )
    })
  })

  // =========================================
  // SOLICITUD EXTERNA DE MODIFICACIÓN
  // =========================================

  // En lugar de usar useEffect para copiar
  // groupEditRequest a varios estados,
  // derivamos la selección directamente.
  //
  // Solo almacenamos cambios cuando el usuario
  // interactúa realmente con el plano.

  const requestSequence =
    groupEditRequest?.sequence ?? null

  const requestedGroupIndex =
    groupEditRequest?.groupIndex == null
      ? null
      : Number(groupEditRequest.groupIndex)

  const requestedGroup =
    requestedGroupIndex === null
      ? null
      : allGroups.find(
          (group) =>
            group.draftIndex ===
            requestedGroupIndex
        )

  const requestedSectorExists =
    requestedGroup != null &&
    sectors.some(
      (sector) =>
        Number(sector.idSector) ===
        Number(requestedGroup.idSector)
    )

  const externalRequestActive =
    requestSequence !== null &&
    requestSequence !== dismissedRequestSequence &&
    requestedGroup != null &&
    requestedSectorExists &&
    !editorDisabled

  const externalSelection =
    externalRequestActive
      ? {
          source: 'external',
          sequence: requestSequence,
          idSector: Number(
            requestedGroup.idSector
          ),
          editingIndex:
            requestedGroup.draftIndex,

          form: {
            nombre:
              requestedGroup.nombre ?? '',

            idsMesas: (
              requestedGroup.idsMesas ?? []
            ).map(Number),

            idUsuario:
              requestedGroup.idUsuario ?? '',
          },
        }
      : null

  // =========================================
  // SESIÓN ACTIVA
  // =========================================

  // La sesión externa puede existir sin
  // setState ni useEffect.
  //
  // Si el usuario modifica sus integrantes,
  // selectionState conserva la selección nueva.

  const groupingSelection = (() => {
    if (
      externalSelection &&
      selectionState?.source === 'external' &&
      selectionState.sequence === requestSequence
    ) {
      return selectionState
    }

    if (externalSelection) return externalSelection

    if (groupingRequested) {
      return selectionState?.source === 'global'
        ? selectionState
        : {
            source: 'global',
            sequence: null,
            idSector: null,
            editingIndex: null,
            form: { ...emptyGroupForm, idsMesas: [] },
          }
    }

    return null
  })()

  const groupingSession = groupingSelection
    ? {
        idSector:
          groupingSelection.idSector,

        editingIndex:
          groupingSelection.editingIndex,
      }
    : null

  const groupForm =
    groupingSelection?.form ??
    emptyGroupForm

  // =========================================
  // MODIFICAR FORMULARIO DE AGRUPACIÓN
  // =========================================

  // Se ejecuta desde eventos reales:
  // seleccionar mesa, escribir nombre, etc.
  //
  // No se llama durante el render ni
  // dentro de un useEffect.

  const updateGroupForm = (updater) => {
    if (!groupingSelection) return

    setSelectionState({
      ...groupingSelection,

      form:
        typeof updater === 'function'
          ? updater(groupForm)
          : updater,
    })
  }

  // =========================================
  // MOZOS DE SECTORES
  // =========================================

  const sectorWaitersById = useMemo(
    () =>
      new Map(
        (distribution?.mozosSectores ?? []).map(
          (assignment) => [
            Number(assignment.idSector),
            assignment.idUsuario,
          ]
        )
      ),
    [distribution?.mozosSectores]
  )

  const handleSetSectorWaiter = (
    idSector,
    idUsuario
  ) => {
    if (
      editorDisabled ||
      groupingSession ||
      waitersLoading ||
      waitersError ||
      !onSetSectorWaiter
    ) {
      return
    }

    onSetSectorWaiter(
      idSector,
      idUsuario === ''
        ? null
        : idUsuario
    )
  }

  // =========================================
  // RESPONSABLE EFECTIVO DE CADA MESA
  // =========================================

  // Prioridades:
  //
  // 1. Mozo del grupo existente.
  // 2. Mozo individual si no está agrupada.
  // 3. Mozo del sector.
  // 4. Sin mozo.

  const getEffectiveWaiterId = (detail) => {
    const idMesa = Number(detail.idMesa)

    const group = allGroups.find(
      (item) =>
        (item.idsMesas ?? []).some(
          (id) => Number(id) === idMesa
        )
    )

    const sectorWaiterId =
      sectorWaitersById.get(
        Number(detail.idSector)
      )

    if (group) {
      return (
        group.idUsuario ??
        sectorWaiterId ??
        null
      )
    }

    const individual = (
      distribution?.mozosMesas ?? []
    ).find(
      (assignment) =>
        Number(assignment.idMesa) === idMesa
    )

    return (
      individual?.idUsuario ??
      sectorWaiterId ??
      null
    )
  }

  // =========================================
  // ELEGIBILIDAD PARA AGRUPAR
  // =========================================

  const canSelectForGrouping = (
    detail,
    editingIndex = null
  ) => {
    const physical = physicalTablesById.get(
      Number(detail.idMesa)
    )

    const ownerIndex = groupTableIds.get(
      Number(detail.idMesa)
    )

    return (
      physical?.agrupable === true &&
      physical?.activa !== false &&
      detail.activa === true &&
      detail.activaGlobal !== false &&
      (
        ownerIndex == null ||
        ownerIndex === editingIndex
      )
    )
  }

  // =========================================
  // SECTOR ACTUAL DE AGRUPACIÓN
  // =========================================

  const groupingSector = groupingSession?.idSector != null
    ? sectorGroups.find(
        (sector) =>
          Number(sector.idSector) ===
          Number(groupingSession.idSector)
      )
    : null

  // =========================================
  // MOZO COMÚN DE LA SELECCIÓN
  // =========================================

  // La primera mesa seleccionada define
  // el responsable compatible con las demás.

  const activeSelectionWaiterId = (() => {
    if (!groupingSession) {
      return undefined
    }

    const firstId = groupForm.idsMesas[0]

    if (firstId == null) {
      return undefined
    }

    const detail = groupingSector?.mesas.find(
      (mesa) =>
        Number(mesa.idMesa) ===
        Number(firstId)
    )

    return detail
      ? getEffectiveWaiterId(detail)
      : undefined
  })()

  const canSelectInSession = (detail) => {
    if (!groupingSession) return false

    if (
      groupingSession.idSector != null &&
      Number(detail.idSector) !== Number(groupingSession.idSector)
    ) {
      return false
    }

    if (
      !canSelectForGrouping(
        detail,
        groupingSession.editingIndex
      )
    ) {
      return false
    }

    // Antes de elegir la primera mesa, solo admitir
    // sectores donde exista al menos una pareja compatible.
    if (groupingSession.idSector == null) {
      const candidateSector = sectorGroups.find(
        (sector) => Number(sector.idSector) === Number(detail.idSector)
      )
      if (!candidateSector || !sectorHasCompatibleTables(candidateSector)) {
        return false
      }
    }

    if (
      activeSelectionWaiterId === undefined
    ) {
      return true
    }

    return (
      String(
        getEffectiveWaiterId(detail) ?? ''
      ) ===
      String(
        activeSelectionWaiterId ?? ''
      )
    )
  }

  // =========================================
  // VERIFICAR SI UN SECTOR ADMITE GRUPOS
  // =========================================

  // Necesitamos al menos dos mesas disponibles
  // con el mismo responsable efectivo.

  const sectorHasCompatibleTables = (sector) => {
    if (editorDisabled || !onSaveGroup) return false

    const counts = new Map()

    for (const detail of sector.mesas) {
      if (!canSelectForGrouping(detail)) {
        continue
      }

      const idUsuario =
        getEffectiveWaiterId(detail)

      const key = String(idUsuario ?? '')

      const count =
        (counts.get(key) ?? 0) + 1

      if (count >= 2) {
        return true
      }

      counts.set(key, count)
    }

    return false
  }

  // =========================================
  // CANCELAR MODO AGRUPACIÓN
  // =========================================

  const cancelGrouping = () => {
    // Si esta sesión comenzó desde Editar mesa,
    // evitamos que la misma solicitud vuelva
    // a abrirse luego de cancelar o guardar.
    if (
      groupingSelection?.source === 'external'
    ) {
      setDismissedRequestSequence(
        groupingSelection.sequence
      )
    }

    setSelectionState(null)
    setGroupDialogOpen(false)
    if (groupingSelection?.source === 'global') {
      onStopGrouping?.()
    }
  }

  // =========================================
  // SELECCIONAR O DESELECCIONAR MESA
  // =========================================

  const toggleGroupTable = (idMesa) => {
    if (
      !groupingSession ||
      editorDisabled
    ) {
      return
    }

    const mesaId = Number(idMesa)

    const sourceSector = groupingSession.idSector == null
      ? sectorGroups.find((sector) =>
          sector.mesas.some((mesa) => Number(mesa.idMesa) === mesaId)
        )
      : groupingSector

    const detail = sourceSector?.mesas.find(
      (mesa) => Number(mesa.idMesa) === mesaId
    )

    if (!detail || !canSelectInSession(detail)) return

    // Al elegir la primera mesa, fijar automáticamente su sector.
    if (groupingSession.idSector == null) {
      setSelectionState({
        ...groupingSelection,
        idSector: Number(detail.idSector),
        form: { ...groupForm, idsMesas: [mesaId] },
      })
      return
    }

    updateGroupForm((previous) => ({
      ...previous,

      idsMesas: previous.idsMesas.includes(
        mesaId
      )
        ? previous.idsMesas.filter(
            (id) => id !== mesaId
          )
        : [
            ...previous.idsMesas,
            mesaId,
          ],
    }))
  }

  // =========================================
  // CONFIRMAR CREACIÓN O CAMBIO DE INTEGRANTES
  // =========================================

  const handleSaveGroup = (event) => {
    event.preventDefault()

    if (
      !groupingSession ||
      !groupDialogOpen ||
      editorDisabled ||
      !onSaveGroup
    ) {
      return
    }

    const groupIndex =
      groupingSession.editingIndex

    // Al modificar integrantes se conserva
    // el nombre más reciente del borrador.
    const existingGroup =
      groupIndex === null
        ? null
        : allGroups.find(
            (group) =>
              group.draftIndex === groupIndex
          )

    const nombre = existingGroup
      ? existingGroup.nombre
      : groupForm.nombre.trim()

    const saved = onSaveGroup(
      {
        nombre,
        idSector:
          groupingSession.idSector,

        idsMesas:
          groupForm.idsMesas,

        // El responsable se determina
        // por las mesas seleccionadas.
        idUsuario:
          activeSelectionWaiterId ?? null,
      },

      groupIndex
    )

    if (saved) {
      cancelGrouping()
    }
  }

  // =========================================
  // FORMULARIO DE SECTORES
  // =========================================

  const resetSectorForm = () => {
    setEditingSector(null)
    setSectorName('')
  }

  const handleOpenEditSector = (sector) => {
    if (
      groupingSession ||
      isSectorSaving
    ) {
      return
    }

    setEditingSector(sector)
    setSectorName(sector.nombre)
    setSectorDialogOpen(true)
  }

  const handleCloseSectorDialog = () => {
    if (isSectorSaving) {
      return
    }

    setSectorDialogOpen(false)
    onCloseCreateSector?.()
    resetSectorForm()
  }

  const handleSaveSector = async (event) => {
    event.preventDefault()

    const nombre = sectorName.trim()

    if (
      !nombre ||
      isSectorSaving
    ) {
      return
    }

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
        await createSectorMutation.mutateAsync(
          nombre
        )

        toast.success(
          'Sector creado correctamente.'
        )
      }

      setSectorDialogOpen(false)
      onCloseCreateSector?.()
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

  // =========================================
  // ELIMINAR SECTOR
  // =========================================

  const handleDeleteSector = (sector) => {
    if (
      isSectorDeleting ||
      groupingSession
    ) {
      return
    }

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
  // MESAS CON SECTOR DESCONOCIDO
  // =========================================

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
  // RENDERIZADO
  // =========================================

  return (
    <section className="space-y-5">

      {/* ===================================== */}
      {/* CABECERA DE SECTORES                  */}
      {/* ===================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>
          <h3 className="font-display text-lg font-bold text-mesa-text">
            Sectores
          </h3>

          {hasRemoteChanges ? (
            <p className="mt-1 text-xs text-red-400">
              La distribución cambió en el servidor.
            </p>
          ) : groupingSession ? (
            <p className="mt-1 text-xs font-medium text-blue-400">
              Seleccioná las mesas que integran el grupo.
            </p>
          ) : isDirty ? (
            <p className="mt-1 text-xs font-medium text-yellow-400">
              Tenés cambios sin guardar en el plano.
            </p>
          ) : (
            <p className="mt-1 text-xs text-mesa-muted">
              Tocá una mesa para editarla o arrastrala para moverla.
            </p>
          )}
        </div>

        {/* Acciones del editor de distribución */}

        <div className="flex flex-wrap items-center gap-2">

          {groupingSession?.idSector == null && groupingSession && (
            <DefaultButton type="button" variant="secondary" onClick={cancelGrouping}>
              Cancelar selección
            </DefaultButton>
          )}

          {hasRemoteChanges && (
            <DefaultButton
              type="button"
              variant="secondary"
              onClick={onReloadDistribution}
              disabled={isDistributionSaving}
            >
              Recargar
            </DefaultButton>
          )}

          <DefaultButton
            type="button"
            variant="secondary"
            onClick={onCancelDistribution}
            disabled={
              !isDirty ||
              isDistributionSaving ||
              Boolean(groupingSession)
            }
          >
            Cancelar
          </DefaultButton>

          <DefaultButton
            type="button"
            onClick={onSaveDistribution}
            disabled={
              !isDirty ||
              Boolean(groupingSession) ||
              isDistributionSaving ||
              hasRemoteChanges ||
              distributionLoading ||
              distributionError
            }
          >
            {isDistributionSaving
              ? 'Guardando...'
              : 'Guardar cambios'}
          </DefaultButton>
        </div>
      </div>

      {/* ===================================== */}
      {/* CARGA Y ERRORES                       */}
      {/* ===================================== */}

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
          {/* ===================================== */}
          {/* PLANOS POR SECTOR                    */}
          {/* ===================================== */}

          <div className="grid gap-4 xl:grid-cols-2">

            {sectorGroups.map((sector) => (
              <article
                key={sector.idSector}
                className="min-w-0 rounded-2xl border border-mesa-border bg-mesa-card p-4 sm:p-5"
              >

                {/* ================================= */}
                {/* CABECERA DEL SECTOR               */}
                {/* ================================= */}

                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">

                  <div className="min-w-0">
                    <h4 className="font-display text-lg font-bold text-mesa-text">
                      {sector.nombre}
                    </h4>

                    <p className="mt-1 text-xs text-mesa-muted">
                      {sector.mesas.length} mesas
                      {' · '}
                      {sector.capacidad} personas
                    </p>
                  </div>

                  {/* ================================= */}
                  {/* MOZO Y ACCIONES DEL SECTOR        */}
                  {/* ================================= */}

                  <div className="flex items-center gap-2">

                    <Select
                      size="small"
                      value={String(
                        sectorWaitersById.get(
                          Number(sector.idSector)
                        ) ?? ''
                      )}
                      onChange={(event) =>
                        handleSetSectorWaiter(
                          sector.idSector,
                          event.target.value
                        )
                      }
                      disabled={
                        editorDisabled ||
                        Boolean(groupingSession) ||
                        waitersLoading ||
                        waitersError ||
                        !onSetSectorWaiter
                      }
                      displayEmpty
                      inputProps={{
                        'aria-label':
                          `Mozo del sector ${sector.nombre}`,
                      }}
                      renderValue={(value) => {
                        const waiter = waiters.find(
                          (user) =>
                            String(user.idUsuario) ===
                            String(value)
                        )

                        return (
                          <span className="flex min-w-0 items-center gap-2">

                            <span
                              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                value
                                  ? 'text-white'
                                  : 'bg-mesa-border text-mesa-muted'
                              }`}
                              style={
                                value
                                  ? {
                                      backgroundColor:
                                        getWaiterColor(value),
                                    }
                                  : undefined
                              }
                            >
                              {value
                                ? getWaiterInitial(waiter)
                                : '—'}
                            </span>

                            <span className="truncate text-xs font-semibold text-mesa-text">
                              {value
                                ? waiter
                                  ? getWaiterLabel(waiter)
                                  : `Mozo ${value}`
                                : 'Sin mozo'}
                            </span>
                          </span>
                        )
                      }}
                      sx={{
                        width: 190,
                        maxWidth: '45vw',
                        height: 38,
                        borderRadius: '12px',
                        color: 'inherit',

                        '& .MuiSelect-select': {
                          display: 'flex',
                          alignItems: 'center',
                          padding: '6px 30px 6px 8px !important',
                          minHeight: 'unset !important',
                        },

                        '&.Mui-disabled': {
                          color: 'inherit',
                          WebkitTextFillColor: 'inherit',
                        },

                        '& .MuiSelect-select.Mui-disabled': {
                          color: 'inherit',
                          WebkitTextFillColor: 'inherit',
                          opacity: 1,
                        },

                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor:
                            'rgba(148,163,184,0.2)',
                        },

                        '& .MuiSelect-icon': {
                          color: '#94A3B8',
                        },
                      }}
                    >
                      <MenuItem value="">
                        Sin mozo
                      </MenuItem>

                      {/* Mantener visibles asignaciones
                          cuyo mozo ya no esté disponible. */}

                      {(() => {
                        const assignedId =
                          sectorWaitersById.get(
                            Number(sector.idSector)
                          )

                        const unavailable =
                          assignedId != null &&
                          !waiters.some(
                            (waiter) =>
                              Number(waiter.idUsuario) ===
                              Number(assignedId)
                          )

                        return unavailable ? (
                          <MenuItem
                            value={String(assignedId)}
                            disabled
                          >
                            Mozo anterior no disponible
                          </MenuItem>
                        ) : null
                      })()}

                      {waiters.map((waiter) => (
                        <MenuItem
                          key={waiter.idUsuario}
                          value={String(waiter.idUsuario)}
                        >
                          <span className="flex items-center gap-2">
                            <span
                              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                              style={{
                                backgroundColor:
                                  getWaiterColor(
                                    waiter.idUsuario
                                  ),
                              }}
                            >
                              {getWaiterInitial(waiter)}
                            </span>

                            {getWaiterLabel(waiter)}
                          </span>
                        </MenuItem>
                      ))}
                    </Select>

                    <DashboardTableActionButton
                      title={`Editar sector ${sector.nombre}`}
                      disabled={
                        Boolean(groupingSession) ||
                        isSectorSaving
                      }
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
                      disabled={
                        isSectorDeleting ||
                        Boolean(groupingSession)
                      }
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

                {/* ===================================== */}
                {/* AGRUPACIONES DEL SECTOR               */}
                {/* ===================================== */}

                {/* No mostramos un listado adicional.
                    Las agrupaciones ya se representan
                    directamente dentro del plano. */}

                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                  <span className="text-xs font-semibold text-mesa-muted">
                    Agrupaciones ({
                      allGroups.filter(
                        (group) =>
                          Number(group.idSector) ===
                          Number(sector.idSector)
                      ).length
                    })
                  </span>

                  {groupingSession?.idSector ===
                    Number(sector.idSector) ? (
                    <div className="flex flex-wrap items-center gap-2">

                      <DefaultButton
                        type="button"
                        variant="secondary"
                        onClick={cancelGrouping}
                      >
                        Cancelar selección
                      </DefaultButton>

                      <DefaultButton
                        type="button"
                        onClick={() =>
                          setGroupDialogOpen(true)
                        }
                        disabled={
                          editorDisabled ||
                          groupForm.idsMesas.length < 2
                        }
                      >
                        {groupingSession.editingIndex === null
                          ? 'Crear grupo'
                          : 'Confirmar integrantes'}
                        {' '}
                        ({groupForm.idsMesas.length})
                      </DefaultButton>

                    </div>
                  ) : null}
                </div>

                {/* ===================================== */}
                {/* PLANO DEL SECTOR                     */}
                {/* ===================================== */}

                <SectorTableCanvas
                  idSector={sector.idSector}
                  mesas={sector.mesas}
                  physicalTablesById={physicalTablesById}
                  onMoveTable={onMoveTable}
                  onMoveTableToSector={onMoveTableToSector}
                  onMoveGroupToSector={onMoveGroupToSector}
                  onEditTable={onEditTable}
                  onHoverSector={setHoveredSectorId}
                  hoveredSectorId={hoveredSectorId}

                  disabled={
                    editorDisabled ||
                    (
                      Boolean(groupingSession) &&
                      groupingSession.idSector != null &&
                      groupingSession.idSector !==
                        Number(sector.idSector)
                    )
                  }

                  waiters={waiters}

                  sectorWaiterId={
                    sectorWaitersById.get(
                      Number(sector.idSector)
                    ) ?? null
                  }

                  tableWaiters={
                    distribution?.mozosMesas ?? []
                  }

                  // Los grupos se dibujan
                  // directamente en el canvas.
                  groups={allGroups}

                  editingGroupIndex={
                    groupingSession?.idSector ===
                    Number(sector.idSector)
                      ? groupingSession.editingIndex
                      : null
                  }

                  groupingMode={
                    Boolean(groupingSession) &&
                    (
                      groupingSession.idSector == null ||
                      groupingSession.idSector === Number(sector.idSector)
                    )
                  }

                  selectedGroupTableIds={
                    groupingSession?.idSector ===
                    Number(sector.idSector)
                      ? groupForm.idsMesas
                      : []
                  }

                  selectableGroupTableIds={
                    groupingSession &&
                    (
                      groupingSession.idSector == null ||
                      groupingSession.idSector === Number(sector.idSector)
                    )
                      ? sector.mesas
                          .filter(canSelectInSession)
                          .map((detail) => Number(detail.idMesa))
                      : []
                  }

                  onToggleGroupTable={
                    toggleGroupTable
                  }
                />

              </article>
            ))}
          </div>

          {/* ===================================== */}
          {/* ESTADOS VACÍOS                       */}
          {/* ===================================== */}

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

      {/* ===================================== */}
      {/* CONFIRMACIÓN DE AGRUPACIONES          */}
      {/* ===================================== */}

      {groupingSession && groupDialogOpen && (
        <DashboardFormDialog
          open
          title={
            groupingSession.editingIndex === null
              ? 'Crear agrupación'
              : 'Confirmar integrantes'
          }
          description={
            groupingSession.editingIndex === null
              ? 'Ingresá un nombre para las mesas seleccionadas.'
              : 'Confirmá los integrantes de la agrupación.'
          }
          onClose={() =>
            setGroupDialogOpen(false)
          }
          onSubmit={handleSaveGroup}
          submitDisabled={
            editorDisabled ||
            groupForm.idsMesas.length < 2 ||
            !groupingSector ||
            (
              groupingSession.editingIndex === null &&
              (
                !groupForm.nombre.trim() ||
                groupForm.nombre.trim().length > 100
              )
            ) ||
            groupForm.idsMesas.some(
              (idMesa) => {
                const detail =
                  groupingSector.mesas.find(
                    (item) =>
                      Number(item.idMesa) ===
                      Number(idMesa)
                  )

                return (
                  !detail ||
                  !canSelectInSession(detail)
                )
              }
            )
          }
          submitLabel={
            groupingSession.editingIndex === null
              ? 'Crear grupo'
              : 'Aplicar integrantes'
          }
        >
          <div className="flex flex-col gap-4">

            {/* Al crear solicitamos el nombre.
                Para editarlo se utiliza Editar mesa. */}

            {groupingSession.editingIndex === null && (
              <TextField
                label="Nombre de la agrupación"
                value={groupForm.nombre}
                onChange={(event) =>
                  updateGroupForm((previous) => ({
                    ...previous,
                    nombre: event.target.value,
                  }))
                }
                fullWidth
                required
                slotProps={{
                  htmlInput: {
                    maxLength: 100,
                  },
                }}
                sx={textFieldStyles}
              />
            )}

            {/* ===================================== */}
            {/* INTEGRANTES SELECCIONADOS             */}
            {/* ===================================== */}

            <div className="rounded-lg border border-mesa-border px-3 py-3">

              <p className="text-xs text-mesa-muted">
                Mesas integrantes
              </p>

              <p className="mt-1 text-sm font-semibold text-mesa-text">
                {groupForm.idsMesas
                  .map(
                    (idMesa) =>
                      physicalTablesById.get(
                        Number(idMesa)
                      )?.codigo ||
                      `Mesa ${idMesa}`
                  )
                  .join(' + ')}
              </p>

            </div>

            {/* ===================================== */}
            {/* RESPONSABLE COMÚN                     */}
            {/* ===================================== */}

            <div className="rounded-lg border border-mesa-border px-3 py-3">

              <p className="text-xs text-mesa-muted">
                Mozo responsable
              </p>

              <p className="mt-1 text-sm font-semibold text-mesa-text">
                {activeSelectionWaiterId == null
                  ? 'Sin mozo asignado'
                  : getWaiterLabel(
                      waiters.find(
                        (waiter) =>
                          Number(waiter.idUsuario) ===
                          Number(activeSelectionWaiterId)
                      ) ?? {
                        idUsuario:
                          activeSelectionWaiterId,
                      }
                    )}
              </p>

            </div>

            {waitersError && (
              <DefaultButton
                type="button"
                variant="secondary"
                onClick={onRetryWaiters}
              >
                Reintentar carga de mozos
              </DefaultButton>
            )}

          </div>
        </DashboardFormDialog>
      )}

      {/* ===================================== */}
      {/* DIÁLOGO REUTILIZABLE DE SECTORES       */}
      {/* ===================================== */}

      {(sectorDialogOpen || createSectorOpen) && (
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
          submitDisabled={
            !sectorName.trim()
          }
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
