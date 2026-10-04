/*
 * Imágenes genéricas hasta que el gerente cargue la propia (ImageKit).
 * Cuando el producto tiene imagenUrl, esa siempre tiene prioridad.
 */
export const GENERIC_FOOD_IMAGE = '/img/productos/plato.jpg'
export const GENERIC_DRINK_IMAGE = '/img/productos/bebida.jpg'

const drinkKeywords = [
  'bebida',
  'trago',
  'cerveza',
  'vino',
  'cocktail',
  'coctel',
  'gaseosa',
  'jugo',
  'agua',
  'cafe',
  'café',
  'licor',
]

const normalize = (value) =>
  String(value ?? '')
    .toLowerCase()
    .trim()

export const isDrinkCategory = (categoryName) => {
  const name = normalize(categoryName)

  return drinkKeywords.some((keyword) => name.includes(keyword))
}

// Devuelve la imagen real del producto o una genérica según su categoría
export const getProductImage = (product) => {
  if (product?.imagenUrl) {
    return product.imagenUrl
  }

  return isDrinkCategory(product?.categoria)
    ? GENERIC_DRINK_IMAGE
    : GENERIC_FOOD_IMAGE
}

export const formatPrice = (value) => {
  const number = Number(value)

  if (Number.isNaN(number)) {
    return '-'
  }

  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(number)
}

// Devuelve 'SIN_CONTROL', 'SIN_DATO', 'SIN_STOCK' u 'OK'
export const getStockStatus = (product) => {
  if (!product?.controlaStock) return 'SIN_CONTROL'

  const quantity = product.stockActual

  if (typeof quantity !== 'number') return 'SIN_DATO'
  if (quantity <= 0) return 'SIN_STOCK'

  return 'OK'
}