const Loader = ({
  fullScreen = false,
  size = 200,
}) => {
  const content = (
    <div className="flex flex-col items-center justify-center">
      <img
        src="/loaders/mesaflow-loader-app.gif"
        alt="Loader"
        style={{
          width: size,
          height: size,
        }}
        className="object-contain"
      />
    </div>
  )

  /* Si es pantalla completa mlo mostramos ocupando toda la pantalla con bg */
  if (fullScreen) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-mesa-bg px-4">
        {content}
      </div>
    )
  }

  return (
    <div >
      {content}
    </div>
  )
}

export default Loader