import TextField from '@mui/material/TextField'

const inputStyles = {
  '& label': {
    color: '#94A3B8',
  },
  '& label.Mui-focused': {
    color: '#10C4FC',
  },
  '& .MuiOutlinedInput-root': {
    color: '#F8FAFC',
    backgroundColor: '#03070F',
    borderRadius: '16px',
    '& fieldset': {
      borderColor: '#1F2937',
    },
    '&:hover fieldset': {
      borderColor: '#056EF8',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#10C4FC',
    },
  },
}

const AuthForm = ({ mode }) => {
  // Determinar si el formulario es de registro o inicio de sesión
  const isRegister = mode === 'register'

  // Funcion para manejar el envio del formulario
  const handleSubmit = (event) => {
    event.preventDefault()

    if (isRegister) {
      console.log('Crear cuenta')
      return
    }

    console.log('Iniciar sesión')
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      {isRegister && (
        <>
          <TextField
            label="Nombre"
            placeholder="Ej: Facundo"
            variant="outlined"
            fullWidth
            required
            sx={inputStyles}
          />

          <TextField
            label="Apellido"
            placeholder="Ej: Marconi"
            variant="outlined"
            fullWidth
            required
            sx={inputStyles}
          />
        </>
      )}

      <TextField
        label="Email"
        placeholder="Ej: usuario@mesaflow.com"
        variant="outlined"
        fullWidth
        required
        type="email"
        sx={inputStyles}
      />

      <TextField
        label="Contraseña"
        placeholder="Ingresá tu contraseña"
        variant="outlined"
        fullWidth
        required
        type="password"
        sx={inputStyles}
      />

      {isRegister && (
        <TextField
          label="Confirmar contraseña"
          placeholder="Repetí tu contraseña"
          variant="outlined"
          fullWidth
          required
          type="password"
          sx={inputStyles}
        />
      )}

      <button
        type="submit"
        className="mt-2 cursor-pointer rounded-xl bg-mesa-primary px-6 py-3 font-semibold text-white shadow-lg shadow-mesa-primary/25 transition hover:bg-mesa-primary-dark"
      >
        {isRegister ? 'Crear cuenta' : 'Iniciar sesión'}
      </button>
    </form>
  )
}

export default AuthForm