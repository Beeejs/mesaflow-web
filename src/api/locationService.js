
import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// Función para listar las provincias
export const listProvinces = async () => {
  const response = await api.get('/api/provincias')
  return handleApiResponse(response.data)
}

// Función para listar los distritos de una provincia
export const listDistricts = async (provinceId) => {
  const response = await api.get('/api/partidos', {
    params: {
      idProvincia: provinceId,
    },
  })

  return handleApiResponse(response.data)
}