
import { useRef, useState } from 'react'

// =========================================
// UTILIDADES
// =========================================

const clamp = (value, min = 0, max = 1) =>
  Math.min(max, Math.max(min, value))

const normalizePosition = (value) => {
  if (value === null || value === undefined || value === '') {
    return 0.5
  }

  const position = Number(value)

  return Number.isFinite(position)
    ? clamp(position)
    : 0.5
}

const DRAG_THRESHOLD = 4
const KEYBOARD_STEP = 0.025
const KEYBOARD_FAST_STEP = 0.1

// =========================================
// COMPONENTE
// =========================================

const SectorTableCanvas = ({
  mesas = [],
  physicalTablesById,
  onMoveTable,
  onEditTable,
  disabled = false,
}) => {
  const canvasRef = useRef(null)
  const draggingRef = useRef(null)

  const [dragging, setDragging] = useState(null)

  // =========================================
  // COORDENADAS
  // =========================================

  const getPointerPosition = (event, dragData) => {
    const canvas = canvasRef.current

    if (!canvas) return null

    const rect = canvas.getBoundingClientRect()

    if (!rect.width || !rect.height) {
      return null
    }

    const centerX =
      event.clientX - rect.left - dragData.offsetX

    const centerY =
      event.clientY - rect.top - dragData.offsetY

    const halfWidth = dragData.width / 2
    const halfHeight = dragData.height / 2

    const minX = halfWidth / rect.width
    const maxX = 1 - minX

    const minY = halfHeight / rect.height
    const maxY = 1 - minY

    return {
      x: clamp(
        centerX / rect.width,
        Math.min(minX, 0.5),
        Math.max(maxX, 0.5)
      ),
      y: clamp(
        centerY / rect.height,
        Math.min(minY, 0.5),
        Math.max(maxY, 0.5)
      ),
    }
  }

  // =========================================
  // INICIAR INTERACCIÓN
  // =========================================

  const handlePointerDown = (event, detail) => {
    if (
      event.button !== 0 ||
      !canvasRef.current ||
      draggingRef.current
    ) {
      return
    }

    const element = event.currentTarget
    const rect = element.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    draggingRef.current = {
      pointerId: event.pointerId,
      idMesa: detail.idMesa,

      startX: event.clientX,
      startY: event.clientY,

      offsetX: event.clientX - centerX,
      offsetY: event.clientY - centerY,

      width: rect.width,
      height: rect.height,

      moved: false,
    }

    event.currentTarget.setPointerCapture(
      event.pointerId
    )

    event.preventDefault()
  }

  // =========================================
  // ARRASTRAR MESA
  // =========================================

  const handlePointerMove = (event) => {
    const current = draggingRef.current

    if (
      !current ||
      current.pointerId !== event.pointerId ||
      disabled
    ) {
      return
    }

    const distance = Math.hypot(
      event.clientX - current.startX,
      event.clientY - current.startY
    )

    if (
      !current.moved &&
      distance < DRAG_THRESHOLD
    ) {
      return
    }

    current.moved = true

    const position = getPointerPosition(
      event,
      current
    )

    if (!position) return

    setDragging({
      idMesa: current.idMesa,
      ...position,
    })
  }

  // =========================================
  // CLIC O FINALIZACIÓN DEL ARRASTRE
  // =========================================

  const handlePointerUp = (event, physical) => {
    const current = draggingRef.current

    if (
      !current ||
      current.pointerId !== event.pointerId
    ) {
      return
    }

    if (current.moved) {
      if (!disabled) {
        const position = getPointerPosition(
          event,
          current
        )

        if (position) {
          onMoveTable?.(
            current.idMesa,
            position.x,
            position.y
          )
        }
      }
    } else if (physical) {
      // Un clic abre el formulario existente.
      onEditTable?.(physical)
    }

    draggingRef.current = null
    setDragging(null)
  }

  const handlePointerCancel = (event) => {
    const current = draggingRef.current

    if (
      current &&
      current.pointerId === event.pointerId
    ) {
      draggingRef.current = null
      setDragging(null)
    }
  }

  // =========================================
  // TECLADO
  // =========================================

  const handleKeyDown = (event, detail, physical) => {
    // Enter o espacio: abrir edición.
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

    if (disabled || !onMoveTable) return

    const step = event.shiftKey
      ? KEYBOARD_FAST_STEP
      : KEYBOARD_STEP

    let x = normalizePosition(detail.posicionX)
    let y = normalizePosition(detail.posicionY)

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

    onMoveTable(
      detail.idMesa,
      clamp(x),
      clamp(y)
    )
  }

  // =========================================
  // RENDERIZADO
  // =========================================

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-mesa-border bg-mesa-surface p-3 sm:p-5">
        <div
          ref={canvasRef}
          className="relative h-[320px] rounded-lg border border-dashed border-mesa-border sm:h-[380px]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(148, 163, 184, 0.07) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(148, 163, 184, 0.07) 1px,
                transparent 1px
              )
            `,
            backgroundSize: '25px 25px',
          }}
        >
          {mesas.length === 0 ? (
            <div className="flex h-full items-center justify-center px-4 text-center">
              <p className="text-sm text-mesa-muted">
                No hay mesas en este sector.
              </p>
            </div>
          ) : (
            mesas.map((detail) => {
              const physical =
                physicalTablesById.get(
                  Number(detail.idMesa)
                )

              const isDragging =
                dragging?.idMesa === detail.idMesa

              const x = isDragging
                ? dragging.x
                : normalizePosition(
                    detail.posicionX
                  )

              const y = isDragging
                ? dragging.y
                : normalizePosition(
                    detail.posicionY
                  )

              const codigo =
                physical?.codigo ||
                detail.codigo ||
                `Mesa ${detail.idMesa}`

              const capacidad =
                physical?.capacidad

              const habilitada =
                detail.activa === true

              return (
                <button
                  key={detail.idMesa}
                  type="button"
                  aria-label={
                    `Editar o mover mesa ${codigo}`
                  }
                  title={
                    disabled
                      ? `Clic para editar ${codigo}`
                      : `Clic para editar · Arrastrar para mover ${codigo}`
                  }
                  onPointerDown={(event) =>
                    handlePointerDown(event, detail)
                  }
                  onPointerMove={
                    handlePointerMove
                  }
                  onPointerUp={(event) =>
                    handlePointerUp(
                      event,
                      physical
                    )
                  }
                  onPointerCancel={
                    handlePointerCancel
                  }
                  onKeyDown={(event) =>
                    handleKeyDown(
                      event,
                      detail,
                      physical
                    )
                  }
                  className={`
                    absolute flex h-14 w-16
                    -translate-x-1/2
                    -translate-y-1/2
                    touch-none select-none
                    flex-col items-center
                    justify-center rounded-xl
                    border shadow-sm
                    transition-shadow
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-mesa-cyan-light

                    ${
                      habilitada
                        ? 'border-emerald-500/60 bg-emerald-500/15 text-mesa-text'
                        : 'border-yellow-500/50 bg-yellow-500/10 text-mesa-muted'
                    }

                    ${
                      isDragging
                        ? 'cursor-grabbing shadow-lg ring-2 ring-mesa-cyan-light'
                        : disabled
                          ? 'cursor-pointer opacity-70'
                          : 'cursor-grab hover:border-mesa-cyan-light'
                    }
                  `}
                  style={{
                    left: `${x * 100}%`,
                    top: `${y * 100}%`,
                    zIndex: isDragging ? 30 : 1,
                  }}
                >
                  <span className="max-w-14 truncate text-xs font-bold">
                    {codigo}
                  </span>

                  <span className="text-[10px] opacity-75">
                    {capacidad != null
                      ? `${capacidad} pers.`
                      : '—'}
                  </span>
                </button>
              )
            })
          )}
        </div>
      </div>

      <p className="text-xs text-mesa-muted">
        {disabled
          ? 'El movimiento está bloqueado temporalmente. Podés hacer clic en una mesa para editarla.'
          : 'Hacé clic en una mesa para editarla o arrastrala para cambiar su posición. Guardá los cambios para conservarlos.'}
      </p>
    </div>
  )
}

export default SectorTableCanvas
