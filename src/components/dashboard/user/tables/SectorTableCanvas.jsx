
import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

import LinkIcon from '@mui/icons-material/Link'
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined'

// =========================================
// CONSTANTES
// =========================================

const TABLE_WIDTH = 64
const TABLE_HEIGHT = 56
const TABLE_GAP = 16

const GROUP_PADDING = 9

const DRAG_THRESHOLD = 4
const KEYBOARD_STEP = 0.025
const KEYBOARD_FAST_STEP = 0.1

// =========================================
// UTILIDADES
// =========================================

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

const normalizePosition = (value) => {
  if (value == null || value === '') {
    return 0.5
  }

  const number = Number(value)

  return Number.isFinite(number)
    ? clamp(number)
    : 0.5
}

// =========================================
// POSICIONES VISUALES
// =========================================

// Cuando dos mesas tienen exactamente las mismas
// coordenadas, las separamos visualmente.
//
// Esto evita que las mesas recién creadas
// aparezcan completamente superpuestas.
//
// No modifica el borrador ni el backend.

const buildVisualPositions = (
  mesas,
  width,
  height
) => {
  const positions = new Map()
  const coincidences = new Map()

  for (const mesa of mesas) {
    const x = normalizePosition(mesa.posicionX)
    const y = normalizePosition(mesa.posicionY)

    const key =
      `${x.toFixed(5)}:${y.toFixed(5)}`

    if (!coincidences.has(key)) {
      coincidences.set(key, [])
    }

    coincidences.get(key).push(mesa)
  }

  const stepX = TABLE_WIDTH + TABLE_GAP
  const stepY = TABLE_HEIGHT + TABLE_GAP

  const maxColumns = Math.max(
    1,
    Math.floor(
      (width + TABLE_GAP) / stepX
    )
  )

  for (const group of coincidences.values()) {
    const sorted = [...group].sort(
      (a, b) =>
        Number(a.idMesa) - Number(b.idMesa)
    )

    const originalX = normalizePosition(
      sorted[0].posicionX
    )

    const originalY = normalizePosition(
      sorted[0].posicionY
    )

    if (sorted.length === 1) {
      positions.set(
        Number(sorted[0].idMesa),
        {
          x: originalX,
          y: originalY,
          overlapping: false,
        }
      )

      continue
    }

    const columns = Math.min(
      maxColumns,
      Math.ceil(Math.sqrt(sorted.length))
    )

    const rows = Math.ceil(
      sorted.length / columns
    )

    const groupWidth =
      (columns - 1) * stepX

    const groupHeight =
      (rows - 1) * stepY

    const marginX = TABLE_WIDTH / 2
    const marginY = TABLE_HEIGHT / 2

    const startX = clamp(
      originalX * width - groupWidth / 2,
      marginX,
      Math.max(
        marginX,
        width - marginX - groupWidth
      )
    )

    const startY = clamp(
      originalY * height - groupHeight / 2,
      marginY,
      Math.max(
        marginY,
        height - marginY - groupHeight
      )
    )

    sorted.forEach((mesa, index) => {
      const column = index % columns

      const row = Math.floor(
        index / columns
      )

      positions.set(
        Number(mesa.idMesa),
        {
          x: clamp(
            (startX + column * stepX) /
              Math.max(width, 1)
          ),
          y: clamp(
            (startY + row * stepY) /
              Math.max(height, 1)
          ),
          overlapping: true,
        }
      )
    })
  }

  return positions
}

// =========================================
// IDENTIFICAR SECTOR DE DESTINO
// =========================================

// Permite soltar una mesa o agrupación en otro
// sector incluso cuando el puntero está capturado.

const getSectorDropTarget = (
  clientX,
  clientY
) => {
  const elements = document.querySelectorAll(
    '[data-sector-drop-id]'
  )

  for (const element of elements) {
    const rect =
      element.getBoundingClientRect()

    const inside =
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom

    if (inside) {
      return {
        sectorId:
          element.dataset.sectorDropId,
        rect,
      }
    }
  }

  return null
}

// =========================================
// POSICIÓN AL SOLTAR
// =========================================

const getPositionInRect = (
  clientX,
  clientY,
  dragData,
  rect
) => {
  if (
    !rect?.width ||
    !rect?.height
  ) {
    return null
  }

  const centerX =
    clientX -
    dragData.offsetX -
    rect.left

  const centerY =
    clientY -
    dragData.offsetY -
    rect.top

  const marginX = Math.min(
    TABLE_WIDTH / 2 / rect.width,
    0.5
  )

  const marginY = Math.min(
    TABLE_HEIGHT / 2 / rect.height,
    0.5
  )

  return {
    x: clamp(
      centerX / rect.width,
      marginX,
      1 - marginX
    ),
    y: clamp(
      centerY / rect.height,
      marginY,
      1 - marginY
    ),
  }
}

