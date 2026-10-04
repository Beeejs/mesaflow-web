/*
 * PENDIENTE DE BACKEND
 *
 * Todavía no existen endpoints para el stock ni para los movimientos.
 * Estas funciones mantienen el contrato que usará la web para que,
 * cuando el backend los publique, solo haya que reemplazar el cuerpo.
 *
 * Endpoints esperados (a confirmar con backend):
 * GET  /api/establecimientos/{id}/movimientos-stock
 * POST /api/establecimientos/{id}/movimientos-stock
 * GET  /api/motivos-movimiento-stock
 */

export const STOCK_NOT_AVAILABLE_MESSAGE =
  'La gestión de stock todavía no está disponible en el backend.'

// Función para listar el historial de movimientos de stock
// eslint-disable-next-line no-unused-vars
export const listStockMovements = async (idEstablecimiento) => {
  return []
}

// Función para listar los motivos de movimiento de stock
export const listStockMovementReasons = async () => {
  return []
}

// Función para registrar un movimiento de stock
// eslint-disable-next-line no-unused-vars
export const createStockMovement = async (movementData) => {
  throw new Error(STOCK_NOT_AVAILABLE_MESSAGE)
}