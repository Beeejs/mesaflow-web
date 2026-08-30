import { useContext, useState } from 'react'
import { toast } from 'sonner'

/* Components */
import Logo from './Logo'
import Navbar from './Navbar'
import AssociateDialog from './associate/AssociateDialog'

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

          <button
            type="button"
            onClick={toggleMobileMenu}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-mesa-border bg-mesa-surface text-mesa-text transition hover:border-mesa-primary/60 lg:hidden"
            aria-label={isMobileMenuOpen ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            aria-expanded={isMobileMenuOpen}
          >
            <span className="relative h-4 w-5">
              <span
                className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition ${
                  isMobileMenuOpen ? 'top-2 rotate-45' : 'top-0'
                }`}
              />

              <span
                className={`absolute left-0 top-2 h-0.5 w-5 rounded-full bg-current transition ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />

              <span
                className={`absolute left-0 h-0.5 w-5 rounded-full bg-current transition ${
                  isMobileMenuOpen ? 'top-2 -rotate-45' : 'top-4'
                }`}
              />
            </span>
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="border-t border-mesa-border bg-mesa-bg px-4 py-5 sm:px-6 lg:hidden">
            <Navbar
              variant="mobile"
              isAuthenticated={isAuthenticated}
              onOpenAssociateDialog={openAssociateDialog}
              onNavigate={closeMobileMenu}
            />
          </div>
        )}
      </header>

      <AssociateDialog
        open={isAssociateDialogOpen}
        onClose={closeAssociateDialog}
      />
    </>
  )
}

export default Header