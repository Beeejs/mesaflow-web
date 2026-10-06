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
  withCredentials: true,
})

const methodsWithCsrf = ['post', 'put', 'patch', 'delete']


/*
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