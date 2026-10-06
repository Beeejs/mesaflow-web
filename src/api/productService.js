import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

const buildProductFormData = (productData, image) => {
  const formData = new FormData()

  formData.append(
    'producto',
    new Blob(
      [JSON.stringify(productData)],
      {
        type: 'application/json',
      }
    )
  )

  if (image) {
    formData.append('imagen', image)
  }

  return formData
}

// Función para listar los productos activos de un establecimiento
export const listProducts = async (idEstablecimiento) => {
  const response = await api.get(
    `/api/establecimientos/${idEstablecimiento}/productos`
  )

  return handleApiResponse(response.data)
}

// Función para crear un producto
export const createProduct = async ({
  idEstablecimiento,
  productData,
  image = null,
}) => {
  const response = await api.post(
    `/api/establecimientos/${idEstablecimiento}/productos`,
    buildProductFormData(productData, image)
  )

  return handleApiResponse(response.data)
}

// Función para modificar un producto
export const updateProduct = async ({
  idEstablecimiento,
  idProducto,
  productData,
  image = null,
}) => {
  const response = await api.put(
    `/api/establecimientos/${idEstablecimiento}/productos/${idProducto}`,
    buildProductFormData(productData, image)
  )

  return handleApiResponse(response.data)
}

// Función para dar de baja un producto
export const deleteProduct = async ({
  idEstablecimiento,
  idProducto,
}) => {
  const response = await api.delete(
    `/api/establecimientos/${idEstablecimiento}/productos/${idProducto}`
  )

  return handleApiResponse(response.data)
}