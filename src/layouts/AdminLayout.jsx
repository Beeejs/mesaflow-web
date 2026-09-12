import { NavLink, Outlet, Link } from 'react-router'
import { useContext } from 'react'
import { toast } from 'sonner'

/* MUI Icons */
import HomeIcon from '@mui/icons-material/Home'
import LogoutIcon from '@mui/icons-material/Logout'

/* Constants */
import { adminNavigation } from '../constants/constants'

/* Context */
import { SessionContext } from '../context/SessionContext'

const AdminLayout = () => {
  const { user, logoutUser } = useContext(SessionContext)

  const handleLogout = async () => {
    try {
      await logoutUser()

      toast.success('Sesión cerrada correctamente.')
    } catch {
      toast.error('No se pudo cerrar la sesión.')
    }
  }

  return (
    <div className="min-h-screen bg-mesa-bg text-mesa-text">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-mesa-border bg-mesa-surface/70 px-5 py-6 lg:flex lg:flex-col">
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/logo/mesaFlow_circular_logo.png"
              alt="Logo MesaFlow"
              className="h-12 w-12 rounded-full object-contain"
            />

            <div>
              <p className="font-display text-lg font-bold text-mesa-text">
                Mesa<span className="text-mesa-primary">Flow</span>
              </p>

              <p className="mt-1 text-[10px] font-semibold tracking-[0.2em] text-mesa-muted">
                ADMIN
              </p>
            </div>
          </Link>

          <nav className="mt-10 grid gap-2">
            {adminNavigation.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? 'bg-mesa-primary text-white shadow-lg shadow-mesa-primary/20'
                        : 'text-mesa-muted hover:bg-mesa-card hover:text-mesa-text'
                    }`
                  }
                >
                  <Icon sx={{ fontSize: 20 }} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>

          <div className="mt-auto grid gap-2 border-t border-mesa-border pt-5">
            <Link
              to="/"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-mesa-muted transition hover:bg-mesa-card hover:text-mesa-text"
            >
              <HomeIcon sx={{ fontSize: 20 }} />
              Volver al inicio
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="flex cursor-pointer items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-mesa-muted transition hover:bg-mesa-card hover:text-red-300"
            >
              <LogoutIcon sx={{ fontSize: 20 }} />
              Cerrar sesión
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 border-b border-mesa-border bg-mesa-bg/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
                  Panel de administración
                </p>

                <h1 className="mt-1 font-display text-xl font-bold text-mesa-text sm:text-2xl">
                  MesaFlow
                </h1>
              </div>

              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-mesa-text">
                  {user?.nombre} {user?.apellido}
                </p>

                <p className="text-xs text-mesa-muted">
                  {user?.rol}
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout