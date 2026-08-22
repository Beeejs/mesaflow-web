const Logo = () => {
  return (
    <a
      href="/"
      aria-label="Ir a la página principal"
      className="flex shrink-0 items-center gap-3"
    >
      <img
        src="/logo/mesaFlow_circular_logo.png"
        alt="Logo MesaFlow"
        width="56"
        height="56"
        className="h-11 w-11 rounded-full object-contain sm:h-12 sm:w-12 lg:h-14 lg:w-14"
        title="Logo MesaFlow"
      />

      <div className="hidden sm:block">
        <p className="font-display text-lg font-bold leading-none text-mesa-text">
          Mesa<span className="text-mesa-primary">Flow</span>
        </p>

        <p className="mt-1 text-[10px] font-semibold tracking-[0.22em] text-mesa-muted">
          PEDÍ · DISFRUTÁ · FLUYE
        </p>
      </div>
    </a>
  )
}

export default Logo