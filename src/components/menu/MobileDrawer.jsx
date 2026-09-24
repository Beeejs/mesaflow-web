
import { useEffect, useRef } from 'react'

const MobileDrawer = ({
  isOpen,
  onClose,
  children,
  variant = 'home',
  triggerRef,
}) => {
  const isDashboard = variant === 'dashboard'
  const drawerRef = useRef(null)

  const handleClose = () => {
    // Devolver el foco a la hamburguesa antes de ocultar el menú.
    if (drawerRef.current?.contains(document.activeElement)) {
      triggerRef?.current?.focus()
    }

    onClose()
  }

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (drawerRef.current?.contains(document.activeElement)) {
          triggerRef?.current?.focus()
        }

        onClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose, triggerRef])

  return (
    <div
      className={`
        fixed inset-0 z-[60]
        ${isDashboard ? 'min-[1200px]:hidden' : 'lg:hidden'}
        ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}
      `}
    >
      <button
        type="button"
        onClick={handleClose}
        aria-label="Cerrar menú de navegación"
        tabIndex={isOpen ? 0 : -1}
        className={`
          absolute inset-0 bg-black/60
          backdrop-blur-sm transition-opacity duration-300
          ${isOpen ? 'opacity-100' : 'opacity-0'}
        `}
      />

      <aside
        ref={drawerRef}
        aria-label="Menú de navegación"
        inert={!isOpen}
        className={`
          absolute right-0 top-0
          flex h-full w-[78%] max-w-sm flex-col
          border-l border-mesa-border
          px-5 py-5 shadow-2xl shadow-black/40
          transition-transform duration-300 ease-out
          ${isDashboard ? 'bg-mesa-surface' : 'bg-mesa-bg'}
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {children}
      </aside>
    </div>
  )
}

export default MobileDrawer