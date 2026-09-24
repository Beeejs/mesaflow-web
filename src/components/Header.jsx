import { useContext, useState } from 'react'

import { toast } from 'sonner'

/* Components */
import Logo from './Logo'
import Navbar from './Navbar'
import AssociateDialog from './pages/associate/AssociateDialog'
import SessionMenu from './menu/SessionMenu'
import MobileMenu from './menu/MobileMenu'
import MobileMenuButton from './menu/MobileMenuButton'

/* Context */
import { SessionContext } from '../context/SessionContext'

const Header = () => {
  const [isAssociateDialogOpen, setIsAssociateDialogOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { isAuthenticated, isLoadingSession } = useContext(SessionContext)

  // Funcion para abrir el diálogo de asociación. Solo se permite si el usuario está autenticado y la sesión no está en proceso de carga.
  const openAssociateDialog = () => {
    if (isLoadingSession) {
      toast.info('Estamos verificando tu sesión. Intentá nuevamente en unos segundos.')
      return
    }

    if (!isAuthenticated) {
      toast.warning('Debés iniciar sesión para realizar esta acción.')
      return
    }

    setIsAssociateDialogOpen(true)
  }

  // Funcion para cerrar el diálogo de asociación
  const closeAssociateDialog = () => {
    setIsAssociateDialogOpen(false)
  }

  // Funcion para alternar el estado del menú de navegación en dispositivos móviles
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prevState) => !prevState)
  }

  // Funcion para cerrar el menú de navegación
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-mesa-border/80 bg-mesa-bg/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8 lg:py-4">
          <Logo />

          <div className="hidden lg:block">
            <Navbar
              isAuthenticated={isAuthenticated}
              onOpenAssociateDialog={openAssociateDialog}
            />
          </div>

          <div className="hidden lg:flex lg:items-center">
            <SessionMenu />
          </div>

          
          <MobileMenuButton
            isOpen={isMobileMenuOpen}
            onClick={toggleMobileMenu}
            className="lg:hidden"
          />
        </div>
      </header>

      <MobileMenu
        isOpen={isMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        onClose={closeMobileMenu}
        onOpenAssociateDialog={openAssociateDialog}
      />

      <AssociateDialog
        open={isAssociateDialogOpen}
        onClose={closeAssociateDialog}
      />
    </>
  )
}

export default Header