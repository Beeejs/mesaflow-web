
import { useEffect, useMemo, useState } from 'react'

// =========================================
// CONSTANTES DEL PLANO
// =========================================

// Separación relativa entre mesas del mismo grupo.
// Las coordenadas siguen siendo individuales
// para que el backend no necesite un modelo nuevo.
const GROUP_STEP_X = 0.13
const GROUP_STEP_Y = 0.19
const GROUP_MAX_COLUMNS = 3

const clone = (value) => structuredClone(value)

const clampPosition = (value, fallback = 0.5) => {
  const number = Number(value)

  if (!Number.isFinite(number)) {
    return fallback
  }

  return Math.min(1, Math.max(0, number))
}

// =========================================
// NORMALIZAR DISTRIBUCIÓN
// =========================================

// Convierte la respuesta del backend al formato
// esperado por el PUT de distribución.
const normalizeDistribution = (distribution) => {
  if (!distribution) return null

  return {
    version: distribution.version,

    mesas: (distribution.mesas ?? []).map((mesa) => ({
      idMesa: mesa.idMesa,
      idSector: mesa.idSector,
      posicionX: mesa.posicionX,
      posicionY: mesa.posicionY,
      activa: mesa.activa,
    })),

    grupos: (distribution.grupos ?? []).map((grupo) => ({
      nombre: grupo.nombre,
      idSector: grupo.idSector,
      idsMesas: [...(grupo.idsMesas ?? [])],
      idUsuario: grupo.idUsuario ?? null,
    })),

    mozosSectores: (
      distribution.mozosSectores ?? []
    ).map((assignment) => ({
      idSector: assignment.idSector,
      idUsuario: assignment.idUsuario,
    })),

    mozosMesas: (
      distribution.mozosMesas ?? []
    ).map((assignment) => ({
      idMesa: assignment.idMesa,
      idUsuario: assignment.idUsuario,
    })),
  }
}

// =========================================
// ASIGNACIONES DE MOZOS
// =========================================

// Actualiza o elimina una asignación de mozo.
// Si idUsuario es null, se quita la asignación.
const updateWaiterAssignment = (
  assignments,
  key,
  entityId,
  idUsuario
) => {
  const entityNumber = Number(entityId)

  if (
    !Number.isInteger(entityNumber) ||
    entityNumber <= 0
  ) {
    return assignments
  }

  const userNumber =
    idUsuario == null || idUsuario === ''
      ? null
      : Number(idUsuario)

  if (
    userNumber !== null &&
    (!Number.isInteger(userNumber) || userNumber <= 0)
  ) {
    return assignments
  }

  const existing = assignments.find(
    (item) => Number(item[key]) === entityNumber
  )

  const existingUserId =
    existing?.idUsuario == null
      ? null
      : Number(existing.idUsuario)

  // Evitar modificaciones cuando el valor no cambió.
  if (existingUserId === userNumber) {
    return assignments
  }

  const remaining = assignments.filter(
    (item) => Number(item[key]) !== entityNumber
  )

  if (userNumber === null) {
    return remaining
  }

  return [
    ...remaining,
    {
      [key]: entityNumber,
      idUsuario: userNumber,
    },
  ]
}

// =========================================
// UTILIDADES DE AGRUPACIONES
// =========================================

// Busca el grupo al que pertenece una mesa.
const findGroupIndexByTable = (currentDraft, idMesa) =>
  (currentDraft.grupos ?? []).findIndex(
    (grupo) =>
      (grupo.idsMesas ?? []).some(
        (id) => Number(id) === Number(idMesa)
      )
  )

// Responsable efectivo de una mesa.
//
// Prioridad:
// 1. Mozo del grupo.
// 2. Mozo individual cuando no está agrupada.
// 3. Mozo del sector.
// 4. Sin mozo.
const getEffectiveWaiterId = (currentDraft, idMesa) => {
  const mesa = currentDraft.mesas.find(
    (item) => Number(item.idMesa) === Number(idMesa)
  )

  if (!mesa) return undefined

  const sectorWaiter = currentDraft.mozosSectores.find(
    (item) =>
      Number(item.idSector) === Number(mesa.idSector)
  )

  const groupIndex = findGroupIndexByTable(
    currentDraft,
    idMesa
  )

  if (groupIndex >= 0) {
    const group = currentDraft.grupos[groupIndex]

    return (
      group.idUsuario ??
      sectorWaiter?.idUsuario ??
      null
    )
  }

  const individualWaiter = currentDraft.mozosMesas.find(
    (item) => Number(item.idMesa) === Number(idMesa)
  )

  return (
    individualWaiter?.idUsuario ??
    sectorWaiter?.idUsuario ??
    null
  )
}

