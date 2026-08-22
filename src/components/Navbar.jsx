import { useState } from 'react'
import { navbarList } from '../constants/constants'

const Navbar = () => {
  const [activeItem, setActiveItem] = useState('#inicio')

  return (
    <nav className="flex items-center justify-center gap-8">
      {navbarList.map((item) => {
        const isActive = activeItem === item.href

        return (
          <a
            key={item.href}
            href={item.href}
            onClick={() => setActiveItem(item.href)}
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
        href="#registro"
        onClick={() => setActiveItem('#registro')}
        className="rounded-xl bg-mesa-primary px-5 py-2.5 text-sm font-semibold tracking-wide text-white shadow-lg shadow-mesa-primary/25 transition-colors duration-200 hover:bg-mesa-primary-dark">
        Registrarse
      </a>
    </nav>
  )
}

export default Navbar