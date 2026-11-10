
import { useContext, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'
import TableRestaurantOutlinedIcon from '@mui/icons-material/TableRestaurantOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import LinkOffOutlinedIcon from '@mui/icons-material/LinkOffOutlined'

/* Components */
import Table from '../../../table/Table'
import { getTableColumns } from '../../../table/columns/tableColumns'
import DefaultButton from '../../../common/button/DefaultButton'
import DashboardFormDialog from '../../DashboardFormDialog'
import DashboardTabs from '../../DashboardTabs'
import DashboardSettingSwitch from '../../DashboardSettingSwitch'
import SectorsSection from './SectorsSection'

/* Hooks */
import useCreateTableMutation from '../../../../hooks/mutations/useCreateTableMutation'
import useUpdateTableMutation from '../../../../hooks/mutations/useUpdateTableMutation'
import useChangeTableEnablementMutation from '../../../../hooks/mutations/useChangeTableEnablementMutation'

/* Context */
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

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
  activa: true,
  idUsuarioMozo: '',
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
  groupingRequested = false,
  onStopGrouping,
  distribution,
  distributionLoading = false,
  distributionError = false,

  // Editor de distribución
  onMoveTable,
  onMoveTableToSector,
  onMoveGroupToSector,
  editorDisabled = false,
  isDirty = false,
  hasRemoteChanges = false,
  isDistributionSaving = false,
  onSaveDistribution,
  onCancelDistribution,
  onReloadDistribution,

  // Apertura de formularios desde Tables.jsx
  createSectorOpen = false,
  onCloseCreateSector,
  createTableOpen = false,
  onCloseCreateTable,

  // Mozos del establecimiento
  waiters = [],
  waitersLoading = false,
  waitersError = false,
  onRetryWaiters,

  // Asignaciones del borrador
  onSetSectorWaiter,
  onSetTableWaiter,

  // Agrupaciones del borrador
  onSaveGroup,
  onRenameGroup,
  onRemoveGroup,
}) => {
  const { openActionDialog } =
  useContext(ActionDialogContext)
  // =========================================
  // ESTADOS
  // =========================================

  const [view, setView] = useState('sectors')

  // Al iniciar una agrupación desde la barra superior, mostrar el Plano.
  const currentView = groupingRequested ? 'sectors' : view

  const [groupEditRequest, setGroupEditRequest] =
    useState(null)

  const groupEditSequenceRef = useRef(0)

  const [editingTable, setEditingTable] =
    useState(null)

  const [tableForm, setTableForm] = useState({
    ...emptyTableForm,
  })

  // El nombre se edita en el formulario y
  // después se incorpora al borrador.
  const [groupName, setGroupName] = useState('')

  // =========================================
  // MUTACIONES
  // =========================================

  const createTableMutation =
    useCreateTableMutation(idEstablecimiento)

  const updateTableMutation =
    useUpdateTableMutation(idEstablecimiento)

  const changeEnablementMutation =
    useChangeTableEnablementMutation(idEstablecimiento)

  const isTableSaving =
    createTableMutation.isPending ||
    updateTableMutation.isPending ||
    changeEnablementMutation.isPending

  // =========================================
  // DATOS DERIVADOS
  // =========================================

  const hasSectors = sectors.length > 0

  const isEditing = editingTable !== null

  const tableDialogOpen =
    createTableOpen || isEditing

  const editingTableDistribution =
    distribution?.mesas?.find(
      (mesa) =>
        Number(mesa.idMesa) ===
        Number(editingTable?.idMesa)
    )

  const currentSectorId =
    editingTableDistribution?.idSector ?? null

  // =========================================
  // MOZOS DE LA MESA Y DEL SECTOR
  // =========================================

  const currentTableWaiter =
    distribution?.mozosMesas?.find(
      (assignment) =>
        Number(assignment.idMesa) ===
        Number(editingTable?.idMesa)
    )

  const currentSectorWaiter =
    distribution?.mozosSectores?.find(
      (assignment) =>
        Number(assignment.idSector) ===
        Number(tableForm.idSector)
    )

  const waiterChanged =
    isEditing &&
    String(tableForm.idUsuarioMozo) !==
      String(currentTableWaiter?.idUsuario ?? '')

  // =========================================
  // AGRUPACIÓN DE LA MESA
  // =========================================

  const editingGroupIndex = isEditing
    ? (distribution?.grupos ?? []).findIndex(
        (grupo) =>
          (grupo.idsMesas ?? []).some(
            (id) =>
              Number(id) ===
              Number(editingTable?.idMesa)
          )
      )
    : -1

  const editingGroup =
    editingGroupIndex >= 0
      ? distribution.grupos[editingGroupIndex]
      : null

  const isGroupedTable =
    editingGroup !== null

  const editingGroupTables =
    (editingGroup?.idsMesas ?? []).map(
      (idMesa) =>
        tables.find(
          (table) =>
            Number(table.idMesa) ===
            Number(idMesa)
        )
    )

  const editingGroupCapacity =
    editingGroupTables.reduce(
      (total, table) =>
        total + (Number(table?.capacidad) || 0),
      0
    )

  const editingGroupCodes =
    (editingGroup?.idsMesas ?? []).map(
      (idMesa, index) =>
        editingGroupTables[index]?.codigo ??
        `Mesa ${idMesa}`
    )

  // =========================================
  // VALIDACIÓN DEL NOMBRE DEL GRUPO
  // =========================================

  const groupNameChanged =
    isGroupedTable &&
    groupName.trim() !== editingGroup.nombre

  const groupNameValid =
    !isGroupedTable ||
    (
      groupName.trim().length > 0 &&
      groupName.trim().length <= 100
    )

  // =========================================
  // NOMBRE DEL MOZO
  // =========================================

  const getWaiterName = (idUsuario) => {
    const waiter = waiters.find(
      (user) =>
        Number(user.idUsuario) ===
        Number(idUsuario)
    )

    if (!waiter) {
      return 'Mozo no disponible'
    }

    return (
      [waiter.nombre, waiter.apellido]
        .filter(Boolean)
        .join(' ') ||
      waiter.email ||
      `Usuario ${waiter.idUsuario}`
    )
  }

  // =========================================
  // CAMBIOS DE HABILITACIÓN Y SECTOR
  // =========================================

  const habilitationChanged =
    isEditing &&
    editingTableDistribution != null &&
    tableForm.activa !==
      editingTableDistribution.activa

  const sectorChanged =
    isEditing &&
    currentSectorId !== null &&
    tableForm.idSector !== '' &&
    Number(tableForm.idSector) !==
      Number(currentSectorId)

  // =========================================
  // VALIDACIÓN DEL FORMULARIO
  // =========================================

  const codigo = tableForm.codigo.trim()

  const capacidad =
    Number(tableForm.capacidad)

  const idSector =
    Number(tableForm.idSector)

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
    (isEditing || isSectorValid) &&
    groupNameValid

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
  // MOZOS POR ID Y ASIGNACIONES
  // =========================================

  const waitersById = useMemo(
    () =>
      new Map(
        waiters.map((waiter) => [
          Number(waiter.idUsuario),
          waiter,
        ])
      ),
    [waiters]
  )

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

  const tableWaitersById = useMemo(
    () =>
      new Map(
        (distribution?.mozosMesas ?? []).map(
          (assignment) => [
            Number(assignment.idMesa),
            assignment.idUsuario,
          ]
        )
      ),
    [distribution?.mozosMesas]
  )

  // =========================================
  // GRUPOS POR ID DE MESA
  // =========================================

  // La vista Lista debe utilizar el mismo
  // responsable efectivo que el plano.
  //
  // Una mesa agrupada hereda el mozo del grupo.
  // Si el grupo no tiene mozo propio, se utiliza
  // el responsable del sector.
  //
  // Las mesas individuales conservan su mozo
  // propio o el heredado del sector.

  const groupsByTableId = useMemo(() => {
    const result = new Map()

    for (const group of distribution?.grupos ?? []) {
      for (const idMesa of group.idsMesas ?? []) {
        result.set(Number(idMesa), group)
      }
    }

    return result
  }, [distribution?.grupos])

  // =========================================
  // ESTADÍSTICAS
  // =========================================

  const totalCapacity = tables.reduce(
    (total, table) =>
      total + (Number(table.capacidad) || 0),
    0
  )

  // Mesas pertenecientes a la configuración seleccionada.
  // Se utiliza tanto para el plano como para la lista.
  const selectedDetails =
    distribution?.mesas ?? []

  const enabledTables =
    selectedDetails.filter((detail) => {
      const physical =
        physicalTablesById.get(
          Number(detail.idMesa)
        )

      return (
        detail.activa === true &&
        detail.activaGlobal !== false &&
        physical?.activa !== false
      )
    }).length

  // =========================================
  // RESUMEN COMPACTO
  // =========================================

  const workspaceStats = [
    {
      label: 'Sectores',
      icon: LayersOutlinedIcon,
      value:
        sectorsLoading || sectorsError
          ? '—'
          : sectors.length,
    },
    {
      label: 'Mesas',
      icon: TableRestaurantOutlinedIcon,
      value:
        tablesLoading || tablesError
          ? '—'
          : tables.length,
    },
    {
      label: 'Capacidad (personas)',
      icon: GroupsOutlinedIcon,
      value:
        tablesLoading || tablesError
          ? '—'
          : totalCapacity,
    },
    {
      label: 'Habilitadas',
      icon: CheckCircleIcon,
      value:
        !selectedConfiguration ||
        distributionLoading ||
        distributionError ||
        tablesLoading ||
        !distribution
          ? '—'
          : enabledTables,
    },
  ]

  // =========================================
  // FILAS PARA EL DATAGRID
  // =========================================

  const operationalRows =
    selectedDetails.map((detail) => {
      const idMesa = Number(detail.idMesa)

      const physicalTable =
        physicalTablesById.get(idMesa)

      // =====================================
      // RESPONSABLE EFECTIVO
      // =====================================

      const group = groupsByTableId.get(idMesa)

      const sectorWaiterId =
        sectorWaitersById.get(Number(detail.idSector)) ?? null

      const ownWaiterId =
        tableWaitersById.get(idMesa) ?? null

      // Prioridad:
      // - Agrupada: grupo -> sector.
      // - Individual: propio -> sector.
      const effectiveWaiterId = group
        ? (group.idUsuario ?? sectorWaiterId)
        : (ownWaiterId ?? sectorWaiterId)

      // Identificar el origen de la asignación.
      let waiterOrigin = null

      if (effectiveWaiterId != null) {
        if (group?.idUsuario != null) {
          waiterOrigin = 'Grupo'
        } else if (!group && ownWaiterId != null) {
          waiterOrigin = 'Propio'
        } else {
          waiterOrigin = 'Sector'
        }
      }

      const effectiveWaiter =
        effectiveWaiterId != null
          ? waitersById.get(
              Number(effectiveWaiterId)
            )
          : null

      const waiterName = effectiveWaiter
        ? (
            [effectiveWaiter.nombre, effectiveWaiter.apellido]
              .filter(Boolean)
              .join(' ') ||
            effectiveWaiter.email ||
            `Usuario ${effectiveWaiterId}`
          )
        : effectiveWaiterId != null
          ? 'Mozo no disponible'
          : 'Sin mozo'

      return {
        idMesa: detail.idMesa,

        codigo:
          physicalTable?.codigo ||
          detail.codigo ||
          `Mesa ${detail.idMesa}`,

        sector:
          sectorNameById.get(
            Number(detail.idSector)
          ) ||
          'Sin identificar',

        capacidad:
          physicalTable?.capacidad ?? null,

        agrupable:
          physicalTable?.agrupable ?? false,

        habilitada:
          detail.activa === true &&
          detail.activaGlobal !== false &&
          physicalTable?.activa !== false,

        // Responsable efectivo de la mesa.
        waiterId: effectiveWaiterId,
        waiterName,

        waiterInitial:
          (
            effectiveWaiter?.nombre ||
            effectiveWaiter?.apellido ||
            effectiveWaiter?.email ||
            '?'
          ).charAt(0).toUpperCase(),

        waiterOrigin,

        physicalTable:
          physicalTable ?? null,
      }
    })

  // =========================================
  // FORMULARIO DE MESAS
  // =========================================

  const resetTableForm = () => {
    setTableForm({
      ...emptyTableForm,
    })

    setEditingTable(null)
    setGroupName('')
  }

  const handleOpenEditTable = (table) => {
    if (!table || isTableSaving) return

    const physicalTable =
      table.physicalTable ?? table

    const tableDistribution =
      distribution?.mesas?.find(
        (mesa) =>
          Number(mesa.idMesa) ===
          Number(physicalTable.idMesa)
      )

    // Recuperar el nombre actual del grupo.
    const currentGroup =
      (distribution?.grupos ?? []).find(
        (group) =>
          (group.idsMesas ?? []).some(
            (idMesa) =>
              Number(idMesa) ===
              Number(physicalTable.idMesa)
          )
      )

    const tableWaiter =
      distribution?.mozosMesas?.find(
        (assignment) =>
          Number(assignment.idMesa) ===
          Number(physicalTable.idMesa)
      )

    setEditingTable(physicalTable)
    setGroupName(currentGroup?.nombre ?? '')

    setTableForm({
      codigo: physicalTable.codigo ?? '',
      capacidad:
        String(physicalTable.capacidad ?? ''),
      agrupable:
        Boolean(physicalTable.agrupable),
      idSector:
        tableDistribution?.idSector ?? '',
      activa:
        tableDistribution?.activa ?? true,
      idUsuarioMozo:
        tableWaiter?.idUsuario ?? '',
    })

  }

  const handleCloseTableDialog = () => {
    if (isTableSaving) return

    if (!isEditing) {
      onCloseCreateTable?.()
    }

    resetTableForm()
  }

  // =========================================
  // APLICAR NOMBRE EN EL BORRADOR
  // =========================================

  const applyGroupName = () => {
    if (
      !isGroupedTable ||
      !groupNameChanged
    ) {
      return true
    }

    if (
      !groupNameValid ||
      editorDisabled ||
      !onRenameGroup
    ) {
      toast.error(
        'No se puede modificar el nombre del grupo en este momento.'
      )

      return false
    }

    const renamed = onRenameGroup(
      editingGroupIndex,
      groupName.trim()
    )

    if (!renamed) {
      toast.error(
        'No se pudo actualizar el nombre de la agrupación.'
      )

      return false
    }

    return true
  }

  // =========================================
  // MODIFICAR INTEGRANTES
  // =========================================

  const handleEditGroupFromTable = () => {
    if (
      !editingGroup ||
      isTableSaving ||
      editorDisabled
    ) {
      return
    }

    // Conservamos el nombre escrito antes
    // de abrir la selección del grupo.
    if (!applyGroupName()) {
      return
    }

    const groupIndex =
      editingGroupIndex

    handleCloseTableDialog()

    setView('sectors')

    groupEditSequenceRef.current += 1

    setGroupEditRequest({
      sequence: groupEditSequenceRef.current,
      groupIndex,
    })
  }

  // =========================================
  // DESAGRUPAR
  // =========================================

  const handleUngroupFromTable = () => {
    if (
      !editingGroup ||
      isTableSaving ||
      editorDisabled ||
      !onRemoveGroup
    ) {
      return
    }

    const groupIndex =
      editingGroupIndex

    handleCloseTableDialog()

    onRemoveGroup(groupIndex)
  }

  // =========================================
  // GUARDAR MESA
  // =========================================

  const handleSaveTable = async (
    event,
    confirmedApplyToAll = null
  ) => {
    event?.preventDefault()

    if (
      !isTableFormValid ||
      isTableSaving
    ) {
      return false
    }

    if (
      groupNameChanged &&
      (
        editorDisabled ||
        !onRenameGroup
      )
    ) {
      toast.error(
        'No se puede modificar el nombre de la agrupación en este momento.'
      )

      return false
    }

    // =========================================
    // PROTEGER MESAS AGRUPADAS
    // =========================================

    if (
      isGroupedTable &&
      !tableForm.agrupable
    ) {
      toast.warning(
        `La mesa pertenece a "${editingGroup.nombre}". ` +
        'Primero desagrupala para quitar Agrupable.'
      )

      return false
    }

    if (
      isGroupedTable &&
      habilitationChanged
    ) {
      toast.warning(
        `La mesa ${editingTable?.codigo ?? ''} pertenece a ` +
        `"${editingGroup.nombre}". ` +
        'Primero desarmá la agrupación para cambiar su habilitación.'
      )

      return false
    }

    if (
      isGroupedTable &&
      sectorChanged
    ) {
      toast.error(
        'Primero desagrupá la mesa para cambiarla de sector.'
      )

      return false
    }

    if (
      isGroupedTable &&
      waiterChanged
    ) {
      toast.error(
        'El mozo de una mesa agrupada se administra desde el grupo.'
      )

      return false
    }

    const tableData = {
      codigo,
      capacidad,
      agrupable: tableForm.agrupable,
    }

    const physicalChanged =
      isEditing &&
      (
        tableData.codigo !==
          editingTable.codigo ||
        tableData.capacidad !==
          Number(editingTable.capacidad) ||
        tableData.agrupable !==
          Boolean(editingTable.agrupable)
      )

    // =========================================
    // VALIDACIONES DE MOZOS
    // =========================================

    if (waiterChanged) {
      if (
        editorDisabled ||
        waitersLoading ||
        waitersError ||
        !onSetTableWaiter
      ) {
        toast.error(
          'No se puede modificar el mozo en este momento.'
        )

        return false
      }

      if (
        tableForm.idUsuarioMozo !== '' &&
        !waiters.some(
          (waiter) =>
            Number(waiter.idUsuario) ===
            Number(tableForm.idUsuarioMozo)
        )
      ) {
        toast.error(
          'El mozo seleccionado no está disponible.'
        )

        return false
      }

      if (habilitationChanged) {
        toast.error(
          'Guardá la habilitación y la asignación ' +
          'del mozo por separado.'
        )

        return false
      }
    }

    // =========================================
    // VALIDACIONES DE DISTRIBUCIÓN
    // =========================================

    if (
      isEditing &&
      sectorChanged
    ) {
      if (
        editorDisabled ||
        !onMoveTableToSector
      ) {
        toast.error(
          'No se puede modificar el sector en este momento.'
        )

        return false
      }

      if (isGroupedTable) {
        toast.error(
          'Esta mesa pertenece a una agrupación. ' +
          'No se puede cambiar su sector individualmente.'
        )

        return false
      }
    }

    // =========================================
    // VALIDAR HABILITACIÓN
    // =========================================

    if (
      isEditing &&
      habilitationChanged
    ) {
      if (
        editorDisabled ||
        isDirty
      ) {
        toast.error(
          'Guardá o descartá primero los cambios ' +
          'pendientes de la distribución.'
        )

        return false
      }

      if (sectorChanged) {
        toast.error(
          'Para cambiar el sector y la habilitación, ' +
          'guardá primero el cambio de sector en el plano.'
        )

        return false
      }

      if (
        selectedConfiguration?.idConfiguracionMesa == null ||
        distribution?.version == null
      ) {
        toast.error(
          'No se pudo obtener la configuración o su versión.'
        )

        return false
      }
    }

    
   
    // =========================================
    // CONFIRMAR CAMBIO DE HABILITACIÓN
    // =========================================

    // La confirmación aparece antes de ejecutar
    // cualquier mutación del formulario.
    //
    // null  = todavía no se eligió el alcance.
    // false = solo configuración seleccionada.
    // true  = todas las configuraciones.

    if (
      isEditing &&
      habilitationChanged &&
      confirmedApplyToAll === null
    ) {
      const actionDescription = tableForm.activa
        ? 'habilitar'
        : 'deshabilitar'

      openActionDialog({
        title: tableForm.activa
          ? 'Habilitar mesa'
          : 'Deshabilitar mesa',

        description:
          `¿Querés ${actionDescription} la mesa ` +
          `"${editingTable.codigo}" solo en ` +
          'esta configuración o en todas las ' +
          'configuraciones del establecimiento?',

        actionLabel: 'Todas',
        secondaryActionLabel: 'Solo esta',
        cancelLabel: 'Cancelar',

        variant: 'primary',
        icon: 'warning',

        onSecondaryAction: () => handleSaveTable(null, false),

        onAction: () => handleSaveTable(null, true),
      })

      return false
    }



    // =========================================
    // CREAR MESA
    // =========================================

    if (!isEditing) {
      try {
        await createTableMutation.mutateAsync({
          ...tableData,
          idSector,
        })

        toast.success(
          'Mesa creada correctamente.'
        )

        onCloseCreateTable?.()
        resetTableForm()
      } catch (error) {
        toast.error(
          getErrorMessage(
            error,
            'No se pudo crear la mesa.'
          )
        )
      }

      return false
    }

    // =========================================
    // MODIFICAR MESA
    // =========================================

    let physicalSaved = false
    let enablementSaved = false
    let sectorMoved = false
    let waiterAssigned = false
    let groupRenamed = false

    try {
      // 1. Guardar características físicas.
      if (physicalChanged) {
        await updateTableMutation.mutateAsync({
          idMesa: editingTable.idMesa,
          tableData,
        })

        physicalSaved = true
      }

      // =========================================
      // GUARDAR HABILITACIÓN
      // =========================================

      // Se utiliza el alcance confirmado en el diálogo.
      // La mutación selecciona el endpoint correspondiente.

      if (habilitationChanged) {
        await changeEnablementMutation.mutateAsync({
          idConfiguracionMesa:
            selectedConfiguration.idConfiguracionMesa,

          idMesa:
            editingTable.idMesa,

          version:
            distribution.version,

          activa:
            tableForm.activa,

          applyToAll: confirmedApplyToAll,
        })

        enablementSaved = true
      }

      // 3. Registrar el cambio de sector
      // en el borrador del plano.
      if (sectorChanged) {
        const moved = onMoveTableToSector(
          editingTable.idMesa,
          Number(tableForm.idSector)
        )

        if (!moved) {
          throw new Error(
            'No se pudo aplicar el cambio de sector.'
          )
        }

        sectorMoved = true
      }

      // 4. Registrar la asignación de mozo
      // en el borrador de distribución.
      if (waiterChanged) {
        const assigned = onSetTableWaiter(
          editingTable.idMesa,
          tableForm.idUsuarioMozo === ''
            ? null
            : Number(tableForm.idUsuarioMozo)
        )

        if (!assigned) {
          throw new Error(
            'No se pudo aplicar la asignación del mozo.'
          )
        }

        waiterAssigned = true
      }

      // 5. Registrar el nombre del grupo
      // en el borrador de distribución.
      if (groupNameChanged) {
        if (!applyGroupName()) {
          throw new Error(
            'No se pudo aplicar el nuevo nombre del grupo.'
          )
        }

        groupRenamed = true
      }

      // =========================================
      // RESULTADO
      // =========================================

      if (
        sectorMoved ||
        waiterAssigned ||
        groupRenamed
      ) {
        toast.info(
          'Tenés cambios pendientes en la distribución. ' +
          'Presioná "Guardar cambios" en el plano para confirmarlos.'
        )

        if (physicalSaved) {
          toast.success(
            'Las características físicas de la mesa se actualizaron.'
          )
        }

        if (enablementSaved) {
          toast.success(
            'La habilitación de la mesa se actualizó.'
          )
        }
      } else if (
        physicalSaved ||
        enablementSaved
      ) {
        toast.success(
          'Mesa modificada correctamente.'
        )
      }

      onCloseCreateTable?.()
      resetTableForm()
      return true
    } catch (error) {
      if (
        physicalSaved ||
        enablementSaved
      ) {
        toast.warning(
          'Algunos cambios se guardaron, pero no todos. ' +
          'Revisá la mesa antes de volver a intentar.'
        )

        onCloseCreateTable?.()
        resetTableForm()
        // Hubo un guardado parcial: cerramos la confirmación para
        // evitar repetir automáticamente la parte ya persistida.
        return true
      } else {
        toast.error(
          error?.response?.status === 409
            ? 'La configuración fue modificada por otro usuario. ' +
              'Actualizá la información antes de reintentar.'
            : getErrorMessage(
                error,
                'No se pudo modificar la mesa.'
              )
        )
        // No se guardó nada: el diálogo debe permanecer abierto.
        return false
      }
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
    <>
      <section className="min-w-0 rounded-2xl border border-mesa-border bg-mesa-surface p-4 sm:p-5">

        {/* ===================================== */}
        {/* PESTAÑAS PLANO / LISTA               */}
        {/* ===================================== */}

        <div className="border-b border-mesa-border">
          <DashboardTabs
            tabs={TABLE_VIEWS}
            value={currentView}
            onChange={setView}
            ariaLabel="Vistas de mesas"
          />
        </div>

        {/* ===================================== */}
        {/* RESUMEN COMPACTO                     */}
        {/* ===================================== */}

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-mesa-border py-4">
          {workspaceStats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="flex items-center gap-2"
              >
                <Icon
                  sx={{ fontSize: 18 }}
                  className="text-mesa-muted"
                />

                <span className="text-base font-bold text-mesa-text">
                  {stat.value}
                </span>

                <span className="text-sm text-mesa-muted">
                  {stat.label}
                </span>
              </div>
            )
          })}
        </div>

        {/* ===================================== */}
        {/* PLANO - CONFIGURACIÓN SELECCIONADA   */}
        {/* ===================================== */}

        {(currentView === 'sectors' || createSectorOpen) && (
          <div className={currentView === 'sectors' ? 'mt-4' : 'hidden'}>
            {tablesError ? (
              <div className="space-y-3 rounded-xl border border-mesa-border p-5">
                <p className="text-sm text-red-400">
                  No se pudieron cargar las mesas físicas.
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
                idEstablecimiento={idEstablecimiento}
                sectors={sectors}
                sectorsLoading={sectorsLoading}
                sectorsError={sectorsError}
                onRetrySectors={onRetrySectors}
                tables={tables}
                distribution={distribution}
                distributionLoading={distributionLoading || tablesLoading}
                distributionError={distributionError}
                onEditTable={handleOpenEditTable}
                onMoveTable={onMoveTable}
                onMoveTableToSector={onMoveTableToSector}
                onMoveGroupToSector={onMoveGroupToSector}
                editorDisabled={editorDisabled}
                isDirty={isDirty}
                hasRemoteChanges={hasRemoteChanges}
                isDistributionSaving={isDistributionSaving}
                onSaveDistribution={onSaveDistribution}
                onCancelDistribution={onCancelDistribution}
                onReloadDistribution={onReloadDistribution}
                createSectorOpen={createSectorOpen}
                onCloseCreateSector={onCloseCreateSector}
                waiters={waiters}
                waitersLoading={waitersLoading}
                waitersError={waitersError}
                onRetryWaiters={onRetryWaiters}
                onSetSectorWaiter={onSetSectorWaiter}
                onSaveGroup={onSaveGroup}
                groupEditRequest={groupEditRequest}
                groupingRequested={groupingRequested}
                onStopGrouping={onStopGrouping}
              />
            )}
          </div>
        )}

        {/* ===================================== */}
        {/* LISTA - CONFIGURACIÓN SELECCIONADA   */}
        {/* ===================================== */}

        {currentView === 'operational' && (
          <div className="mt-4 space-y-4">

            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-semibold text-mesa-text">
                Lista de mesas
              </h3>

              {selectedConfiguration && (
                <span className="text-xs text-mesa-muted">
                  {selectedConfiguration.nombre}
                  {' · '}
                  {selectedConfiguration.activa
                    ? 'Configuración activa'
                    : 'Configuración inactiva'}
                </span>
              )}
            </div>

            {!selectedConfiguration ? (
              <div className="rounded-xl border border-dashed border-mesa-border p-6 text-center">
                <p className="text-sm text-mesa-muted">
                  No hay una configuración seleccionada.
                </p>
              </div>
            ) : distributionError ||
              tablesError ||
              sectorsError ? (
              <div className="space-y-3">
                <p className="text-sm text-red-400">
                  No se pudo cargar la lista de mesas.
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
                getRowId={(row) => row.idMesa}
                loading={
                  distributionLoading ||
                  tablesLoading ||
                  sectorsLoading
                }
                rowHeight={72}
                emptyMessage="No hay mesas en la configuración seleccionada."
              />
            )}
          </div>
        )}

        {!hasSectors &&
          !sectorsLoading &&
          !sectorsError && (
            <p className="mt-4 text-sm text-mesa-muted">
              Para registrar mesas físicas,
              primero creá un sector.
            </p>
          )}
      </section>

      {/* ===================================== */}
      {/* FORMULARIO DE MESAS                   */}
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
          onClose={handleCloseTableDialog}
          onSubmit={handleSaveTable}
          isBusy={isTableSaving}
          submitDisabled={!isTableFormValid}
          submitLabel={
            isEditing
              ? 'Guardar cambios'
              : 'Crear mesa'
          }
        >
          <div className="flex flex-col gap-6">

            {/* ===================================== */}
            {/* CÓDIGO DE MESA                       */}
            {/* ===================================== */}

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

            {/* ===================================== */}
            {/* CAPACIDAD                            */}
            {/* ===================================== */}

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

            {/* ===================================== */}
            {/* SECTOR                               */}
            {/* ===================================== */}

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
              disabled={
                isTableSaving ||
                (
                  isEditing &&
                  (
                    editorDisabled ||
                    isGroupedTable ||
                    currentSectorId === null
                  )
                )
              }
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

            {/* ===================================== */}
            {/* MOZO ASIGNADO A LA MESA               */}
            {/* ===================================== */}

            {isEditing && editingTableDistribution && (
              <div className="space-y-2">

                {isGroupedTable ? (
                  <TextField
                    label="Mozo responsable"
                    value={
                      (
                        editingGroup.idUsuario ??
                        currentSectorWaiter?.idUsuario
                      ) != null
                        ? `${getWaiterName(
                            editingGroup.idUsuario ??
                            currentSectorWaiter.idUsuario
                          )} (grupo)`
                        : 'Sin mozo asignado'
                    }
                    fullWidth
                    disabled
                    sx={textFieldStyles}
                  />
                ) : (
                  <TextField
                    select
                    label="Mozo de la mesa"
                    value={tableForm.idUsuarioMozo}
                    onChange={(event) =>
                      setTableForm((prev) => ({
                        ...prev,
                        idUsuarioMozo: event.target.value,
                      }))
                    }
                    fullWidth
                    disabled={
                      isTableSaving ||
                      editorDisabled ||
                      waitersLoading ||
                      waitersError
                    }
                    sx={textFieldStyles}
                    slotProps={selectSlotProps}
                  >
                    <MenuItem value="">
                      Sin asignación individual
                    </MenuItem>

                    {currentTableWaiter &&
                      !waiters.some(
                        (waiter) =>
                          Number(waiter.idUsuario) ===
                          Number(currentTableWaiter.idUsuario)
                      ) && (
                        <MenuItem
                          value={currentTableWaiter.idUsuario}
                          disabled
                        >
                          Mozo anterior no disponible
                        </MenuItem>
                      )}

                    {waiters.map((waiter) => (
                      <MenuItem
                        key={waiter.idUsuario}
                        value={waiter.idUsuario}
                      >
                        {getWaiterName(waiter.idUsuario)}
                      </MenuItem>
                    ))}
                  </TextField>
                )}

                {!isGroupedTable && (
                  <p className="text-xs leading-5 text-mesa-muted">
                    {currentSectorWaiter
                      ? `Responsable del sector: ${getWaiterName(
                          currentSectorWaiter.idUsuario
                        )}. Si no asignás un mozo propio, se mostrará el del sector.`
                      : 'Podés asignar un mozo exclusivo o dejar la mesa sin asignación individual.'}
                  </p>
                )}

                {waitersError && (
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-red-400">
                      No se pudieron cargar los mozos.
                    </p>

                    <DefaultButton
                      type="button"
                      variant="secondary"
                      onClick={onRetryWaiters}
                      disabled={isTableSaving}
                    >
                      Reintentar
                    </DefaultButton>
                  </div>
                )}

                {!waitersLoading &&
                  !waitersError &&
                  waiters.length === 0 && (
                    <p className="text-xs text-mesa-muted">
                      No hay mozos disponibles en el establecimiento.
                    </p>
                  )}
              </div>
            )}

            {/* ===================================== */}
            {/* AGRUPABLE                            */}
            {/* ===================================== */}

            <DashboardSettingSwitch
              label="Agrupable"
              description={
                isGroupedTable
                  ? 'Pertenece a un grupo. Desagrupala antes de cambiar esta propiedad.'
                  : 'Puede unirse con otras mesas agrupables del mismo sector.'
              }
              checked={tableForm.agrupable}
              onChange={(checked) => {
                if (
                  isGroupedTable &&
                  checked === false
                ) {
                  toast.warning(
                    `La mesa ${editingTable?.codigo ?? ''} ` +
                    `pertenece a "${editingGroup.nombre}". ` +
                    'Primero desagrupala.'
                  )

                  return
                }

                setTableForm((prev) => ({
                  ...prev,
                  agrupable: checked,
                }))
              }}
              disabled={isTableSaving}
            />

            {/* ===================================== */}
            {/* AGRUPACIÓN ACTUAL                     */}
            {/* ===================================== */}

            {isEditing && editingGroup && (
              <div className="space-y-3 rounded-xl border border-mesa-border bg-mesa-surface px-3 py-3">

                <TextField
                  label="Nombre de la agrupación"
                  value={groupName}
                  onChange={(event) =>
                    setGroupName(event.target.value)
                  }
                  fullWidth
                  required
                  disabled={
                    isTableSaving ||
                    editorDisabled
                  }
                  slotProps={{
                    htmlInput: {
                      maxLength: 100,
                    },
                  }}
                  sx={textFieldStyles}
                />

                <p className="text-xs text-mesa-muted">
                  {editingGroupCodes.join(' + ')}
                  {' · '}
                  {editingGroupCapacity} personas
                </p>

                <div className="flex flex-wrap gap-2">

                  <DefaultButton
                    type="button"
                    variant="secondary"
                    onClick={handleEditGroupFromTable}
                    disabled={
                      isTableSaving ||
                      editorDisabled ||
                      !groupNameValid
                    }
                  >
                    <EditOutlinedIcon
                      sx={{ fontSize: 17 }}
                    />
                    {' '}
                    Modificar integrantes
                  </DefaultButton>

                  <DefaultButton
                    type="button"
                    variant="secondary"
                    onClick={handleUngroupFromTable}
                    disabled={
                      isTableSaving ||
                      editorDisabled ||
                      !onRemoveGroup
                    }
                  >
                    <LinkOffOutlinedIcon
                      sx={{ fontSize: 17 }}
                    />
                    {' '}
                    Desagrupar
                  </DefaultButton>
                </div>
              </div>
            )}

            {/* ===================================== */}
            {/* HABILITACIÓN POR CONFIGURACIÓN        */}
            {/* ===================================== */}

            {isEditing && editingTableDistribution && (
              <DashboardSettingSwitch
                label="Habilitada"
                description={
                  isGroupedTable
                    ? 'Esta mesa pertenece a una agrupación.'
                    : 'Permite utilizar la mesa en esta configuración.'
                }
                checked={tableForm.activa}
                onChange={(checked) => {
                  // =================================
                  // BLOQUEAR MESA AGRUPADA
                  // =================================

                  if (
                    isGroupedTable &&
                    checked !== tableForm.activa
                  ) {
                    toast.warning(
                      `La mesa ${editingTable?.codigo ?? ''} ` +
                      `pertenece a "${editingGroup.nombre}". ` +
                      'Primero desarmá la agrupación para cambiar su habilitación.'
                    )

                    return
                  }

                  // =================================
                  // PROTEGER CAMBIOS PENDIENTES
                  // =================================

                  if (isDirty) {
                    toast.warning(
                      'Guardá o descartá primero los cambios ' +
                      'pendientes de la distribución.'
                    )

                    return
                  }

                  setTableForm((prev) => ({
                    ...prev,
                    activa: checked,
                  }))
                }}
                // No bloqueamos el evento por isDirty
                // ni por pertenecer a un grupo:
                // necesitamos recibir el intento
                // para mostrar el toast correspondiente.
                disabled={
                  isTableSaving ||
                  editorDisabled
                }
              />
            )}

            {/* ===================================== */}
            {/* INFORMACIÓN ADICIONAL                */}
            {/* ===================================== */}

            {isEditing && !isGroupedTable && (
              <p className="text-xs leading-5 text-mesa-muted">
                Los cambios de sector quedan pendientes
                hasta guardar la distribución.
              </p>
            )}
          </div>
        </DashboardFormDialog>
      )}
    </>
  )
}

export default TablesWorkspace
