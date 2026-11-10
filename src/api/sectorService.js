
import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// Función para listar sectores del establecimiento
export const listSectors = async (idEstablecimiento) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/sectores`
  )

  return handleApiResponse(response.data)
}

// Función para crear un sector
export const createSector = async ({
  idEstablecimiento,
  nombre,
}) => {
  const response = await api.post(
    `/api/establecimientos/${idEstablecimiento}/sectores`,
    { nombre }
  )

  return handleApiResponse(response.data)
}

// Función para modificar un sector
export const updateSector = async ({
  idEstablecimiento,
  idSector,
  nombre,
}) => {
  const response = await api.put(
    `/api/establecimientos/${idEstablecimiento}/sectores/${idSector}`,
    { nombre }
  )

  return handleApiResponse(response.data)
}

// Función para eliminar un sector
export const deleteSector = async ({
  idEstablecimiento,
  idSector,
}) => {
  await api.delete(
    `/api/establecimientos/${idEstablecimiento}/sectores/${idSector}`
  )
}
