
import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// Función para listar los usuarios de un establecimiento
export const listEstablishmentUsers = async (idEstablecimiento) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/usuarios`
  )

  return handleApiResponse(response.data)
}

// Función para buscar un usuario de un establecimiento
export const searchEstablishmentUser = async (
  idEstablecimiento,
  email
) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/usuarios/buscar`,
    { params: { email } }
  )

  return handleApiResponse(response.data)
}

// Función para agregar un usuario a un establecimiento
export const addEstablishmentUser = async (
  idEstablecimiento,
  userData
) => {
  const response = await api.post(
    `/api/establecimientos/${idEstablecimiento}/usuarios`,
    userData
  )

  return handleApiResponse(response.data)
}

// Función para actualizar un usuario de un establecimiento
export const updateEstablishmentUser = async (
  idEstablecimiento,
  idUsuario,
  userData
) => {
  const response = await api.put(
    `/api/establecimientos/${idEstablecimiento}/usuarios/${idUsuario}`,
    userData
  )

  return handleApiResponse(response.data)
}

// Función para eliminar un usuario de un establecimiento
export const removeEstablishmentUser = async (
  idEstablecimiento,
  idUsuario
) => {
  const response = await api.delete(
    `/api/establecimientos/${idEstablecimiento}/usuarios/${idUsuario}`
  )

  return handleApiResponse(response.data)
}

// Función para listar los roles de un establecimiento
export const listEstablishmentRoles = async () => {
  const response = await api.get('/api/roles-establecimiento')
  return handleApiResponse(response.data)
}
