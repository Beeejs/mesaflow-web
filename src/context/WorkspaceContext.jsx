import {
  createContext,
  useCallback,
  useState,
} from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const WorkspaceContext = createContext()

export const WorkspaceProvider = ({ children }) => {
  // Hooks
  const [selectedEstablishment, setSelectedEstablishment] = useState(null)

  // Funciones
  const selectEstablishment = useCallback((establishment) => {
    setSelectedEstablishment(establishment)
  }, [])

  const clearEstablishment = useCallback(() => {
    setSelectedEstablishment(null)
  }, [])

  // Renderizado
  return (
    <WorkspaceContext.Provider
      value={{
        selectedEstablishment,
        selectEstablishment,
        clearEstablishment,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}