import api from './axiosConfig'

// Importamos la función para manejar la respuesta de la API
import { handleApiResponse } from './handleApiResponse'

// Función para listar los roles globales
export const listRoles = async () => {
  const response = await api.get('/api/roles')
  return handleApiResponse(response.data)
}