import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// Función para listar las categorías de producto de un establecimiento
export const listProductCategories = async (idEstablecimiento) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/categorias-producto`
  )

  return handleApiResponse(response.data)
}

// Función para crear una categoría de producto
export const createProductCategory = async ({
  idEstablecimiento,
  categoryData,
}) => {
  const response = await api.post(
    `/api/establecimientos/${idEstablecimiento}/categorias-producto`,
    categoryData
  )

  return handleApiResponse(response.data)
}