// =========================================
// DISTRIBUCIÓN COMPACTA DEL GRUPO
// =========================================

// Al crear un grupo o modificar sus integrantes,
// las mesas se organizan una al lado de la otra.
//
// Esta función modifica las coordenadas reales
// del borrador, no solamente su representación.
//
// El plano se encarga de dibujar el contorno
// y la etiqueta del grupo.
const arrangeGroupTables = (mesas, group) => {
  const ids = (group.idsMesas ?? []).map(Number)

  if (ids.length < 2) {
    return mesas
  }

  const grouped = ids
    .map((id) =>
      mesas.find(
        (mesa) => Number(mesa.idMesa) === id
      )
    )
    .filter(Boolean)

  if (grouped.length !== ids.length) {
    return mesas
  }

  const columns = Math.min(
    GROUP_MAX_COLUMNS,
    grouped.length
  )

  const rows = Math.ceil(grouped.length / columns)

  // El conjunto se organiza alrededor de la
  // posición original de la primera mesa.
  const first = grouped[0]

  const centerX = clampPosition(first.posicionX)
  const centerY = clampPosition(first.posicionY)

  const width = (columns - 1) * GROUP_STEP_X
  const height = (rows - 1) * GROUP_STEP_Y

  // Ajustar la posición para que ninguna mesa
  // quede fuera del rango normalizado.
  const left = Math.min(
    Math.max(centerX - width / 2, 0),
    Math.max(0, 1 - width)
  )

  const top = Math.min(
    Math.max(centerY - height / 2, 0),
    Math.max(0, 1 - height)
  )

  const positionsById = new Map()

  grouped.forEach((mesa, index) => {
    const column = index % columns
    const row = Math.floor(index / columns)

    positionsById.set(Number(mesa.idMesa), {
      posicionX: clampPosition(
        left + column * GROUP_STEP_X
      ),
      posicionY: clampPosition(
        top + row * GROUP_STEP_Y
      ),
    })
  })

  return mesas.map((mesa) => {
    const position = positionsById.get(
      Number(mesa.idMesa)
    )

    return position
      ? { ...mesa, ...position }
      : mesa
  })
}

// =========================================
// TRASLADAR LAS MESAS DE UN GRUPO
// =========================================

// Calcula el desplazamiento del conjunto
// a partir de la mesa utilizada para arrastrar.
//
// Se conserva la posición relativa entre
// todas las integrantes.
//
// Los límites se calculan para el grupo
// completo, no para una mesa individual.
const translateGroup = (
  mesas,
  group,
  draggedTableId,
  nextX,
  nextY
) => {
  const ids = new Set(
    (group.idsMesas ?? []).map(Number)
  )

  const members = mesas.filter(
    (mesa) => ids.has(Number(mesa.idMesa))
  )

  const dragged = members.find(
    (mesa) =>
      Number(mesa.idMesa) === Number(draggedTableId)
  )

  if (!dragged || members.length < 2) {
    return mesas
  }

  const minX = Math.min(
    ...members.map((mesa) => Number(mesa.posicionX))
  )

  const maxX = Math.max(
    ...members.map((mesa) => Number(mesa.posicionX))
  )

  const minY = Math.min(
    ...members.map((mesa) => Number(mesa.posicionY))
  )

  const maxY = Math.max(
    ...members.map((mesa) => Number(mesa.posicionY))
  )

  const requestedDx =
    nextX - Number(dragged.posicionX)

  const requestedDy =
    nextY - Number(dragged.posicionY)

  const dx = Math.max(
    -minX,
    Math.min(1 - maxX, requestedDx)
  )

  const dy = Math.max(
    -minY,
    Math.min(1 - maxY, requestedDy)
  )

  if (dx === 0 && dy === 0) {
    return mesas
  }

  return mesas.map((mesa) => {
    if (!ids.has(Number(mesa.idMesa))) {
      return mesa
    }

    return {
      ...mesa,
      posicionX: clampPosition(
        Number(mesa.posicionX) + dx
      ),
      posicionY: clampPosition(
        Number(mesa.posicionY) + dy
      ),
    }
  })
}

