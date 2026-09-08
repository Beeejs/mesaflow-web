import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

/* Api */
import {
  getCsrfToken,
  getCurrentUser,
  login,
  logout,
  googleLogin
} from '../api/authService'

// eslint-disable-next-line react-refresh/only-export-components
export const SessionContext = createContext(null)

export const SessionProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isLoadingSession, setIsLoadingSession] = useState(true)

  // Función para refrescar la sesión y obtener el usuario autenticado actual
  const refreshSession = useCallback(async () => {
    try {
      setIsLoadingSession(true)

      await getCsrfToken() // Obtener el token CSRF
      const currentUser = await getCurrentUser()
      console.log('Usuario autenticado actual:', currentUser)

      setUser(currentUser)

      return currentUser
    } catch {
      setUser(null)

      return null
    } finally {
      setIsLoadingSession(false)
    }
  }, [])

  // Función para iniciar sesión y actualizar el estado del usuario
  const loginUser = useCallback(async (loginData) => {
    await getCsrfToken() // Obtener el token CSRF antes de iniciar sesión
    const loggedUser = await login(loginData)
    await getCsrfToken() // Obtener el token CSRF después de iniciar sesión

    setUser(loggedUser)

    return loggedUser
  }, [])

  const googleLoginUser = useCallback(async (idToken) => {
    await getCsrfToken()

    const loggedUser = await googleLogin({
      idToken,
      origenRegistro: 'WEB',
    })

    await getCsrfToken()

    setUser(loggedUser)

    return loggedUser
  }, [])

  // Función para cerrar sesión y limpiar el estado del usuario
  const logoutUser = useCallback(async () => {
    await getCsrfToken() // Obtener el token CSRF antes de cerrar sesión
    await logout()
    await getCsrfToken() // Obtener el token CSRF después de cerrar sesión

    setUser(null)
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshSession()
  }, [refreshSession])

  const value = useMemo(() => {
    return {
      user,
      isAuthenticated: Boolean(user),
      isLoadingSession,
      loginUser,
      logoutUser,
      refreshSession,
      googleLoginUser
    }
  }, [
    user,
    isLoadingSession,
    loginUser,
    logoutUser,
    refreshSession,
    googleLoginUser
  ])

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}