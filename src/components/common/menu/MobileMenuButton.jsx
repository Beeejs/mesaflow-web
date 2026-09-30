
import CloseIcon from '@mui/icons-material/Close'

const MobileMenuButton = ({
  variant = 'menu',
  isOpen = false,
  onClick,
  className = '',
  ref,
}) => {
  const isClose = variant === 'close'

  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={
        isClose || isOpen
          ? 'Cerrar menú de navegación'
          : 'Abrir menú de navegación'
      }
      aria-expanded={isClose ? undefined : isOpen}
      className={`
        flex shrink-0 cursor-pointer items-center justify-center
        rounded-xl border border-mesa-border
        bg-mesa-surface text-mesa-text
        transition hover:border-mesa-primary/60
        ${isClose ? 'h-10 w-10' : 'h-11 w-11'}
        ${className}
      `}
    >
      {isClose ? (
        <CloseIcon sx={{ fontSize: 22 }} />
      ) : (
        <span className="relative h-4 w-5">
          <span
            className={`
              absolute left-0 h-0.5 w-5 rounded-full
              bg-current transition
              ${isOpen ? 'top-2 rotate-45' : 'top-0'}
            `}
          />

          <span
            className={`
              absolute left-0 top-2 h-0.5 w-5
              rounded-full bg-current transition
              ${isOpen ? 'opacity-0' : 'opacity-100'}
            `}
          />

          <span
            className={`
              absolute left-0 h-0.5 w-5
              rounded-full bg-current transition
              ${isOpen ? 'top-2 -rotate-45' : 'top-4'}
            `}
          />
        </span>
      )}
    </button>
  )
}

export default MobileMenuButton