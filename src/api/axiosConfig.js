import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

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

api.interceptors.request.use(async (config) => {
  const method = config.method?.toLowerCase()

  const needsCsrf = methodsWithCsrf.includes(method)

  if (!needsCsrf) {
    return config
  }

  const csrfToken = await ensureCsrfToken()

  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken
  }

  return config
})

export default api