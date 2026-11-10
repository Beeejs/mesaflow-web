
import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// Listar mesas físicas del establecimiento
export const listTables = async (idEstablecimiento) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/mesas`
  )

  return handleApiResponse(response.data)
}

// Crear una mesa física
export const createTable = async ({
  idEstablecimiento,
  tableData,
}) => {
  const response = await api.post(
    `/api/establecimientos/${idEstablecimiento}/mesas`,
    tableData
  )

  return handleApiResponse(response.data)
}

// Modificar una mesa física
export const updateTable = async ({
  idEstablecimiento,
  idMesa,
  tableData,
}) => {
  const response = await api.put(
    `/api/establecimientos/${idEstablecimiento}/mesas/${idMesa}`,
    tableData
  )

  return handleApiResponse(response.data)
}
