
import { useContext, useEffect, useState } from 'react'
import { useBlocker, useParams } from 'react-router'
import { toast } from 'sonner'

/* Components */
import DefaultButton from '../../../../components/common/button/DefaultButton'
import DashboardPageHeader from '../../../../components/dashboard/DashboardPageHeader'
import TableConfigurationsSection from '../../../../components/dashboard/user/tables/TableConfigurationsSection'
import TablesWorkspace from '../../../../components/dashboard/user/tables/TablesWorkspace'

/* Context */
import { ActionDialogContext } from '../../../../context/ActionDialogContext'

/* Hooks - Queries */
import useTableConfigurationsQuery from '../../../../hooks/queries/useTableConfigurationsQuery'
import useTableDistributionQuery from '../../../../hooks/queries/useTableDistributionQuery'
import useSectorsQuery from '../../../../hooks/queries/useSectorsQuery'
import useTablesQuery from '../../../../hooks/queries/useTablesQuery'
import useEstablishmentUsersQuery from '../../../../hooks/queries/useEstablishmentUsersQuery'

/* Hooks - Editor */
import useTableDistributionDraft from '../../../../hooks/useTableDistributionDraft'
import useUpdateTableDistributionMutation from '../../../../hooks/mutations/useUpdateTableDistributionMutation'

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message ||
  error?.message ||
  fallback

