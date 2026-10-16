import plateImage from '../assets/products/plato.svg'
import drinkImage from '../assets/products/bebida.svg'
import sideImage from '../assets/products/acompanamiento.svg'
import starterImage from '../assets/products/entrada.svg'

export const GENERIC_FOOD_IMAGE = plateImage
export const GENERIC_DRINK_IMAGE = drinkImage

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

export const hasProductImage = (product) => {
  const url = normalize(product?.imagenUrl)

  return Boolean(url) && url !== 'sin imagen'
}

export const getProductImage = (product, width = 320) => {
  if (hasProductImage(product)) {
    const imageUrl = product.imagenUrl.trim()

    if (!URL.canParse(imageUrl)) {
      return imageUrl
    }

    const url = new URL(imageUrl)

    if (
      url.hostname !== 'ik.imagekit.io' ||
      url.protocol !== 'https:' ||
      url.searchParams.has('ik-s')
    ) {
      return imageUrl
    }

    // Las URLs firmadas requieren una nueva firma si cambia la transformacion.
    const transformation = `w-${width},q-75,f-auto`
    const existing = url.searchParams.get('tr')

    url.searchParams.set(
      'tr',
      existing
        ? `${existing}:${transformation}`
        : transformation
    )

    return url.toString()
  }

  const category = normalize(product?.categoria)

  if (isDrinkCategory(category)) {
    return GENERIC_DRINK_IMAGE
  }

  if (category.includes('acompa')) {
    return sideImage
  }

  if (category.includes('entrada')) {
    return starterImage
  }

  return GENERIC_FOOD_IMAGE
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
export const MOVEMENT_FILTER_TYPES = {
  ingresos: ['INICIAL', 'INGRESO'],
  egresos: ['EGRESO', 'VENTA'],
  ajustes: ['AJUSTE'],
}
