export const GENERIC_FOOD_IMAGE = '/img/products/plato.jpg'
export const GENERIC_DRINK_IMAGE = '/img/products/bebida.jpg'

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

  return drinkKeywords.some((keyword) =>
    name.includes(keyword)
  )
}

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

export const getStockStatus = (product) => {
  if (!product?.controlaStock) {
    return 'SIN_CONTROL'
  }

  const quantity = product.stockActual

  if (typeof quantity !== 'number') {
    return 'SIN_DATO'
  }

  if (quantity <= 0) {
    return 'SIN_STOCK'
  }

  return 'OK'
}