import api from './axiosConfig'

// Importamos la función para manejar la respuesta de la API
import { handleApiResponse } from './handleApiResponse'

// Función para realizar la solicitud de inicio de sesión
export const login = async (loginData) => {
  const response = await api.post('/api/auth/login', loginData)
  return handleApiResponse(response.data)
}

// Función para realizar la solicitud de registro
export const register = async (registerData) => {
  const response = await api.post('/api/auth/registro', registerData)
  return handleApiResponse(response.data)
}

// Función para realizar la solicitud de inicio de sesión con Google
export const googleLogin = async (googleLoginData) => {
  const response = await api.post('/api/auth/google', googleLoginData)
  return handleApiResponse(response.data)
}

// Función para obtener el usuario autenticado actual
export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/me')
  return handleApiResponse(response.data)
}

// Función para cerrar sesión
export const logout = async () => {
  const response = await api.post('/api/auth/logout')
  return handleApiResponse(response.data)
}

// Función para obtener el token CSRF
export const getCsrfToken = async () => {
  const response = await api.get('/api/csrf')
  return handleApiResponse(response.data)
}