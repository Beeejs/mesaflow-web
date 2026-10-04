import { createContext, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const WorkspaceContext = createContext()

export const WorkspaceProvider = ({ children }) => {
  // Hooks
  const [selectedEstablishment, setSelectedEstablishment] = useState(null)

  // Funciones
  const selectEstablishment = (establishment) => {
    setSelectedEstablishment(establishment)
  }

  const clearEstablishment = () => {
    setSelectedEstablishment(null)
  }

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