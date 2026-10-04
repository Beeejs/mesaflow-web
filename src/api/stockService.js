import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

export const listStockMovements = async (idEstablecimiento, products) => {
  const stockProducts = products.filter(
    (product) => product.controlaStock && product.stockInicializado
  )

  const responses = await Promise.all(
    stockProducts.map((product) =>
      api.get(
        `/api/establecimientos/${idEstablecimiento}/productos/${product.idProducto}/stock/movimientos`
      )
    )
  )

  return responses
    .flatMap((response) => handleApiResponse(response.data))
    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}

export const listStockMovementReasons = async (
  idEstablecimiento,
  tipoMovimiento
) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/stock/motivos`,
    { params: { tipo: tipoMovimiento } }
  )

  return handleApiResponse(response.data)
}

export const createStockMovement = async ({
  idEstablecimiento,
  idProducto,
  tipoMovimiento,
  idMotivoMovimiento,
  cantidad,
  detalle,
}) => {
  const response = await api.post(
    `/api/establecimientos/${idEstablecimiento}/productos/${idProducto}/stock/movimientos`,
    {
      tipoMovimiento,
      idMotivoMovimiento,
      cantidad,
      detalle,
    }
  )

  return handleApiResponse(response.data)
}
