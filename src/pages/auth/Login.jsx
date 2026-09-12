import { useState } from 'react'
import { Link } from 'react-router'

import AuthForm from '../../components/auth/AuthForm'
import BackLink from '../../components/button/BackLink'

const Login = () => {
  const [mode, setMode] = useState('login')

  const isRegister = mode === 'register'

  // Función para cambiar el modo de autenticación
  const handleChangeMode = () => {
    setMode((prevMode) => (prevMode === 'login' ? 'register' : 'login'))
  }

  // Función para manejar la navegación después del registro exitoso
  const handleGoToLogin = () => {
    setMode('login')
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-12 sm:px-6 lg:px-8">
      <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-mesa-primary/20 blur-3xl sm:h-96 sm:w-96" />
      <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-mesa-cyan/10 blur-3xl sm:h-80 sm:w-80" />

      <section className="relative grid w-full max-w-6xl overflow-hidden rounded-3xl border border-mesa-border bg-mesa-surface/80 shadow-2xl shadow-mesa-primary/10 backdrop-blur lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden border-r border-mesa-border bg-mesa-bg/60 p-10 lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <img
              src="/logo/mesaFlow_circular_logo.png"
              alt="Logo MesaFlow"
              className="h-14 w-14 rounded-full object-contain"
            />

            <div>
              <p className="font-display text-xl font-bold text-mesa-text">
                Mesa<span className="text-mesa-primary">Flow</span>
              </p>

              <p className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-mesa-muted">
                PEDÍ · DISFRUTÁ · FLUYE
              </p>
            </div>
          </Link>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-mesa-cyan">
              Acceso a plataforma
            </p>

            <h1 className="font-display mt-4 text-4xl font-bold leading-tight text-mesa-text">
              Gestioná tu establecimiento desde un solo lugar
            </h1>

            <p className="mt-5 leading-7 text-mesa-muted">
              Ingresá a MesaFlow para administrar reservas, pedidos, mesas,
              usuarios y la operación diaria de tu restaurante.
            </p>
          </div>

          <p className="text-sm leading-6 text-mesa-muted">
            El registro queda sujeto a revisión y habilitación por parte del
            equipo de MesaFlow.
          </p>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <BackLink />

          <Link to="/" className="mb-8 flex items-center gap-3 lg:hidden">
            <img
              src="/logo/mesaFlow_circular_logo.png"
              alt="Logo MesaFlow"
              className="h-12 w-12 rounded-full object-contain"
            />

            <div>
              <p className="font-display text-lg font-bold text-mesa-text">
                Mesa<span className="text-mesa-primary">Flow</span>
              </p>

              <p className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-mesa-muted">
                PEDÍ · DISFRUTÁ · FLUYE
              </p>
            </div>
          </Link>

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-mesa-cyan sm:text-sm">
            {isRegister ? 'Crear cuenta' : 'Bienvenido'}
          </p>

          <h2 className="font-display mt-4 text-3xl font-bold text-mesa-text sm:text-4xl">
            {isRegister ? 'Registrate en MesaFlow' : 'Iniciar sesión'}
          </h2>

          <p className="mt-4 text-sm leading-6 text-mesa-muted sm:text-base sm:leading-7">
            {isRegister
              ? 'Completá tus datos para solicitar el acceso a la plataforma.'
              : 'Ingresá con tus credenciales para acceder al panel de gestión.'}
          </p>

          <AuthForm
            key={mode}
            mode={mode}
            onRegisterSuccess={handleGoToLogin}
          />

          <div className="mt-6 border-t border-mesa-border pt-6 text-center">
            <p className="text-sm text-mesa-muted">
              {isRegister ? '¿Ya tenés cuenta?' : '¿No tenés cuenta?'}{' '}

              <button
                type="button"
                onClick={handleChangeMode}
                className="cursor-pointer font-semibold text-mesa-cyan-light transition hover:text-mesa-primary"
              >
                {isRegister ? 'Iniciar sesión' : 'Registrate'}
              </button>
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Login