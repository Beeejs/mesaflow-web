// Función para manejar la respuesta estructurada de la API
export const handleApiResponse = (apiResponse) => {
  if (!apiResponse) {
    throw new Error('No se recibió respuesta del servidor.')
  }

  if (!apiResponse.success) {
    throw new Error(apiResponse.message || 'Ocurrió un error inesperado.')
  }

  return apiResponse.response
}