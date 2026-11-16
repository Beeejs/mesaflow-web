import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

export const listOrders = async (idEstablecimiento, sesionEstado = '', signal) => {
  const { data } = await api.get(`/api/establecimientos/${idEstablecimiento}/pedidos`, {
    params: sesionEstado ? { sesionEstado } : {},
    signal,
  })
  return handleApiResponse(data)
}

export const getOrder = async (idPedido, signal) => {
  const { data } = await api.get(`/api/pedidos/${idPedido}`, { signal })
  return handleApiResponse(data)
}

export const updateOrderState = async ({ idPedido, estado, motivo }) => {
  const { data } = await api.patch(`/api/pedidos/${idPedido}/estado`, {
    estado,
    ...(motivo && { motivo }),
  })
  return handleApiResponse(data)
}

export const getSessionAccount = async (idSesionMesa, signal) => {
  const { data } = await api.get(`/api/sesiones-mesa/${idSesionMesa}/cuenta`, { signal })
  return handleApiResponse(data)
}

export const closeSessionAccount = async (idSesionMesa) => {
  const { data } = await api.patch(`/api/sesiones-mesa/${idSesionMesa}/cerrar`)
  return handleApiResponse(data)
}
