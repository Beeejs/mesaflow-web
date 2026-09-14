import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

/*
 * IMPLEMENTACIÓN ANTERIOR
 *
 * En desarrollo local obteníamos el token CSRF leyendo
 * directamente la cookie XSRF-TOKEN mediante document.cookie.
 *
 * Esto funciona cuando frontend y backend trabajan sobre localhost,
 * pero no cuando React está en Vercel y el backend en Azure,
 * porque JavaScript no puede leer cookies pertenecientes
 * a otro dominio.
 *
 * Se mantiene comentado temporalmente para facilitar rollback.
 */

/*
const getCookieValue = (cookieName) => {
  const cookies = document.cookie.split('; ')

  const cookie = cookies.find((item) =>
    item.startsWith(`${cookieName}=`)
  )

  if (!cookie) {
    return null
  }

  return decodeURIComponent(cookie.split('=')[1])
}
*/

const csrfApi = axios.create({
  baseURL: API_URL,
  withCredentials: true,
})

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

const methodsWithCsrf = ['post', 'put', 'patch', 'delete']

/*
 * IMPLEMENTACIÓN ANTERIOR
 *
 * El token CSRF se buscaba en document.cookie.
 *
 * Si no existía, se llamaba a /api/csrf para que Spring
 * generara la cookie XSRF-TOKEN y luego se intentaba
 * leer nuevamente desde document.cookie.
 */

/*
let csrfRequest = null

const ensureCsrfToken = async () => {
  let csrfToken = getCookieValue('XSRF-TOKEN')

  if (csrfToken) {
    return csrfToken
  }

  if (!csrfRequest) {
    csrfRequest = csrfApi.get('/api/csrf')
  }

  await csrfRequest
  csrfRequest = null

  return getCookieValue('XSRF-TOKEN')
}
*/


/*
 * IMPLEMENTACIÓN INTERMEDIA
 *
 * Esta versión obtenía el token desde el body de /api/csrf
 * y lo guardaba en memoria.
 *
 * Permitía trabajar entre Vercel y Azure, pero podía producir
 * una desincronización si Spring cambiaba la cookie XSRF-TOKEN
 * mientras React seguía conservando un token anterior.
 */

/*
let csrfToken = null
let csrfRequest = null

export const clearCsrfToken = () => {
  csrfToken = null
}

const ensureCsrfToken = async () => {

  if (csrfToken) {
    return csrfToken
  }

  if (!csrfRequest) {
    csrfRequest = csrfApi.get('/api/csrf')
  }

  try {
    const response = await csrfRequest

    csrfToken = response.data.response

    return csrfToken

  } finally {
    csrfRequest = null
  }
}
*/


/*
 * NUEVA IMPLEMENTACIÓN
 *
 * Antes de cada operación que modifica datos:
 *
 * POST
 * PUT
 * PATCH
 * DELETE
 *
 * se solicita un token CSRF actualizado al backend.
 *
 * El backend devuelve el token en:
 *
 * response.data.response
 *
 * y además genera/actualiza la cookie XSRF-TOKEN.
 *
 * De esta forma evitamos reutilizar un token CSRF viejo.
 */
const getFreshCsrfToken = async () => {

  const response = await csrfApi.get('/api/csrf')

  return response.data.response
}


api.interceptors.request.use(async (config) => {

  const method = config.method?.toLowerCase()

  const needsCsrf = methodsWithCsrf.includes(method)

  if (!needsCsrf) {
    return config
  }

  /*
   * Pedimos siempre un CSRF actualizado antes de realizar
   * una operación sensible.
   */
  const token = await getFreshCsrfToken()

  if (token) {
    config.headers['X-XSRF-TOKEN'] = token
  }

  return config
})

export default api