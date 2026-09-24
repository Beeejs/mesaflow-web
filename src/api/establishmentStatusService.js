
import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// Función para listar los estados de los establecimientos
export const listEstablishmentStates = async () => {
  const response = await api.get(
    '/api/estados-establecimiento'
  )

  return handleApiResponse(response.data)
}