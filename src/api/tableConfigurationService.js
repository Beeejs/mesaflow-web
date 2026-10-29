import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// Función para listar las configuraciones de mesas
export const listTableConfigurations = async (idEstablecimiento) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/configuraciones-mesa`
  )

  return handleApiResponse(response.data)
}

// Función para crear una configuración de mesas
export const createTableConfiguration = async ({
  idEstablecimiento,
  nombre,
}) => {
  const response = await api.post(
    `/api/establecimientos/${idEstablecimiento}/configuraciones-mesa`,
    { nombre }
  )

  return handleApiResponse(response.data)
}

// Función para activar una configuración de mesas
export const activateTableConfiguration = async ({
  idEstablecimiento,
  idConfiguracionMesa,
}) => {
  const response = await api.put(
    `/api/establecimientos/${idEstablecimiento}/configuraciones-mesa/${idConfiguracionMesa}/activar`
  )

  return handleApiResponse(response.data)
}

// Función para eliminar una configuración de mesas
export const deleteTableConfiguration = async ({
  idEstablecimiento,
  idConfiguracionMesa,
}) => {
  await api.delete(
    `/api/establecimientos/${idEstablecimiento}/configuraciones-mesa/${idConfiguracionMesa}`
  )
}

// Función para obtener la distribución de una configuración
export const getTableDistribution = async ({
  idEstablecimiento,
  idConfiguracionMesa,
}) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/configuraciones-mesa/${idConfiguracionMesa}/distribucion`
  )

  return handleApiResponse(response.data)
}

// Función para guardar la distribución completa
export const updateTableDistribution = async ({
  idEstablecimiento,
  idConfiguracionMesa,
  distributionData,
}) => {
  const response = await api.put(
    `/api/establecimientos/${idEstablecimiento}/configuraciones-mesa/${idConfiguracionMesa}/distribucion`,
    distributionData
  )

  return handleApiResponse(response.data)
}