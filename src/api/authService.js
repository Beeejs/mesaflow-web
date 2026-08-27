import api from './axiosConfig'

// Función para realizar la solicitud de inicio de sesión
export const login = async (loginData) => {
  try{

    const response = await api.post('/api/auth/login', loginData)
    return response.data
  }
  catch(error){
    return error
  }
}

// Función para realizar la solicitud de registro
export const register = async (registerData) => {
  try{
    
    const response = await api.post('/api/auth/registro', registerData)
    return response.data
  }
  catch(error){
    return error
  }
}

// Función para realizar la solicitud de verificación de correo electrónico
export const googleLogin = async (googleLoginData) => {
  try{

    const response = await api.post('/api/auth/google', googleLoginData)
    return response.data
  }
  catch(error){
    return error
  }
}