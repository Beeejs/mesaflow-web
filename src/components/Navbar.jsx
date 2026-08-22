import { useState } from 'react'
import { navbarList } from '../constants/constants'

const Navbar = ({ onOpenAssociateDialog, onNavigate, variant = 'desktop' }) => {
  const [activeItem, setActiveItem] = useState('#inicio')

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

      <a
        href="/login"
        onClick={() => {
          if (onNavigate) {
            onNavigate()
          }
        }}
        className="text-sm font-semibold tracking-wide text-mesa-muted transition-colors duration-200 hover:text-mesa-text"
      >
        Iniciar sesión
      </a>

      <button
        type="button"
        onClick={() => {
          onOpenAssociateDialog()

          if (onNavigate) {
            onNavigate()
          }
        }}
        className={
          isMobile
            ? 'w-full cursor-pointer rounded-xl bg-mesa-primary px-5 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-mesa-primary/25 transition-colors duration-200 hover:bg-mesa-primary-dark'
            : 'cursor-pointer rounded-xl bg-mesa-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-mesa-primary/25 transition-colors duration-200 hover:bg-mesa-primary-dark'
        }
      >
        Asociate con nosotros
      </button>
    </nav>
  )
}

export default Navbar