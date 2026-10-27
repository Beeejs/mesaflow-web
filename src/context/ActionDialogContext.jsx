import { createContext, useCallback, useState } from 'react'

// eslint-disable-next-line react-refresh/only-export-components
export const ActionDialogContext = createContext(null)

const initialDialog = {
  open: false,
  title: '',
  description: '',
  actionLabel: 'Confirmar',
  cancelLabel: 'Cancelar',
  variant: 'primary',
  icon: 'warning',
  onAction: null,
}

export const ActionDialogProvider = ({ children }) => {
  // Hooks
  const [dialog, setDialog] = useState(initialDialog)

  // Funciones
  const openActionDialog = useCallback((options) => {
    setDialog({
      ...initialDialog,
      ...options,
      open: true,
    })
  }, [])

  const closeActionDialog = useCallback(() => {
    setDialog((prev) => ({
      ...prev,
      open: false,
    }))
  }, [])

  const resetActionDialog = useCallback(() => {
    setDialog(initialDialog)
  }, [])

  // Renderizado
  return (
    <ActionDialogContext.Provider
      value={{
        dialog,
        openActionDialog,
        closeActionDialog,
        resetActionDialog,
      }}
    >
      {children}
    </ActionDialogContext.Provider>
  )
}