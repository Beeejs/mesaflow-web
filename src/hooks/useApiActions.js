import { useState } from 'react'

// Función para obtener un mensaje de error amigable a partir del error recibido
const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    'Ocurrió un error. Intentá nuevamente más tarde.'
  )
}

const useApiAction = (serviceFunction) => {
  // Estados para almacenar los datos, el error y el estado de carga
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Función para ejecutar la acción de la API
  const action = async (...params) => {
    try {
      setLoading(true)
      setError('')
      setData(null)

      const response = await serviceFunction(...params)

      setData(response)

      return response
    } catch (error) {
      const message = getErrorMessage(error)

      setError(message)

      return null
    } finally {
      setLoading(false)
    }
  }

  // Función para reiniciar los estados a sus valores iniciales
  const reset = () => {
    setData(null)
    setError('')
    setLoading(false)
  }

  // Retornamos los estados y la función de reinicio
  return {
    data,
    error,
    loading,
    action,
    reset,
  }
}

export default useApiAction