// =========================================
// CALCULAR DESTINO DE UN GRUPO
// =========================================

// Se utiliza al cambiar un grupo completo
// de sector.
//
// A diferencia de translateGroup, esta
// función también actualiza idSector.
//
// La posición relativa del conjunto se
// mantiene incluso al soltar el grupo
// cerca de un borde del sector destino.
const moveGroupTablesToSector = (
  mesas,
  group,
  draggedTableId,
  destinationSectorId,
  nextPosition
) => {
  const ids = new Set(
    (group.idsMesas ?? []).map(Number)
  )

  const members = mesas.filter(
    (mesa) => ids.has(Number(mesa.idMesa))
  )

  const dragged = members.find(
    (mesa) =>
      Number(mesa.idMesa) ===
      Number(draggedTableId)
  )

  if (
    !dragged ||
    members.length !== ids.size ||
    members.length < 2
  ) {
    return null
  }

  // Trabajamos con coordenadas normalizadas.
  // La mesa que originó el arrastre sirve
  // como punto de referencia para el destino.
  const draggedX = Number(dragged.posicionX)
  const draggedY = Number(dragged.posicionY)

  const positions = members.map((mesa) => ({
    idMesa: Number(mesa.idMesa),
    x: Number(mesa.posicionX),
    y: Number(mesa.posicionY),
  }))

  if (
    !positions.every(
      (position) =>
        Number.isFinite(position.x) &&
        Number.isFinite(position.y)
    )
  ) {
    return null
  }

  const minX = Math.min(
    ...positions.map((position) => position.x)
  )

  const maxX = Math.max(
    ...positions.map((position) => position.x)
  )

  const minY = Math.min(
    ...positions.map((position) => position.y)
  )

  const maxY = Math.max(
    ...positions.map((position) => position.y)
  )

  const targetX = clampPosition(
    nextPosition?.x,
    0.5
  )

  const targetY = clampPosition(
    nextPosition?.y,
    0.5
  )

  // Desplazamiento solicitado.
  const requestedDx = targetX - draggedX
  const requestedDy = targetY - draggedY

  // Desplazamiento permitido para que
  // todas las mesas permanezcan entre 0 y 1.
  const dx = Math.max(
    -minX,
    Math.min(1 - maxX, requestedDx)
  )

  const dy = Math.max(
    -minY,
    Math.min(1 - maxY, requestedDy)
  )

  return mesas.map((mesa) => {
    if (!ids.has(Number(mesa.idMesa))) {
      return mesa
    }

    return {
      ...mesa,

      // Todas las integrantes pasan
      // al mismo sector.
      idSector: destinationSectorId,

      // Conservar la forma del conjunto.
      posicionX: clampPosition(
        Number(mesa.posicionX) + dx
      ),

      posicionY: clampPosition(
        Number(mesa.posicionY) + dy
      ),
    }
  })
}

// =========================================
// HOOK PRINCIPAL
// =========================================