// =========================================
// IDENTIDAD VISUAL DE MOZOS
// =========================================

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

const getWaiterName = (waiter) =>
  [waiter?.nombre, waiter?.apellido]
    .filter(Boolean)
    .join(' ') ||
  waiter?.email ||
  'Mozo no disponible'

const getWaiterInitial = (waiter) =>
  String(
    waiter?.nombre ||
    waiter?.apellido ||
    waiter?.email ||
    '?'
  )
    .charAt(0)
    .toUpperCase()

// =========================================
// COMPONENTE PRINCIPAL
// =========================================

const SectorTableCanvas = ({
  idSector,
  mesas = [],
  physicalTablesById,

  onMoveTable,
  onMoveTableToSector,
  onMoveGroupToSector,
  onEditTable,
  onHoverSector,

  hoveredSectorId = null,
  disabled = false,

  // Mozos y asignaciones actuales.
  waiters = [],
  sectorWaiterId = null,
  tableWaiters = [],

  // Agrupaciones administradas desde
  // SectorsSection.
  groups = [],

  // Modo selección de integrantes.
  groupingMode = false,
  selectedGroupTableIds = [],
  selectableGroupTableIds = [],
  onToggleGroupTable,
  editingGroupIndex = null,
}) => {
  // =========================================
  // REFERENCIAS Y ESTADOS
  // =========================================

  const canvasRef = useRef(null)
  const interactionRef = useRef(null)
  const cleanupListenersRef = useRef(null)

  const [draggingMesaId, setDraggingMesaId] =
    useState(null)

  const [dragPreview, setDragPreview] =
    useState(null)

  const [dimensions, setDimensions] = useState({
    width: 400,
    height: 380,
  })

  const isDropTarget =
    hoveredSectorId !== null &&
    String(hoveredSectorId) ===
      String(idSector)

  // =========================================
  // MOZOS POR ID
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

  const tableWaitersById = useMemo(
    () =>
      new Map(
        tableWaiters.map((assignment) => [
          Number(assignment.idMesa),
          assignment.idUsuario,
        ])
      ),
    [tableWaiters]
  )

  // =========================================
  // AGRUPACIONES POR MESA
  // =========================================

  const groupsByTableId = useMemo(() => {
    const result = new Map()

    groups.forEach((group) => {
      (group.idsMesas ?? []).forEach(
        (idMesa) => {
          result.set(
            Number(idMesa),
            group
          )
        }
      )
    })

    return result
  }, [groups])

  const selectedTableIds = useMemo(
    () =>
      new Set(
        selectedGroupTableIds.map(Number)
      ),
    [selectedGroupTableIds]
  )

  const selectableIds = useMemo(
    () =>
      new Set(
        selectableGroupTableIds.map(Number)
      ),
    [selectableGroupTableIds]
  )

  // =========================================
  // MEDIR EL PLANO
  // =========================================

  useEffect(() => {
    const element = canvasRef.current

    if (!element) {
      return
    }

    const updateDimensions = () => {
      const rect =
        element.getBoundingClientRect()

      if (
        rect.width > 0 &&
        rect.height > 0
      ) {
        setDimensions({
          width: rect.width,
          height: rect.height,
        })
      }
    }

    updateDimensions()

    const observer = new ResizeObserver(
      updateDimensions
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [])

  // =========================================
  // POSICIONES DEL PLANO
  // =========================================

  const visualPositions = useMemo(
    () =>
      buildVisualPositions(
        mesas,
        dimensions.width,
        dimensions.height
      ),
    [
      mesas,
      dimensions.width,
      dimensions.height,
    ]
  )

  // =========================================
  // INFORMACIÓN VISUAL DE LOS GRUPOS
  // =========================================

  // Cada grupo se representa mediante:
  //
  // - Un único contorno exterior.
  // - Su nombre.
  // - La capacidad total.
  //
  // Las mesas siguen siendo elementos individuales
  // dentro del conjunto para permitir abrir
  // "Editar mesa" haciendo clic sobre cualquiera.

  const groupLayouts = useMemo(() => {
    const result = []

    for (const group of groups) {
      if (
        Number(group.idSector) !==
        Number(idSector)
      ) {
        continue
      }

      const members = (
        group.idsMesas ?? []
      )
        .map((idMesa) => {
          const detail = mesas.find(
            (mesa) =>
              Number(mesa.idMesa) ===
              Number(idMesa)
          )

          if (!detail) {
            return null
          }

          const visual =
            visualPositions.get(
              Number(idMesa)
            )

          const physical =
            physicalTablesById.get(
              Number(idMesa)
            )

          return {
            idMesa: Number(idMesa),
            detail,
            physical,
            x: visual?.x ??
              normalizePosition(
                detail.posicionX
              ),
            y: visual?.y ??
              normalizePosition(
                detail.posicionY
              ),
          }
        })
        .filter(Boolean)

      if (members.length < 2) {
        continue
      }

      const minX = Math.min(
        ...members.map(
          (member) =>
            member.x * dimensions.width
        )
      )

      const maxX = Math.max(
        ...members.map(
          (member) =>
            member.x * dimensions.width
        )
      )

      const minY = Math.min(
        ...members.map(
          (member) =>
            member.y * dimensions.height
        )
      )

      const maxY = Math.max(
        ...members.map(
          (member) =>
            member.y * dimensions.height
        )
      )

      const left =
        minX -
        TABLE_WIDTH / 2 -
        GROUP_PADDING

      const top =
        minY -
        TABLE_HEIGHT / 2 -
        GROUP_PADDING

      const width =
        maxX -
        minX +
        TABLE_WIDTH +
        GROUP_PADDING * 2

      const height =
        maxY -
        minY +
        TABLE_HEIGHT +
        GROUP_PADDING * 2

      const capacidad = members.reduce(
        (total, member) =>
          total +
          (
            Number(
              member.physical?.capacidad
            ) || 0
          ),
        0
      )

      result.push({
        ...group,
        members,
        capacidad,
        left,
        top,
        width,
        height,
      })
    }

    return result
  }, [
    groups,
    idSector,
    mesas,
    physicalTablesById,
    visualPositions,
    dimensions.width,
    dimensions.height,
  ])

  const groupLayoutsByTableId = useMemo(
    () => {
      const result = new Map()

      groupLayouts.forEach((group) => {
        group.members.forEach((member) => {
          result.set(
            member.idMesa,
            group
          )
        })
      })

      return result
    },
    [groupLayouts]
  )

  // =========================================
  // MOVIMIENTO DE UNA AGRUPACIÓN
  // =========================================

  // El hook traslada todas las mesas.
  // Acá limitamos el destino para que el
  // conjunto completo permanezca en el canvas.
  //
  // Esta función se usa únicamente al mover
  // una agrupación dentro del mismo sector.
  // El traslado entre sectores lo resuelve
  // moveGroupToSector en el hook.

  const clampGroupedPosition = (
    group,
    draggedTableId,
    nextPosition
  ) => {
    if (!group || !nextPosition) {
      return nextPosition
    }

    const dragged = group.members.find(
      (member) =>
        member.idMesa ===
        Number(draggedTableId)
    )

    if (!dragged) {
      return nextPosition
    }

    // Las posiciones efectivas del borrador son
    // las que utiliza el hook para desplazar
    // todas las integrantes.

    const positions = group.members.map(
      (member) => ({
        x: normalizePosition(
          member.detail.posicionX
        ),
        y: normalizePosition(
          member.detail.posicionY
        ),
      })
    )

    const minX = Math.min(
      ...positions.map(
        (position) => position.x
      )
    )

    const maxX = Math.max(
      ...positions.map(
        (position) => position.x
      )
    )

    const minY = Math.min(
      ...positions.map(
        (position) => position.y
      )
    )

    const maxY = Math.max(
      ...positions.map(
        (position) => position.y
      )
    )

    // Márgenes para que los cuerpos de las mesas
    // no queden cortados por los bordes.

    const marginX = Math.min(
      0.5,
      (
        TABLE_WIDTH / 2 +
        GROUP_PADDING
      ) / Math.max(
        dimensions.width,
        1
      )
    )

    const marginY = Math.min(
      0.5,
      (
        TABLE_HEIGHT / 2 +
        GROUP_PADDING
      ) / Math.max(
        dimensions.height,
        1
      )
    )

    const originX = normalizePosition(
      dragged.detail.posicionX
    )

    const originY = normalizePosition(
      dragged.detail.posicionY
    )

    const requestedDx =
      nextPosition.x - originX

    const requestedDy =
      nextPosition.y - originY

    const minDx = marginX - minX
    const maxDx = 1 - marginX - maxX

    const minDy = marginY - minY
    const maxDy = 1 - marginY - maxY

    const dx = minDx <= maxDx
      ? clamp(
          requestedDx,
          minDx,
          maxDx
        )
      : 0

    const dy = minDy <= maxDy
      ? clamp(
          requestedDy,
          minDy,
          maxDy
        )
      : 0

    return {
      x: clamp(originX + dx),
      y: clamp(originY + dy),
    }
  }

  // =========================================
  // LIMPIAR INTERACCIÓN
  // =========================================

  const clearInteraction = () => {
    cleanupListenersRef.current?.()
    cleanupListenersRef.current = null

    interactionRef.current = null

    setDraggingMesaId(null)
    setDragPreview(null)

    onHoverSector?.(null)
  }

  useEffect(() => {
    return () => {
      cleanupListenersRef.current?.()
      cleanupListenersRef.current = null
    }
  }, [])

  // =========================================
  // INICIAR CLIC O ARRASTRE
  // =========================================

  const handlePointerDown = (
    event,
    detail,
    physical
  ) => {
    if (
      disabled ||
      groupingMode ||
      event.button !== 0 ||
      !canvasRef.current ||
      interactionRef.current
    ) {
      return
    }

    const element =
      event.currentTarget

    const rect =
      element.getBoundingClientRect()

    const group =
      groupLayoutsByTableId.get(
        Number(detail.idMesa)
      )

    const codigo =
      physical?.codigo ||
      detail.codigo ||
      `Mesa ${detail.idMesa}`

    // Ubicación original del botón.

    const offsetX =
      event.clientX -
      (rect.left + rect.width / 2)

    const offsetY =
      event.clientY -
      (rect.top + rect.height / 2)

    const data = {
      pointerId: event.pointerId,

      idMesa: Number(detail.idMesa),
      physical,
      group,

      startX: event.clientX,
      startY: event.clientY,

      offsetX,
      offsetY,

      moved: false,

      preview: {
        codigo,

        capacidad:
          physical?.capacidad ?? null,

        habilitada:
          detail.activa === true,

        groupName:
          group?.nombre ?? null,

        groupCount:
          group?.members.length ?? 0,

        groupCapacity:
          group?.capacidad ?? null,

        // Distancias entre el centro de la mesa
        // que arrastramos y las demás integrantes.

        members: group
          ? group.members.map(
              (member) => ({
                codigo:
                  member.physical?.codigo ||
                  member.detail.codigo ||
                  `Mesa ${member.idMesa}`,

                capacidad:
                  member.physical?.capacidad,

                dx:
                  (
                    member.x -
                    (
                      visualPositions.get(
                        Number(detail.idMesa)
                      )?.x ?? 0.5
                    )
                  ) * dimensions.width,

                dy:
                  (
                    member.y -
                    (
                      visualPositions.get(
                        Number(detail.idMesa)
                      )?.y ?? 0.5
                    )
                  ) * dimensions.height,
              })
            )
          : [],
      },
    }

    interactionRef.current = data

    // =========================================
    // MOVIMIENTO GLOBAL
    // =========================================

    const handleWindowPointerMove = (
      moveEvent
    ) => {
      const current =
        interactionRef.current

      if (
        !current ||
        current.pointerId !==
          moveEvent.pointerId
      ) {
        return
      }

      if (disabled) {
        clearInteraction()
        return
      }

      const distance = Math.hypot(
        moveEvent.clientX -
          current.startX,
        moveEvent.clientY -
          current.startY
      )

      if (
        !current.moved &&
        distance < DRAG_THRESHOLD
      ) {
        return
      }

      if (!current.moved) {
        current.moved = true

        setDraggingMesaId(
          current.idMesa
        )
      }

      const target =
        getSectorDropTarget(
          moveEvent.clientX,
          moveEvent.clientY
        )

      // =====================================
      // RESALTAR SECTOR DE DESTINO
      // =====================================

      // Tanto las mesas individuales como las
      // agrupaciones pueden trasladarse a
      // otro sector.
      //
      // El sector de destino se resalta mientras
      // el usuario arrastra el elemento.

      if (
        target &&
        target.sectorId !==
          String(idSector)
      ) {
        onHoverSector?.(
          target.sectorId
        )
      } else {
        onHoverSector?.(null)
      }

      setDragPreview({
        ...current.preview,

        left:
          moveEvent.clientX -
          current.offsetX,

        top:
          moveEvent.clientY -
          current.offsetY,
      })
    }

    // =========================================
    // SOLTAR MESA O GRUPO
    // =========================================

    const handleWindowPointerUp = (
      upEvent
    ) => {
      const current =
        interactionRef.current

      if (
        !current ||
        current.pointerId !==
          upEvent.pointerId
      ) {
        return
      }

      const moved = current.moved

      const target = moved
        ? getSectorDropTarget(
            upEvent.clientX,
            upEvent.clientY
          )
        : null

      const position = target
        ? getPositionInRect(
            upEvent.clientX,
            upEvent.clientY,
            current,
            target.rect
          )
        : null

      // Limpiar primero la interacción.
      clearInteraction()

      // Clic normal: abrir Editar mesa.

      if (!moved) {
        if (current.physical) {
          onEditTable?.(
            current.physical
          )
        }

        return
      }

      // Fuera de un sector no hay cambios.

      if (
        !target ||
        !position
      ) {
        return
      }

      // =====================================
      // MOVER GRUPO COMPLETO
      // =====================================

      if (current.group) {
        // Si soltamos en otro sector, enviamos
        // la solicitud para trasladar el grupo
        // completo, sin separar integrantes.

        if (
          target.sectorId !==
          String(idSector)
        ) {
          onMoveGroupToSector?.(
            current.idMesa,
            Number(target.sectorId),
            position
          )

          return
        }

        // Si soltamos en el mismo sector,
        // mantenemos exactamente el movimiento
        // grupal que ya funcionaba.

        const safePosition =
          clampGroupedPosition(
            current.group,
            current.idMesa,
            position
          )

        onMoveTable?.(
          current.idMesa,
          safePosition.x,
          safePosition.y
        )

        return
      }

      // =====================================
      // TRASLADAR MESA INDIVIDUAL
      // =====================================

      if (
        target.sectorId !==
        String(idSector)
      ) {
        onMoveTableToSector?.(
          current.idMesa,
          Number(target.sectorId),
          position
        )

        return
      }

      // =====================================
      // MOVER MESA INDIVIDUAL
      // =====================================

      onMoveTable?.(
        current.idMesa,
        position.x,
        position.y
      )
    }

    // =========================================
    // CANCELAR INTERACCIÓN
    // =========================================

    const handleWindowPointerCancel = (
      cancelEvent
    ) => {
      if (
        interactionRef.current?.pointerId ===
          cancelEvent.pointerId
      ) {
        clearInteraction()
      }
    }

    const handleWindowBlur = () => {
      clearInteraction()
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInteraction()
      }
    }

    const handleWindowKeyDown = (
      keyEvent
    ) => {
      if (
        keyEvent.key === 'Escape'
      ) {
        keyEvent.preventDefault()
        clearInteraction()
      }
    }

    // =========================================
    // LISTENERS GLOBALES
    // =========================================

    window.addEventListener(
      'pointermove',
      handleWindowPointerMove,
      true
    )

    window.addEventListener(
      'pointerup',
      handleWindowPointerUp,
      true
    )

    window.addEventListener(
      'pointercancel',
      handleWindowPointerCancel,
      true
    )

    window.addEventListener(
      'blur',
      handleWindowBlur
    )

    window.addEventListener(
      'keydown',
      handleWindowKeyDown,
      true
    )

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    )

    cleanupListenersRef.current = () => {
      window.removeEventListener(
        'pointermove',
        handleWindowPointerMove,
        true
      )

      window.removeEventListener(
        'pointerup',
        handleWindowPointerUp,
        true
      )

      window.removeEventListener(
        'pointercancel',
        handleWindowPointerCancel,
        true
      )

      window.removeEventListener(
        'blur',
        handleWindowBlur
      )

      window.removeEventListener(
        'keydown',
        handleWindowKeyDown,
        true
      )

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      )
    }

    try {
      element.setPointerCapture(
        event.pointerId
      )
    } catch {
      // Los listeners globales siguen activos.
    }

    event.preventDefault()
  }

  // =========================================
  // TECLADO
  // =========================================

  const handleKeyDown = (
    event,
    detail,
    physical
  ) => {
    if (disabled) {
      return
    }

    // En modo agrupación, Enter y Espacio
    // utilizan el onClick nativo del botón.

    if (groupingMode) {
      return
    }

    if (
      event.key === 'Enter' ||
      event.key === ' '
    ) {
      event.preventDefault()

      if (physical) {
        onEditTable?.(physical)
      }

      return
    }

    if (!onMoveTable) {
      return
    }

    const step = event.shiftKey
      ? KEYBOARD_FAST_STEP
      : KEYBOARD_STEP

    let x = normalizePosition(
      detail.posicionX
    )

    let y = normalizePosition(
      detail.posicionY
    )

    switch (event.key) {
      case 'ArrowLeft':
        x -= step
        break

      case 'ArrowRight':
        x += step
        break

      case 'ArrowUp':
        y -= step
        break

      case 'ArrowDown':
        y += step
        break

      default:
        return
    }

    event.preventDefault()

    const group =
      groupLayoutsByTableId.get(
        Number(detail.idMesa)
      )

    const nextPosition = group
      ? clampGroupedPosition(
          group,
          detail.idMesa,
          {
            x: clamp(x),
            y: clamp(y),
          }
        )
      : {
          x: clamp(x),
          y: clamp(y),
        }

    // El hook moverá todas las mesas si
    // la mesa pertenece a un grupo.

    onMoveTable(
      detail.idMesa,
      nextPosition.x,
      nextPosition.y
    )
  }

  // =========================================
  // ARRASTRE ACTIVO DEL GRUPO
  // =========================================

  const draggingGroup =
    draggingMesaId == null
      ? null
      : groupLayoutsByTableId.get(
          Number(draggingMesaId)
        )

  // =========================================
  // RENDERIZADO
  // =========================================

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-mesa-border bg-mesa-surface p-3 sm:p-5">
        <div
          ref={canvasRef}
          data-sector-drop-id={idSector}
          className={`relative h-[320px] rounded-lg border border-dashed transition-colors sm:h-[380px] ${
            isDropTarget
              ? 'border-mesa-cyan-light bg-cyan-500/10 ring-2 ring-mesa-cyan-light/40'
              : 'border-mesa-border'
          }`}
          style={{
            backgroundImage:
              'linear-gradient(rgba(148,163,184,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.07) 1px, transparent 1px)',
            backgroundSize: '25px 25px',
          }}
        >
          {/* ===================================== */}
          {/* CONTORNOS DE AGRUPACIONES            */}
          {/* ===================================== */}

          {groupLayouts.map((group) => {
            const isDragging =
              draggingGroup === group

            return (
              <div
                key={
                  group.draftIndex ??
                  group.idGrupo ??
                  `${group.nombre}-${group.idSector}`
                }
                aria-hidden="true"
                className={`pointer-events-none absolute rounded-2xl border border-dashed border-blue-500 bg-blue-500/[0.04] transition-opacity ${
                  isDragging
                    ? 'opacity-20'
                    : ''
                }`}
                style={{
                  left: group.left,
                  top: group.top,
                  width: group.width,
                  height: group.height,
                  zIndex: 0,
                }}
              >
                {/* Nombre y capacidad total */}

                <span
                  className="pointer-events-none absolute left-1/2 top-0 flex max-w-[95%] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-1 truncate rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-bold leading-none text-white shadow-md"
                  title={
                    `${group.nombre} · ${group.capacidad} personas`
                  }
                >
                  <span className="truncate">
                    {group.nombre}
                  </span>

                  <span className="shrink-0">
                    · {group.capacidad} pers.
                  </span>
                </span>
              </div>
            )
          })}

          {/* ===================================== */}
          {/* MESAS                                */}
          {/* ===================================== */}

          {mesas.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center">
              <p className="text-sm text-mesa-muted">
                No hay mesas en este sector.
              </p>
            </div>
          ) : (
            mesas.map((detail) => {
              const idMesa = Number(
                detail.idMesa
              )

              const physical =
                physicalTablesById.get(idMesa)

              const visual =
                visualPositions.get(idMesa)

              const x =
                visual?.x ?? 0.5

              const y =
                visual?.y ?? 0.5

              const group =
                groupsByTableId.get(idMesa)

              const isGrouped =
                Boolean(group)

              const belongsToEditingGroup =
                group != null &&
                editingGroupIndex !== null &&
                group.draftIndex ===
                  editingGroupIndex

              const isDragging =
                draggingMesaId !== null &&
                (
                  Number(draggingMesaId) === idMesa ||
                  (
                    draggingGroup &&
                    draggingGroup.members.some(
                      (member) =>
                        member.idMesa === idMesa
                    )
                  )
                )

              const codigo =
                physical?.codigo ||
                detail.codigo ||
                `Mesa ${idMesa}`

              const habilitada =
                detail.activa === true &&
                detail.activaGlobal !== false &&
                physical?.activa !== false

              const agrupable =
                physical?.agrupable === true

              // =====================================
              // MOZO EFECTIVO
              // =====================================

              const ownWaiterId =
                tableWaitersById.get(
                  idMesa
                )

              const hasOwnWaiter =
                tableWaitersById.has(
                  idMesa
                )

              const effectiveWaiterId =
                isGrouped
                  ? (
                      group.idUsuario ??
                      sectorWaiterId
                    )
                  : (
                      hasOwnWaiter
                        ? ownWaiterId
                        : sectorWaiterId
                    )

              const effectiveWaiter =
                effectiveWaiterId == null
                  ? null
                  : waitersById.get(
                      Number(
                        effectiveWaiterId
                      )
                    )

              const waiterOrigin =
                isGrouped
                  ? (
                      group.idUsuario != null
                        ? 'Grupo'
                        : 'Sector'
                    )
                  : (
                      hasOwnWaiter
                        ? 'Individual'
                        : 'Sector'
                    )

              // =====================================
              // SELECCIÓN DE INTEGRANTES
              // =====================================

              const eligible =
                habilitada &&
                agrupable &&
                selectableIds.has(idMesa) &&
                (
                  !isGrouped ||
                  belongsToEditingGroup
                )

              const selected =
                selectedTableIds.has(
                  idMesa
                )

              return (
                <button
                  key={idMesa}
                  type="button"
                  aria-label={
                    groupingMode
                      ? `${
                          selected
                            ? 'Deseleccionar'
                            : 'Seleccionar'
                        } ${codigo} para agrupar`
                      : `Editar o mover ${codigo}`
                  }
                  aria-pressed={
                    groupingMode
                      ? selected
                      : undefined
                  }
                  aria-disabled={
                    groupingMode &&
                    !eligible
                      ? true
                      : undefined
                  }
                  title={[
                    codigo,
                    habilitada
                      ? 'Habilitada'
                      : 'Deshabilitada',
                    agrupable
                      ? 'Agrupable'
                      : 'No agrupable',
                    group
                      ? `Grupo: ${group.nombre}`
                      : '',
                    effectiveWaiterId != null
                      ? `Mozo: ${getWaiterName(
                          effectiveWaiter
                        )} (${waiterOrigin})`
                      : 'Sin mozo',
                    groupingMode
                      ? (
                          eligible
                            ? 'Clic para seleccionar'
                            : 'No disponible para agrupar'
                        )
                      : (
                          disabled
                            ? ''
                            : 'Clic para editar · Arrastrar para mover'
                        ),
                  ]
                    .filter(Boolean)
                    .join('\n')}

                  // =================================
                  // CLIC Y ARRASTRE
                  // =================================

                  onClick={
                    groupingMode &&
                    !disabled &&
                    eligible
                      ? () =>
                          onToggleGroupTable?.(
                            idMesa
                          )
                      : undefined
                  }
                  onPointerDown={
                    groupingMode
                      ? undefined
                      : (event) =>
                          handlePointerDown(
                            event,
                            detail,
                            physical
                          )
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(
                      event,
                      detail,
                      physical
                    )
                  }
                  className={`absolute flex h-14 w-16 -translate-x-1/2 -translate-y-1/2 touch-none select-none flex-col items-center justify-center rounded-xl border shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mesa-cyan-light ${
                    selected
                      ? 'border-blue-400 bg-blue-500/30 text-white ring-2 ring-blue-400/70'
                      : !habilitada
                        ? 'border-slate-500/60 bg-slate-500/15 text-mesa-muted'
                        : isGrouped
                          ? 'border-emerald-500/70 bg-emerald-500/15 text-mesa-text'
                          : 'border-emerald-500/60 bg-emerald-500/15 text-mesa-text'
                  } ${
                    disabled
                      ? 'cursor-default opacity-70'
                      : groupingMode
                        ? (
                            eligible
                              ? 'cursor-pointer hover:border-blue-400'
                              : 'cursor-not-allowed opacity-45'
                          )
                        : isDragging
                          ? 'cursor-grabbing opacity-20'
                          : 'cursor-grab hover:border-mesa-cyan-light'
                  }`}
                  style={{
                    left: `${x * 100}%`,
                    top: `${y * 100}%`,
                    zIndex: 1,
                  }}
                >
                  <span className="max-w-14 truncate text-xs font-bold">
                    {codigo}
                  </span>

                  <span className="text-[10px] opacity-75">
                    {physical?.capacidad != null
                      ? `${physical.capacidad} pers.`
                      : '—'}
                  </span>

                  {/* ================================= */}
                  {/* INDICADOR AGRUPABLE / AGRUPADA    */}
                  {/* ================================= */}

                  {agrupable && (
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute -left-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-mesa-border ${
                        isGrouped
                          ? 'bg-blue-600 text-white'
                          : 'bg-mesa-surface text-slate-300'
                      }`}
                    >
                      {isGrouped ? (
                        <LayersOutlinedIcon
                          sx={{
                            fontSize: 12,
                          }}
                        />
                      ) : (
                        <LinkIcon
                          sx={{
                            fontSize: 12,
                          }}
                        />
                      )}
                    </span>
                  )}

                  {/* ================================= */}
                  {/* AVATAR DEL MOZO                  */}
                  {/* ================================= */}

                  {effectiveWaiterId != null && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border-2 border-mesa-surface text-[9px] font-bold leading-none text-white"
                      style={{
                        backgroundColor:
                          getWaiterColor(
                            effectiveWaiterId
                          ),
                      }}
                    >
                      {getWaiterInitial(
                        effectiveWaiter
                      )}
                    </span>
                  )}

                  {/* ================================= */}
                  {/* INDICADOR DE SELECCIÓN           */}
                  {/* ================================= */}

                  {groupingMode &&
                    selected && (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -bottom-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full border border-blue-300 bg-blue-600 text-[11px] font-bold text-white"
                      >
                        ✓
                      </span>
                    )}
                </button>
              )
            })
          )}
        </div>
      </div>

      {/* ===================================== */}
      {/* INDICACIONES DEL PLANO               */}
      {/* ===================================== */}

      <p className="text-xs text-mesa-muted">
        {groupingMode
          ? 'Seleccioná las mesas que integran la agrupación.'
          : disabled
            ? 'La edición del plano está temporalmente bloqueada.'
            : 'Clic para editar. Arrastrá una mesa o grupo para moverlo dentro de un sector o hacia otro. Guardá los cambios para conservarlos.'}
      </p>

      {/* ===================================== */}
      {/* VISTA PREVIA DURANTE EL ARRASTRE     */}
      {/* ===================================== */}

      {dragPreview &&
        createPortal(
          dragPreview.groupName ? (
            // =================================
            // PREVISUALIZACIÓN DEL GRUPO
            // =================================
            <div
              className="pointer-events-none fixed z-[1400]"
              style={{
                left: dragPreview.left,
                top: dragPreview.top,
              }}
            >
              {(() => {
                const members =
                  dragPreview.members

                const minX = Math.min(
                  ...members.map(
                    (member) => member.dx
                  )
                )

                const maxX = Math.max(
                  ...members.map(
                    (member) => member.dx
                  )
                )

                const minY = Math.min(
                  ...members.map(
                    (member) => member.dy
                  )
                )

                const maxY = Math.max(
                  ...members.map(
                    (member) => member.dy
                  )
                )

                return (
                  <div
                    className="absolute rounded-2xl border border-dashed border-blue-400 bg-blue-500/10 shadow-2xl"
                    style={{
                      left:
                        minX -
                        TABLE_WIDTH / 2 -
                        GROUP_PADDING,
                      top:
                        minY -
                        TABLE_HEIGHT / 2 -
                        GROUP_PADDING,
                      width:
                        maxX -
                        minX +
                        TABLE_WIDTH +
                        GROUP_PADDING * 2,
                      height:
                        maxY -
                        minY +
                        TABLE_HEIGHT +
                        GROUP_PADDING * 2,
                    }}
                  >
                    <span
                      className="absolute left-1/2 top-0 flex max-w-[95%] -translate-x-1/2 -translate-y-1/2 items-center gap-1 truncate rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold leading-none text-white"
                    >
                      <span className="truncate">
                        {dragPreview.groupName}
                      </span>
                      <span className="shrink-0">
                        · {dragPreview.groupCapacity} pers.
                      </span>
                    </span>

                    {members.map(
                      (member, index) => (
                        <div
                          key={index}
                          className="absolute flex h-14 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border border-emerald-400 bg-emerald-500/20 text-white"
                          style={{
                            left:
                              member.dx -
                              minX +
                              TABLE_WIDTH / 2 +
                              GROUP_PADDING,
                            top:
                              member.dy -
                              minY +
                              TABLE_HEIGHT / 2 +
                              GROUP_PADDING,
                          }}
                        >
                          <span className="max-w-14 truncate text-xs font-bold">
                            {member.codigo}
                          </span>

                          <span className="text-[10px] opacity-80">
                            {member.capacidad != null
                              ? `${member.capacidad} pers.`
                              : '—'}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )
              })()}
            </div>
          ) : (
            // =================================
            // PREVISUALIZACIÓN MESA INDIVIDUAL
            // =================================
            <div
              className={`pointer-events-none fixed z-[1400] flex h-14 w-16 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-xl border shadow-2xl ${
                dragPreview.habilitada
                  ? 'border-emerald-400 bg-emerald-500/25 text-white'
                  : 'border-slate-400 bg-slate-500/20 text-white'
              }`}
              style={{
                left: dragPreview.left,
                top: dragPreview.top,
              }}
            >
              <span className="max-w-14 truncate text-xs font-bold">
                {dragPreview.codigo}
              </span>

              <span className="text-[10px] opacity-85">
                {dragPreview.capacidad != null
                  ? `${dragPreview.capacidad} pers.`
                  : '—'}
              </span>
            </div>
          ),
          document.body
        )}
    </div>
  )
}

export default SectorTableCanvas
