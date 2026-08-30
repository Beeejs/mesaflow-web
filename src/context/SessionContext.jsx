import { createContext, useCallback, useEffect, useMemo, useState } from 'react'

/* Api */
import {
  getCurrentUser,
  login,
  logout,
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
    const loggedUser = await login(loginData)

    setUser(loggedUser)

    return loggedUser
  }, [])

  // Función para cerrar sesión y limpiar el estado del usuario
  const logoutUser = useCallback(async () => {
    await logout()

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
    }
  }, [
    user,
    isLoadingSession,
    loginUser,
    logoutUser,
    refreshSession,
  ])

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  )
}