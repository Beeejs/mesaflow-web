import { useState, useContext } from 'react'
import { Link } from 'react-router'
/* Constants */
import { navbarList } from '../constants/constants'
/* Components */
import DefaultButton from './button/DefaultButton'
/* Context */
import { SessionContext } from '../context/SessionContext'

const Navbar = ({ onOpenAssociateDialog, onNavigate, variant = 'desktop' }) => {
  const [activeItem, setActiveItem] = useState('#inicio')
  const { isAuthenticated } = useContext(SessionContext)

  const isMobile = variant === 'mobile'

  // Función para manejar la navegación y establecer el elemento activo
  const handleNavigate = (href) => {
    setActiveItem(href)

    if (onNavigate) {
      onNavigate()
    }
  }

  return (
    <nav
      className={
        isMobile
          ? 'flex flex-col items-start gap-4'
          : 'flex items-center justify-center gap-8'
      }
    >
      {navbarList.map((item) => {
        const isActive = activeItem === item.href

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={() => handleNavigate(item.href)}
            className={`text-sm font-semibold tracking-wide transition-colors duration-200 ${
              isActive
                ? 'text-mesa-primary'
                : 'text-mesa-muted hover:text-mesa-text'
            }`}
          >
            {item.label}
          </a>
        )
      })}

     {!isAuthenticated && (
        <Link
          to="/login"
          onClick={() => {
            if (onNavigate) {
              onNavigate()
            }
          }}
          className="text-sm font-semibold tracking-wide text-mesa-muted transition-colors duration-200 hover:text-mesa-text"
        >
          Iniciar sesión
        </Link>
      )}

      <DefaultButton
        type="button"
        onClick={() => {
          onOpenAssociateDialog()

          if (onNavigate) {
            onNavigate()
          }
        }}
        sx={{
          padding: '5px 20px'
        }}
      >
        Asociate con nosotros
      </DefaultButton>
    </nav>
  )
}

export default Navbar