const useTableDistributionDraft = (
  distribution,
  idConfiguracionMesa
) => {
  const configurationId =
    idConfiguracionMesa == null
      ? null
      : Number(idConfiguracionMesa)

  const [snapshot, setSnapshot] = useState({
    configurationId: null,
    baseline: null,
    draft: null,
  })

  const incoming = useMemo(() => {
    if (
      !distribution ||
      Number(distribution.idConfiguracionMesa) !==
        configurationId
    ) {
      return null
    }

    return normalizeDistribution(distribution)
  }, [distribution, configurationId])

  const belongsToSelection =
    snapshot.configurationId === configurationId

  const baseline = belongsToSelection
    ? snapshot.baseline
    : null

  const draft = belongsToSelection
    ? snapshot.draft
    : null

  const isDirty =
    baseline != null &&
    draft != null &&
    JSON.stringify(baseline) !== JSON.stringify(draft)

  // =========================================
  // SINCRONIZAR CON EL BACKEND
  // =========================================

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSnapshot((current) => {
      if (current.configurationId !== configurationId) {
        return {
          configurationId,
          baseline: incoming ? clone(incoming) : null,
          draft: incoming ? clone(incoming) : null,
        }
      }

      if (!incoming) {
        return current
      }

      const currentDirty =
        current.baseline != null &&
        current.draft != null &&
        JSON.stringify(current.baseline) !==
          JSON.stringify(current.draft)

      // No pisar modificaciones locales.
      if (currentDirty) {
        return current
      }

      if (
        JSON.stringify(current.baseline) ===
        JSON.stringify(incoming)
      ) {
        return current
      }

      return {
        configurationId,
        baseline: clone(incoming),
        draft: clone(incoming),
      }
    })
  }, [configurationId, incoming])

  // El servidor cambió la versión mientras editábamos.
  const hasRemoteChanges =
    isDirty &&
    incoming?.version != null &&
    baseline?.version != null &&
    incoming.version !== baseline.version

  // =========================================
  // MOVER MESAS INDIVIDUALES O AGRUPADAS
  // =========================================

  const moveTable = (idMesa, posicionX, posicionY) => {
    if (
      !Number.isFinite(posicionX) ||
      !Number.isFinite(posicionY)
    ) {
      return false
    }

    if (
      !draft?.mesas?.some(
        (mesa) => Number(mesa.idMesa) === Number(idMesa)
      )
    ) {
      return false
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft
      ) {
        return current
      }

      const groupIndex = findGroupIndexByTable(
        current.draft,
        idMesa
      )

      let mesas

      if (groupIndex >= 0) {
        // Arrastrar una integrante mueve todo el grupo.
        mesas = translateGroup(
          current.draft.mesas,
          current.draft.grupos[groupIndex],
          idMesa,
          posicionX,
          posicionY
        )
      } else {
        // Mesa sin agrupar: movimiento individual.
        mesas = current.draft.mesas.map((mesa) =>
          Number(mesa.idMesa) === Number(idMesa)
            ? {
                ...mesa,
                posicionX: clampPosition(posicionX),
                posicionY: clampPosition(posicionY),
              }
            : mesa
        )
      }

      if (mesas === current.draft.mesas) {
        return current
      }

      return {
        ...current,
        draft: {
          ...current.draft,
          mesas,
        },
      }
    })

    return true
  }

  // =========================================
  // CAMBIAR UNA MESA INDIVIDUAL DE SECTOR
  // =========================================

  const moveTableToSector = (
    idMesa,
    idSector,
    nextPosition = null
  ) => {
    const sectorId = Number(idSector)

    if (!Number.isInteger(sectorId) || sectorId <= 0) {
      return false
    }

    if (!draft) {
      return false
    }

    // No permitir mover solamente una integrante
    // de un grupo a otro sector.
    if (findGroupIndexByTable(draft, idMesa) >= 0) {
      return false
    }

    const mesaExists = draft.mesas.some(
      (mesa) => Number(mesa.idMesa) === Number(idMesa)
    )

    if (!mesaExists) {
      return false
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft
      ) {
        return current
      }

      // Validar nuevamente contra el estado actual.
      if (
        findGroupIndexByTable(current.draft, idMesa) >= 0
      ) {
        return current
      }

      const mesas = current.draft.mesas.map((mesa) => {
        if (Number(mesa.idMesa) !== Number(idMesa)) {
          return mesa
        }

        return {
          ...mesa,
          idSector: sectorId,
          posicionX:
            nextPosition !== null
              ? clampPosition(nextPosition.x)
              : 0.5,
          posicionY:
            nextPosition !== null
              ? clampPosition(nextPosition.y)
              : 0.5,
        }
      })

      return {
        ...current,
        draft: {
          ...current.draft,
          mesas,
        },
      }
    })

    return true
  }

  // =========================================
  // CAMBIAR UN GRUPO COMPLETO DE SECTOR
  // =========================================

  // idMesa:
  // Cualquiera de las mesas del grupo que
  // se utilizó para iniciar el arrastre.
  //
  // idSector:
  // Sector al que queremos trasladar el grupo.
  //
  // nextPosition:
  // { x, y } normalizadas en el sector destino.
  //
  // No se realiza ninguna petición HTTP.
  // El cambio se aplica al borrador React.
  const moveGroupToSector = (
    idMesa,
    idSector,
    nextPosition = null
  ) => {
    const destinationSectorId = Number(idSector)

    if (
      !Number.isInteger(destinationSectorId) ||
      destinationSectorId <= 0 ||
      !draft
    ) {
      return false
    }

    // Debe tratarse de una mesa agrupada.
    const groupIndex = findGroupIndexByTable(
      draft,
      idMesa
    )

    if (groupIndex < 0) {
      return false
    }

    const group = draft.grupos[groupIndex]

    // Si el grupo ya está en el sector indicado,
    // no necesitamos trasladarlo.
    if (
      Number(group.idSector) === destinationSectorId
    ) {
      return false
    }

    // Verificar que el grupo tenga integrantes
    // y que todas estén en su sector actual.
    const ids = (group.idsMesas ?? []).map(Number)

    if (
      ids.length < 2 ||
      new Set(ids).size !== ids.length
    ) {
      return false
    }

    const validMembers = ids.every((id) =>
      draft.mesas.some(
        (mesa) =>
          Number(mesa.idMesa) === id &&
          Number(mesa.idSector) === Number(group.idSector)
      )
    )

    if (!validMembers) {
      return false
    }

    // Calcular antes de actualizar para evitar
    // responder éxito si los datos son inválidos.
    const initialMesas = moveGroupTablesToSector(
      draft.mesas,
      group,
      idMesa,
      destinationSectorId,
      nextPosition
    )

    if (!initialMesas) {
      return false
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft
      ) {
        return current
      }

      // Volver a comprobar la agrupación usando
      // el borrador más reciente.
      const currentGroupIndex = findGroupIndexByTable(
        current.draft,
        idMesa
      )

      if (currentGroupIndex < 0) {
        return current
      }

      const currentGroup =
        current.draft.grupos[currentGroupIndex]

      if (
        Number(currentGroup.idSector) ===
        destinationSectorId
      ) {
        return current
      }

      const mesas = moveGroupTablesToSector(
        current.draft.mesas,
        currentGroup,
        idMesa,
        destinationSectorId,
        nextPosition
      )

      if (!mesas) {
        return current
      }

      // Mover la agrupación y sus integrantes
      // al mismo sector.
      //
      // El nombre, los ids de las mesas y el
      // responsable propio no se modifican.
      //
      // Si idUsuario es null, el grupo seguirá
      // heredando el mozo del sector, que ahora
      // será el sector de destino.
      const grupos = current.draft.grupos.map(
        (item, index) =>
          index === currentGroupIndex
            ? {
                ...item,
                idSector: destinationSectorId,
              }
            : item
      )

      return {
        ...current,
        draft: {
          ...current.draft,
          mesas,
          grupos,
        },
      }
    })

    return true
  }

  // =========================================
  // ASIGNACIÓN DE MOZOS POR SECTOR
  // =========================================

  const setSectorWaiter = (idSector, idUsuario) => {
    const sectorId = Number(idSector)

    if (
      !draft ||
      !Number.isInteger(sectorId) ||
      sectorId <= 0
    ) {
      return false
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft
      ) {
        return current
      }

      const nextAssignments = updateWaiterAssignment(
        current.draft.mozosSectores,
        'idSector',
        idSector,
        idUsuario
      )

      if (
        nextAssignments === current.draft.mozosSectores
      ) {
        return current
      }

      return {
        ...current,
        draft: {
          ...current.draft,
          mozosSectores: nextAssignments,
        },
      }
    })

    return true
  }

  // =========================================
  // ASIGNACIÓN DE MOZOS POR MESA
  // =========================================

  const setTableWaiter = (idMesa, idUsuario) => {
    if (!draft) return false

    const mesaExists = draft.mesas.some(
      (mesa) => Number(mesa.idMesa) === Number(idMesa)
    )

    if (!mesaExists) return false

    // Las mesas agrupadas se administran
    // mediante la asignación del grupo.
    if (
      findGroupIndexByTable(draft, idMesa) >= 0 &&
      idUsuario != null &&
      idUsuario !== ''
    ) {
      return false
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft
      ) {
        return current
      }

      if (
        findGroupIndexByTable(current.draft, idMesa) >= 0 &&
        idUsuario != null &&
        idUsuario !== ''
      ) {
        return current
      }

      const nextAssignments = updateWaiterAssignment(
        current.draft.mozosMesas,
        'idMesa',
        idMesa,
        idUsuario
      )

      if (
        nextAssignments === current.draft.mozosMesas
      ) {
        return current
      }

      return {
        ...current,
        draft: {
          ...current.draft,
          mozosMesas: nextAssignments,
        },
      }
    })

    return true
  }

  // =========================================
  // VALIDAR AGRUPACIONES
  // =========================================

  const validateGroup = (
    currentDraft,
    groupData,
    editingIndex = null
  ) => {
    if (!currentDraft || !groupData) {
      return null
    }

    const nombre = String(
      groupData.nombre ?? ''
    ).trim()

    const idSector = Number(groupData.idSector)

    const idsMesas = (
      groupData.idsMesas ?? []
    ).map(Number)

    const idUsuario =
      groupData.idUsuario == null ||
      groupData.idUsuario === ''
        ? null
        : Number(groupData.idUsuario)

    if (!nombre || nombre.length > 100) {
      return null
    }

    if (
      !Number.isInteger(idSector) ||
      idSector <= 0
    ) {
      return null
    }

    if (
      idsMesas.length < 2 ||
      idsMesas.some(
        (id) => !Number.isInteger(id) || id <= 0
      ) ||
      new Set(idsMesas).size !== idsMesas.length
    ) {
      return null
    }

    if (
      editingIndex !== null &&
      (
        !Number.isInteger(editingIndex) ||
        editingIndex < 0 ||
        editingIndex >= currentDraft.grupos.length
      )
    ) {
      return null
    }

    if (
      idUsuario !== null &&
      (
        !Number.isInteger(idUsuario) ||
        idUsuario <= 0
      )
    ) {
      return null
    }

    // Todas las mesas deben existir, estar
    // habilitadas y pertenecer al mismo sector.
    const validTables = idsMesas.every((idMesa) =>
      currentDraft.mesas.some(
        (mesa) =>
          Number(mesa.idMesa) === idMesa &&
          Number(mesa.idSector) === idSector &&
          mesa.activa === true
      )
    )

    if (!validTables) {
      return null
    }

    // Una mesa no puede pertenecer a dos grupos.
    const alreadyGrouped = currentDraft.grupos.some(
      (grupo, index) =>
        index !== editingIndex &&
        (grupo.idsMesas ?? []).some(
          (id) => idsMesas.includes(Number(id))
        )
    )

    if (alreadyGrouped) {
      return null
    }

    // Todas las mesas deben tener el mismo
    // responsable efectivo.
    const responsibleIds = idsMesas.map(
      (idMesa) =>
        getEffectiveWaiterId(currentDraft, idMesa)
    )

    const commonWaiter = responsibleIds[0]

    if (
      commonWaiter === undefined ||
      responsibleIds.some(
        (id) =>
          id === undefined ||
          String(id ?? '') !==
            String(commonWaiter ?? '')
      )
    ) {
      return null
    }

    const expectedWaiterId =
      commonWaiter == null
        ? null
        : Number(commonWaiter)

    if (
      String(idUsuario ?? '') !==
      String(expectedWaiterId ?? '')
    ) {
      return null
    }

    return {
      nombre,
      idSector,
      idsMesas,
      idUsuario: expectedWaiterId,
    }
  }

  // =========================================
  // CREAR O EDITAR AGRUPACIÓN
  // =========================================

  // editingIndex === null: crear grupo.
  // editingIndex numérico: editar grupo existente.
  //
  // El índice identifica el grupo dentro
  // del borrador, no el idGrupo del backend.
  const saveGroup = (
    groupData,
    editingIndex = null
  ) => {
    if (!draft) return false

    const validatedGroup = validateGroup(
      draft,
      groupData,
      editingIndex
    )

    if (!validatedGroup) {
      return false
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft
      ) {
        return current
      }

      // Volver a validar contra el estado más reciente.
      const group = validateGroup(
        current.draft,
        groupData,
        editingIndex
      )

      if (!group) {
        return current
      }

      const grupos = [...current.draft.grupos]

      const previousGroup =
        editingIndex === null
          ? null
          : grupos[editingIndex]

      if (editingIndex === null) {
        grupos.push(group)
      } else {
        grupos[editingIndex] = group
      }

      // El backend no admite asignaciones
      // individuales en mesas agrupadas.
      //
      // Al crear un grupo, las asignaciones de sus
      // integrantes quedan reemplazadas por el
      // responsable común del grupo.
      const groupedIds = new Set(group.idsMesas)

      const mozosMesas = current.draft.mozosMesas.filter(
        (assignment) =>
          !groupedIds.has(Number(assignment.idMesa))
      )

      // Si solo cambió el nombre o el mozo, no
      // modificamos las posiciones existentes.
      const sameMembers =
        previousGroup !== null &&
        previousGroup.idsMesas.length ===
          group.idsMesas.length &&
        previousGroup.idsMesas.every(
          (id, index) =>
            Number(id) ===
            Number(group.idsMesas[index])
        )

      // Al crear o cambiar integrantes,
      // las mesas se acomodan físicamente juntas.
      const mesas = sameMembers
        ? current.draft.mesas
        : arrangeGroupTables(
            current.draft.mesas,
            group
          )

      return {
        ...current,
        draft: {
          ...current.draft,
          mesas,
          grupos,
          mozosMesas,
        },
      }
    })

    return true
  }

  // =========================================
  // RENOMBRAR GRUPO
  // =========================================

  // Permite cambiar solamente el nombre sin
  // volver a seleccionar las mesas del grupo.
  //
  // Se utiliza desde "Editar mesa".
  // Queda pendiente en el borrador hasta
  // guardar la distribución completa.
  const renameGroup = (groupIndex, nombre) => {
    const index = Number(groupIndex)
    const newName = String(nombre ?? '').trim()

    if (
      !draft ||
      !Number.isInteger(index) ||
      index < 0 ||
      index >= draft.grupos.length ||
      !newName ||
      newName.length > 100
    ) {
      return false
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft ||
        index >= current.draft.grupos.length
      ) {
        return current
      }

      const existing = current.draft.grupos[index]

      if (existing.nombre === newName) {
        return current
      }

      return {
        ...current,
        draft: {
          ...current.draft,
          grupos: current.draft.grupos.map(
            (group, currentIndex) =>
              currentIndex === index
                ? { ...group, nombre: newName }
                : group
          ),
        },
      }
    })

    return true
  }

  // =========================================
  // DESARMAR AGRUPACIÓN
  // =========================================

  const removeGroup = (groupIndex) => {
    if (
      !draft ||
      !Number.isInteger(groupIndex) ||
      groupIndex < 0 ||
      groupIndex >= draft.grupos.length
    ) {
      return false
    }

    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.draft ||
        groupIndex >= current.draft.grupos.length
      ) {
        return current
      }

      // Desarmar un grupo no elimina las mesas
      // ni modifica sus posiciones físicas.
      return {
        ...current,
        draft: {
          ...current.draft,
          grupos: current.draft.grupos.filter(
            (_, index) => index !== groupIndex
          ),
        },
      }
    })

    return true
  }

  // =========================================
  // DESCARTAR CAMBIOS
  // =========================================

  // Volver a la última versión confirmada.
  const discardChanges = () => {
    setSnapshot((current) => {
      if (
        current.configurationId !== configurationId ||
        !current.baseline
      ) {
        return current
      }

      return {
        ...current,
        draft: clone(current.baseline),
      }
    })
  }

  // =========================================
  // CONFIRMAR GUARDADO
  // =========================================

  // Confirmar que un borrador fue guardado.
  const markSaved = (savedDraft, newVersion) => {
    if (newVersion == null) return

    setSnapshot((current) => {
      if (current.configurationId !== configurationId) {
        return current
      }

      const saved = {
        ...clone(savedDraft),
        version: newVersion,
      }

      return {
        ...current,
        baseline: clone(saved),
        draft: clone(saved),
      }
    })
  }

  return {
    draft,
    baseline,
    isDirty,
    hasRemoteChanges,

    // Posiciones y sectores
    moveTable,
    moveTableToSector,
    moveGroupToSector,

    // Mozos
    setSectorWaiter,
    setTableWaiter,

    // Agrupaciones
    saveGroup,
    renameGroup,
    removeGroup,

    // Persistencia del borrador
    discardChanges,
    markSaved,
  }
}

export default useTableDistributionDraft
