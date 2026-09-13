import SessionMenu from "../menu/SessionMenu"

const DashboardTopbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b border-mesa-border bg-mesa-bg/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
            Panel de gestión
          </p>

          <h1 className="mt-1 font-display text-xl font-bold text-mesa-text sm:text-2xl">
            MesaFlow
          </h1>
        </div>

        <SessionMenu variant="dashboard"/>
      </div>
    </header>
  )
}

export default DashboardTopbar