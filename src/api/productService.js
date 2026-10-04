import api from './axiosConfig'
import { handleApiResponse } from './handleApiResponse'

// El backend recibe el producto como parte JSON y la imagen (opcional) como archivo
const buildProductFormData = (productData, image) => {
  const formData = new FormData()

  formData.append(
    'producto',
    new Blob([JSON.stringify(productData)], {
      type: 'application/json',
    })
  )

  if (image) {
    formData.append('imagen', image)
  }

  return formData
}

const multipartConfig = {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
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
    buildProductFormData(productData, image),
    multipartConfig
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
    buildProductFormData(productData, image),
    multipartConfig
  )

  return handleApiResponse(response.data)
}

// Función para dar de baja un producto (baja lógica)
export const deleteProduct = async ({
  idEstablecimiento,
  idProducto,
}) => {
  const response = await api.delete(
    `/api/establecimientos/${idEstablecimiento}/productos/${idProducto}`
  )

  return handleApiResponse(response.data)
}