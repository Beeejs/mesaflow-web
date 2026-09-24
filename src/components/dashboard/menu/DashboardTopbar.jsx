/* Components */
import SessionMenu from '../../menu/SessionMenu'
import MobileMenuButton from '../../menu/MobileMenuButton'

const DashboardTopbar = ({ onOpenSidebar, triggerRef }) => {
  return (
    <header className="sticky top-0 z-40 border-b border-mesa-border bg-mesa-bg/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-mesa-cyan sm:text-xs sm:tracking-[0.25em]">
            Panel de gestión
          </p>

          <h1 className="mt-1 font-display text-xl font-bold text-mesa-text sm:text-2xl">
            MesaFlow
          </h1>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <SessionMenu variant="dashboard" />

          <MobileMenuButton
            onClick={onOpenSidebar}
            className="min-[1200px]:hidden"
            ref={triggerRef}
          />
      </div>
      </div>
    </header>
  )
}

export default DashboardTopbar