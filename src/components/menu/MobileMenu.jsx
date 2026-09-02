import CloseIcon from '@mui/icons-material/Close'

/* Components */
import Logo from '../Logo'
import Navbar from '../Navbar'
import SessionMenu from './SessionMenu'

const MobileMenu = ({
  isOpen,
  isAuthenticated,
  onClose,
  onOpenAssociateDialog,
}) => {
  return (
    <div
      className={`fixed inset-0 z-60 lg:hidden ${
        isOpen ? 'pointer-events-auto' : 'pointer-events-none'
      }`}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        aria-label="Cerrar menú de navegación"
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-[78%] max-w-sm flex-col border-l border-mesa-border bg-mesa-bg px-5 py-5 shadow-2xl shadow-black/40 transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between gap-4">
          <Logo />

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-xl border border-mesa-border bg-mesa-surface text-mesa-text transition hover:border-mesa-primary/60"
            aria-label="Cerrar menú de navegación"
          >
            <CloseIcon sx={{ fontSize: 22 }} />
          </button>
        </div>

        <div className="mt-8">
          <Navbar
            variant="mobile"
            isAuthenticated={isAuthenticated}
            onOpenAssociateDialog={onOpenAssociateDialog}
            onNavigate={onClose}
          />
        </div>

        <div className="mt-auto border-t border-mesa-border pt-5">
          <SessionMenu />
        </div>
      </aside>
    </div>
  )
}

export default MobileMenu