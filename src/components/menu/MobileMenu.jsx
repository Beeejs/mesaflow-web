
/* Components */
import Logo from '../Logo'
import Navbar from '../Navbar'
import SessionMenu from './SessionMenu'
import MobileDrawer from './MobileDrawer'
import MobileMenuButton from './MobileMenuButton'

const MobileMenu = ({
  isOpen,
  isAuthenticated,
  onClose,
  onOpenAssociateDialog,
}) => {
  return (
    <MobileDrawer isOpen={isOpen} onClose={onClose}>
      <div className="flex items-center justify-between gap-4">
        <Logo />

        <MobileMenuButton
          variant="close"
          onClick={onClose}
        />
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
    </MobileDrawer>
  )
}

export default MobileMenu