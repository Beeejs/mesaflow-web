import { useState } from 'react'

const getErrorMessage = (error) => {
  return (
    error.response?.data?.message ||
    error.response?.data?.mensaje ||
    error.response?.data?.error ||
    'Ocurrió un error. Intentá nuevamente.'
  )
}

const useApiAction = (serviceFunction) => {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  const reset = () => {
    setData(null)
    setError('')
    setLoading(false)
  }

  return {
    data,
    error,
    loading,
    action,
    reset,
  }
}

export default useApiAction