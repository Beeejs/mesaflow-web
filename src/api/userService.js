import api from './axiosConfig'

// Importamos la función para manejar la respuesta de la API
import { handleApiResponse } from './handleApiResponse'

// Función para listar todos los usuarios
export const listUsers = async () => {
  const response = await api.get('/api/usuarios')
  return handleApiResponse(response.data)
}

// Función para buscar un usuario por ID
export const getUserById = async (idUsuario) => {
  const response = await api.get(`/api/usuarios/${idUsuario}`)
  return handleApiResponse(response.data)
}

// Función para buscar un usuario por email
export const getUserByEmail = async (email) => {
  const response = await api.get('/api/usuarios/buscar', {
    params: {
      email,
    },
  })

  return handleApiResponse(response.data)
}

// Función para modificar un usuario
export const updateUser = async (idUsuario, userData) => {
  const response = await api.put(`/api/usuarios/${idUsuario}`, userData)
  return handleApiResponse(response.data)
}