const Tables = () => {
  const { idEstablecimiento } = useParams()

  const { openActionDialog } =
    useContext(ActionDialogContext)

  const [selectedId, setSelectedId] = useState('')

  // =========================================
  // APERTURA DE FORMULARIOS
  // =========================================

  const [createSectorOpen, setCreateSectorOpen] =
    useState(false)

  const [createTableOpen, setCreateTableOpen] =
    useState(false)

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
  // MOZOS DEL ESTABLECIMIENTO
  // =========================================

  const {
    data: establishmentUsers = [],
    isLoading: waitersLoading,
    isError: waitersError,
    refetch: refetchWaiters,
  } = useEstablishmentUsersQuery(idEstablecimiento)

  const waiters = establishmentUsers.filter(
    (user) => user.rolEstablecimiento === 'MOZO'
  )

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

  // =========================================
  // DISTRIBUCIÓN SELECCIONADA
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

  // =========================================
  // BORRADOR LOCAL
  // =========================================

  const {
    draft,
    isDirty,
    hasRemoteChanges,

    // Movimiento de mesas
    moveTable,
    moveTableToSector,
    moveGroupToSector,

    // Asignaciones de mozos
    setSectorWaiter,
    setTableWaiter,

    // Agrupaciones
    saveGroup,
    renameGroup,
    removeGroup,

    // Persistencia
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

  // =========================================
  // DISTRIBUCIÓN EDITADA
  // =========================================

  // Mostrar los datos del borrador sin perder
  // los demás campos de la respuesta del backend.
  //
  // Es importante incluir los grupos y mozos,
  // además de las coordenadas de las mesas.

  const editedDistribution =
    distribution && draft
      ? {
          ...distribution,
          mesas: draft.mesas,
          grupos: draft.grupos,
          mozosSectores: draft.mozosSectores,
          mozosMesas: draft.mozosMesas,
        }
      : distribution

  const editorDisabled =
    isSaving ||
    hasRemoteChanges ||
    distributionLoading ||
    distributionError ||
    !draft

  // =========================================
  // ACCIONES DE CREACIÓN
  // =========================================

  const canCreateTable =
    sectors.length > 0 &&
    !sectorsLoading &&
    !sectorsError &&
    !tablesLoading &&
    !tablesError &&
    !isDirty &&
    !editorDisabled

  const handleOpenCreateSector = () => {
    if (isSaving || isDirty || hasRemoteChanges) return

    setCreateSectorOpen(true)
  }

  const handleOpenCreateTable = () => {
    if (!canCreateTable) return

    setCreateTableOpen(true)
  }

  // =========================================
  // CAMBIAR MESA DE SECTOR
  // =========================================

  const handleMoveTableToSector = (
    idMesa,
    idSector,
    nextPosition = null
  ) => {
    if (!draft || isSaving || hasRemoteChanges) {
      return false
    }

    const mesa = draft.mesas.find(
      (item) =>
        Number(item.idMesa) === Number(idMesa)
    )

    const sector = sectors.find(
      (item) =>
        Number(item.idSector) === Number(idSector)
    )

    if (!mesa || !sector) {
      return false
    }

    if (Number(mesa.idSector) === Number(idSector)) {
      return true
    }

    // No se permite trasladar individualmente
    // una mesa que pertenece a una agrupación.

    const mesaAgrupada = draft.grupos.some(
      (grupo) =>
        (grupo.idsMesas ?? []).some(
          (id) => Number(id) === Number(idMesa)
        )
    )

    if (mesaAgrupada) {
      toast.error(
        'Esta mesa pertenece a una agrupación. ' +
        'Primero tenés que desagruparla.'
      )

      return false
    }

    return moveTableToSector(
      idMesa,
      idSector,
      nextPosition
    )
  }

  // =========================================
  // CAMBIAR GRUPO COMPLETO DE SECTOR
  // =========================================

  const handleMoveGroupToSector = (
    idMesa,
    idSector,
    nextPosition = null
  ) => {
    if (
      editorDisabled ||
      sectorsLoading ||
      sectorsError ||
      !draft
    ) {
      return false
    }

    const destinationSectorId = Number(idSector)

    const destinationSector = sectors.find(
      (sector) =>
        Number(sector.idSector) === destinationSectorId
    )

    if (!destinationSector) {
      toast.error('El sector de destino no es válido.')
      return false
    }

    const group = draft.grupos.find(
      (item) =>
        (item.idsMesas ?? []).some(
          (id) => Number(id) === Number(idMesa)
        )
    )

    if (!group) {
      toast.error(
        'La mesa seleccionada no pertenece a una agrupación.'
      )
      return false
    }

    if (Number(group.idSector) === destinationSectorId) {
      return false
    }

    const moved = moveGroupToSector(
      idMesa,
      destinationSectorId,
      nextPosition
    )

    if (!moved) {
      toast.error(
        'No se pudo trasladar la agrupación al sector seleccionado.'
      )
      return false
    }

    return true
  }

  // =========================================
  // VALIDAR ASIGNACIÓN DE MOZOS
  // =========================================

  const canAssignWaiter = (idUsuario) => {
    if (
      editorDisabled ||
      waitersLoading ||
      waitersError
    ) {
      return false
    }

    if (idUsuario == null || idUsuario === '') {
      return true
    }

    return waiters.some(
      (waiter) =>
        Number(waiter.idUsuario) === Number(idUsuario)
    )
  }

  // =========================================
  // ASIGNAR MOZO A UN SECTOR
  // =========================================

  const handleSetSectorWaiter = (
    idSector,
    idUsuario
  ) => {
    if (!canAssignWaiter(idUsuario)) {
      return false
    }

    const sectorExists = sectors.some(
      (sector) =>
        Number(sector.idSector) === Number(idSector)
    )

    if (!sectorExists) {
      return false
    }

    return setSectorWaiter(idSector, idUsuario)
  }

  // =========================================
  // ASIGNAR MOZO A UNA MESA
  // =========================================

  const handleSetTableWaiter = (
    idMesa,
    idUsuario
  ) => {
    if (!canAssignWaiter(idUsuario) || !draft) {
      return false
    }

    const mesaExists = draft.mesas.some(
      (mesa) =>
        Number(mesa.idMesa) === Number(idMesa)
    )

    if (!mesaExists) {
      return false
    }

    // Las mesas agrupadas no tienen una
    // asignación individual de mozo.

    const mesaAgrupada = draft.grupos.some(
      (grupo) =>
        (grupo.idsMesas ?? []).some(
          (id) => Number(id) === Number(idMesa)
        )
    )

    if (mesaAgrupada) {
      toast.error(
        'Esta mesa pertenece a una agrupación. ' +
        'El mozo se administra desde el grupo.'
      )

      return false
    }

    return setTableWaiter(idMesa, idUsuario)
  }

  // =========================================
  // VALIDAR AGRUPACIÓN DE MESAS
  // =========================================

  const validateGroupData = (
    groupData,
    editingIndex = null
  ) => {
    if (
      editorDisabled ||
      tablesLoading ||
      tablesError ||
      sectorsLoading ||
      sectorsError ||
      !draft
    ) {
      toast.error(
        'No se pueden modificar agrupaciones en este momento.'
      )

      return null
    }

    const nombre = String(
      groupData?.nombre ?? ''
    ).trim()

    const idSector = Number(
      groupData?.idSector
    )

    const idsMesas = (
      groupData?.idsMesas ?? []
    ).map(Number)

    const idUsuario =
      groupData?.idUsuario == null ||
      groupData.idUsuario === ''
        ? null
        : Number(groupData.idUsuario)

    // =========================================
    // DATOS BÁSICOS
    // =========================================

    if (!nombre || nombre.length > 100) {
      toast.error(
        'El nombre del grupo debe tener entre 1 y 100 caracteres.'
      )

      return null
    }

    if (
      !Number.isInteger(idSector) ||
      !sectors.some(
        (sector) =>
          Number(sector.idSector) === idSector
      )
    ) {
      toast.error(
        'Seleccioná un sector válido.'
      )

      return null
    }

    if (
      idsMesas.length < 2 ||
      idsMesas.some(
        (id) => !Number.isInteger(id) || id <= 0
      ) ||
      new Set(idsMesas).size !== idsMesas.length
    ) {
      toast.error(
        'Seleccioná al menos dos mesas diferentes.'
      )

      return null
    }

    if (
      editingIndex !== null &&
      (
        !Number.isInteger(editingIndex) ||
        editingIndex < 0 ||
        editingIndex >= draft.grupos.length
      )
    ) {
      toast.error(
        'No se encontró la agrupación seleccionada.'
      )

      return null
    }

    // =========================================
    // VALIDAR MESAS FÍSICAS
    // =========================================

    const validPhysicalTables = idsMesas.every(
      (idMesa) =>
        tables.some(
          (table) =>
            Number(table.idMesa) === idMesa &&
            table.agrupable === true &&
            table.activa !== false
        )
    )

    if (!validPhysicalTables) {
      toast.error(
        'Todas las mesas deben estar habilitadas y ser agrupables.'
      )

      return null
    }

    // =========================================
    // VALIDAR DISTRIBUCIÓN Y SECTOR
    // =========================================

    const validSectorTables = idsMesas.every(
      (idMesa) =>
        draft.mesas.some(
          (mesa) =>
            Number(mesa.idMesa) === idMesa &&
            Number(mesa.idSector) === idSector &&
            mesa.activa === true &&
            mesa.activaGlobal !== false
        )
    )

    if (!validSectorTables) {
      toast.error(
        'Todas las mesas deben estar habilitadas ' +
        'y pertenecer al mismo sector.'
      )

      return null
    }

    // =========================================
    // EVITAR GRUPOS SUPERPUESTOS
    // =========================================

    const alreadyGrouped = draft.grupos.some(
      (grupo, index) =>
        index !== editingIndex &&
        (grupo.idsMesas ?? []).some(
          (id) => idsMesas.includes(Number(id))
        )
    )

    if (alreadyGrouped) {
      toast.error(
        'Una o más mesas ya pertenecen a otra agrupación.'
      )

      return null
    }

    // =========================================
    // RESPONSABLE EFECTIVO DE CADA MESA
    // =========================================

    const getEffectiveWaiterId = (idMesa) => {
      const mesa = draft.mesas.find(
        (item) =>
          Number(item.idMesa) === Number(idMesa)
      )

      if (!mesa) return undefined

      const grupo = draft.grupos.find(
        (item) =>
          (item.idsMesas ?? []).some(
            (id) => Number(id) === Number(idMesa)
          )
      )

      const mozoSector = draft.mozosSectores.find(
        (assignment) =>
          Number(assignment.idSector) ===
          Number(mesa.idSector)
      )

      // El responsable del grupo prevalece
      // sobre la asignación del sector.

      if (grupo) {
        return (
          grupo.idUsuario ??
          mozoSector?.idUsuario ??
          null
        )
      }

      const mozoIndividual = draft.mozosMesas.find(
        (assignment) =>
          Number(assignment.idMesa) ===
          Number(idMesa)
      )

      return (
        mozoIndividual?.idUsuario ??
        mozoSector?.idUsuario ??
        null
      )
    }

    // =========================================
    // VALIDAR RESPONSABLE COMÚN
    // =========================================

    const responsables = idsMesas.map(
      getEffectiveWaiterId
    )

    if (
      responsables.some(
        (responsable) => responsable === undefined
      )
    ) {
      toast.error(
        'No se pudo identificar el responsable de una mesa.'
      )

      return null
    }

    const responsableComun = responsables[0]

    const sameWaiter = responsables.every(
      (responsable) =>
        String(responsable ?? '') ===
        String(responsableComun ?? '')
    )

    if (!sameWaiter) {
      toast.error(
        'Las mesas seleccionadas deben tener ' +
        'el mismo mozo responsable.'
      )

      return null
    }

    if (
      String(idUsuario ?? '') !==
      String(responsableComun ?? '')
    ) {
      toast.error(
        'El mozo del grupo debe coincidir con ' +
        'el responsable de las mesas seleccionadas.'
      )

      return null
    }

    // =========================================
    // VALIDAR MOZO DEL ESTABLECIMIENTO
    // =========================================

    if (idUsuario !== null) {
      if (
        !Number.isInteger(idUsuario) ||
        idUsuario <= 0 ||
        waitersLoading ||
        waitersError ||
        !waiters.some(
          (waiter) =>
            Number(waiter.idUsuario) === idUsuario
        )
      ) {
        toast.error(
          'El mozo responsable no está disponible.'
        )

        return null
      }
    }

    return {
      nombre,
      idSector,
      idsMesas,
      idUsuario,
    }
  }

  // =========================================
  // CREAR O MODIFICAR AGRUPACIÓN
  // =========================================

  const handleSaveGroup = (
    groupData,
    editingIndex = null
  ) => {
    if (!draft) {
      return false
    }

    const validatedGroup = validateGroupData(
      groupData,
      editingIndex
    )

    if (!validatedGroup) {
      return false
    }

    const updated = saveGroup(
      validatedGroup,
      editingIndex
    )

    if (!updated) {
      toast.error(
        'No se pudo aplicar la agrupación.'
      )

      return false
    }

    toast.info(
      editingIndex === null
        ? 'Agrupación creada. Guardá la distribución para confirmar.'
        : 'Agrupación modificada. Guardá la distribución para confirmar.'
    )

    return true
  }

  // =========================================
  // CAMBIAR EL NOMBRE DE UNA AGRUPACIÓN
  // =========================================

  // Esta acción modifica únicamente el borrador.
  //
  // No se ejecuta una API hasta presionar
  // "Guardar cambios" en el plano.

  const handleRenameGroup = (
    groupIndex,
    nombre
  ) => {
    if (
      editorDisabled ||
      !draft
    ) {
      toast.error(
        'No se puede modificar el nombre de la agrupación en este momento.'
      )

      return false
    }

    const index = Number(groupIndex)
    const nuevoNombre = String(
      nombre ?? ''
    ).trim()

    if (
      !Number.isInteger(index) ||
      index < 0 ||
      index >= draft.grupos.length
    ) {
      toast.error(
        'No se encontró la agrupación.'
      )

      return false
    }

    if (
      !nuevoNombre ||
      nuevoNombre.length > 100
    ) {
      toast.error(
        'El nombre debe tener entre 1 y 100 caracteres.'
      )

      return false
    }

    // No actualizar si el nombre no cambió.
    if (
      draft.grupos[index].nombre ===
      nuevoNombre
    ) {
      return true
    }

    const renamed = renameGroup(
      index,
      nuevoNombre
    )

    if (!renamed) {
      toast.error(
        'No se pudo cambiar el nombre de la agrupación.'
      )

      return false
    }

    toast.info(
      'Nombre actualizado. Guardá la distribución para confirmar.'
    )

    return true
  }

  // =========================================
  // DESARMAR AGRUPACIÓN
  // =========================================

  const handleRemoveGroup = (groupIndex) => {
    if (
      editorDisabled ||
      !draft ||
      !Number.isInteger(groupIndex) ||
      groupIndex < 0 ||
      groupIndex >= draft.grupos.length
    ) {
      return
    }

    const grupo = draft.grupos[groupIndex]

    openActionDialog({
      title: 'Desarmar agrupación',

      description:
        `¿Querés desarmar "${grupo.nombre}"? ` +
        'Las mesas físicas se conservarán. ' +
        'El cambio quedará pendiente hasta guardar la distribución.',

      actionLabel: 'Desarmar grupo',
      cancelLabel: 'Cancelar',
      variant: 'danger',
      icon: 'warning',

      onAction: async () => {
        const removed = removeGroup(groupIndex)

        if (removed) {
          toast.info(
            'Agrupación desarmada. ' +
            'Guardá la distribución para confirmar.'
          )
        } else {
          toast.error(
            'No se pudo desarmar la agrupación.'
          )
        }
      },
    })
  }

  // =========================================
  // VALIDAR DISTRIBUCIÓN ANTES DEL PUT
  // =========================================

  const validateDistribution = () => {
    if (!draft) return false

    if (
      draft.version == null ||
      !Array.isArray(draft.mesas) ||
      !Array.isArray(draft.grupos) ||
      !Array.isArray(draft.mozosSectores) ||
      !Array.isArray(draft.mozosMesas)
    ) {
      toast.error(
        'La distribución está incompleta.'
      )

      return false
    }

    // Verificar que las mesas tengan
    // posiciones y estados válidos.

    const validTables = draft.mesas.every(
      (mesa) =>
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

      return false
    }

    // =========================================
    // VALIDAR ASIGNACIONES DE GRUPOS
    // =========================================

    // Una mesa agrupada no puede conservar
    // un mozo individual simultáneamente.

    const groupedIds = new Set(
      draft.grupos.flatMap(
        (grupo) =>
          (grupo.idsMesas ?? []).map(Number)
      )
    )

    const invalidIndividualAssignment =
      draft.mozosMesas.some(
        (assignment) =>
          groupedIds.has(
            Number(assignment.idMesa)
          )
      )

    if (invalidIndividualAssignment) {
      toast.error(
        'Hay mesas agrupadas con una asignación individual de mozo. ' +
        'Revisá la distribución antes de guardar.'
      )

      return false
    }

    // Una misma mesa no puede pertenecer
    // a más de una agrupación.

    const totalGroupedTables =
      draft.grupos.reduce(
        (total, grupo) =>
          total +
          (grupo.idsMesas ?? []).length,
        0
      )

    if (
      groupedIds.size !== totalGroupedTables
    ) {
      toast.error(
        'Una mesa no puede pertenecer a dos agrupaciones.'
      )

      return false
    }

    // =========================================
    // VALIDAR NOMBRES DE AGRUPACIONES
    // =========================================

    const validGroupNames = draft.grupos.every(
      (grupo) => {
        const nombre = String(
          grupo.nombre ?? ''
        ).trim()

        return (
          nombre.length > 0 &&
          nombre.length <= 100
        )
      }
    )

    if (!validGroupNames) {
      toast.error(
        'Hay agrupaciones con nombres inválidos.'
      )

      return false
    }

    return true
  }

  // =========================================
  // GUARDAR DISTRIBUCIÓN
  // =========================================

  const handleSaveDistribution = async () => {
    if (!isDirty || !draft || isSaving) return

    if (hasRemoteChanges) {
      toast.error(
        'La distribución cambió en el servidor. ' +
        'Revisá los cambios antes de volver a guardar.'
      )

      return
    }

    if (!validateDistribution()) {
      return
    }

    // El PUT reemplaza toda la distribución.
    // Se envían posiciones, grupos y asignaciones.

    const payload = structuredClone(draft)

    try {
      const savedConfiguration =
        await updateDistributionMutation.mutateAsync(
          payload
        )

      markSaved(
        payload,
        savedConfiguration.version
      )

      toast.success(
        'Distribución guardada correctamente.'
      )
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
      title: 'Cancelar cambios',

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

  const handleSelectConfiguration = (
    nextId
  ) => {
    const nextConfigurationId =
      String(nextId)

    if (isSaving) return

    if (
      nextConfigurationId ===
      String(selectedConfigurationId ?? '')
    ) {
      return
    }

    if (!isDirty) {
      setSelectedId(nextConfigurationId)
      return
    }

    openActionDialog({
      title: 'Cambios sin guardar',

      description:
        'Tenés modificaciones pendientes en la distribución actual. ' +
        'Si cambiás de configuración, se perderán.',

      actionLabel: 'Salir sin guardar',
      cancelLabel: 'Seguir editando',
      variant: 'danger',
      icon: 'warning',

      onAction: async () => {
        discardChanges()
        setSelectedId(nextConfigurationId)
      },
    })
  }

  // =========================================
  // RECARGAR DISTRIBUCIÓN
  // =========================================

  const handleReloadDistribution = async () => {
    if (isSaving) return

    discardChanges()
    await refetchDistribution()
  }
  
  // =========================================
  // PROTEGER NAVEGACIÓN ENTRE SECCIONES
  // =========================================

  // Interceptamos los cambios de ruta cuando
  // hay modificaciones pendientes o se está
  // guardando la distribución.
  //
  // No bloqueamos cambios de estado dentro
  // de la misma página, como Plano / Lista.

  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      (isDirty || isSaving) &&
      (
        currentLocation.pathname !== nextLocation.pathname ||
        currentLocation.search !== nextLocation.search
      )
  )

  // =========================================
  // CONFIRMAR SALIDA DE MESAS
  // =========================================

  useEffect(() => {
    if (blocker.state !== 'blocked') {
      return
    }

    openActionDialog({
      title: 'Cambios sin guardar',

      description:
        'Tenés modificaciones pendientes en la distribución. ' +
        'Si salís de esta sección sin guardar, se perderán.',

      actionLabel: 'Salir sin guardar',
      cancelLabel: 'Seguir editando',

      variant: 'danger',
      icon: 'warning',

      // Continuar con la ruta que el usuario
      // había seleccionado.
      onAction: () => {
        if (isSaving) {
          toast.warning(
            'Esperá a que termine el guardado antes de salir.'
          )

          blocker.reset()
          return
        }

        // Al salir se desmonta Tables y
        // se descarta su borrador local.
        blocker.proceed()
      },

      // Cancelar conserva el borrador y
      // mantiene al usuario en Mesas.
      onCancel: () => {
        blocker.reset()
      },
    })
  }, [blocker, isSaving, openActionDialog])


  // =========================================
  // ADVERTENCIA AL CERRAR O RECARGAR PESTAÑA
  // =========================================

  useEffect(() => {
    if (!isDirty && !isSaving) {
      return
    }

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

      <DashboardPageHeader
        eyebrow="Operación"
        title="Mesas"
        description="Administrá las mesas y configuraciones de tu establecimiento."
      />

      <div className="mt-5 space-y-4">

        {/* ===================================== */}
        {/* ESPACIO DE MESAS                     */}
        {/* ===================================== */}

        <div className="rounded-2xl border border-mesa-border bg-mesa-surface p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">

            <h2 className="font-display text-lg font-bold text-mesa-text">
              Espacio de mesas
            </h2>

            <div className="flex flex-wrap items-center gap-3">

              <DefaultButton
                type="button"
                variant="secondary"
                onClick={handleOpenCreateSector}
                disabled={
                  isSaving ||
                  isDirty ||
                  hasRemoteChanges
                }
              >
                Nuevo sector
              </DefaultButton>

              <DefaultButton
                type="button"
                onClick={handleOpenCreateTable}
                disabled={!canCreateTable}
              >
                Nueva mesa
              </DefaultButton>

            </div>
          </div>
        </div>

        {/* ===================================== */}
        {/* CONFIGURACIONES                      */}
        {/* ===================================== */}

        <TableConfigurationsSection
          idEstablecimiento={idEstablecimiento}
          configurations={configurations}
          selectedConfiguration={selectedConfiguration}
          activeConfiguration={activeConfiguration}
          onSelectConfiguration={handleSelectConfiguration}
          isLoading={configurationsLoading}
          isError={configurationsError}
          onRetry={refetchConfigurations}
          distributionVersion={draft?.version}
          isDirty={isDirty}
          isDistributionSaving={isSaving}
        />

        {/* ===================================== */}
        {/* PLANO Y LISTA                        */}
        {/* ===================================== */}

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
          distribution={editedDistribution}
          distributionLoading={distributionLoading}
          distributionError={distributionError}

          onMoveTable={moveTable}
          onMoveTableToSector={handleMoveTableToSector}
          onMoveGroupToSector={handleMoveGroupToSector}

          isDirty={isDirty}
          hasRemoteChanges={hasRemoteChanges}
          isDistributionSaving={isSaving}

          onSaveDistribution={handleSaveDistribution}
          onCancelDistribution={handleDiscardChanges}
          onReloadDistribution={handleReloadDistribution}

          editorDisabled={editorDisabled}

          createSectorOpen={createSectorOpen}
          onCloseCreateSector={() =>
            setCreateSectorOpen(false)
          }

          createTableOpen={createTableOpen}
          onCloseCreateTable={() =>
            setCreateTableOpen(false)
          }

          waiters={waiters}
          waitersLoading={waitersLoading}
          waitersError={waitersError}
          onRetryWaiters={refetchWaiters}

          onSetSectorWaiter={handleSetSectorWaiter}
          onSetTableWaiter={handleSetTableWaiter}

          onSaveGroup={handleSaveGroup}
          onRenameGroup={handleRenameGroup}
          onRemoveGroup={handleRemoveGroup}
        />

      </div>
    </section>
  )
}

export default Tables
