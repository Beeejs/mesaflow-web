
import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// Función para listar todos los establecimientos
export const listEstablishments = async () => {
  const response = await api.get('/api/establecimientos')
  return handleApiResponse(response.data)
}

// Función para listar mis establecimientos
export const listMyEstablishments = async () => {
  const response = await api.get(
    '/api/establecimientos/mis-establecimientos'
  )

  return handleApiResponse(response.data)
}

// Función para crear un establecimiento
export const createEstablishment = async (establishmentData) => {
  const response = await api.post(
    '/api/establecimientos',
    establishmentData
  )

  return handleApiResponse(response.data)
}

// Función para modificar un establecimiento
export const updateEstablishment = async (
  idEstablecimiento,
  establishmentData
) => {
  const response = await api.put(
    `/api/establecimientos/${idEstablecimiento}`,
    establishmentData
  )

  return handleApiResponse(response.data)
}