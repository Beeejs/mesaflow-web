import { useState } from 'react'
import TextField from '@mui/material/TextField'
/* Api */
import { login, register } from '../../api/authService'
/* Sonner */
import { toast } from 'sonner'

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

const initialFormData = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const AuthForm = ({ mode, onRegisterSuccess }) => {
  const isRegister = mode === 'register'

  const [formData, setFormData] = useState(initialFormData)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (isRegister && formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden.')
      return false
    }

    return true
  }

  const getErrorMessage = (error) => {
    return (
      error.response?.data?.message ||
      error.response?.data?.mensaje ||
      error.response?.data?.error ||
      'Ocurrió un error. Intentá nuevamente.'
    )
  }

  const saveSession = (data) => {
    const response = data.response || data

    if (response.token) {
      localStorage.setItem('token', response.token)
    }

    if (response.usuario) {
      localStorage.setItem('user', JSON.stringify(response.usuario))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    try {
      setIsLoading(true)

      if (isRegister) {
        const registerPayload = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          email: formData.email,
          password: formData.password,
          origenRegistro: 'WEB',
        }

        await register(registerPayload)

        toast.success('Cuenta creada correctamente. Ya podés iniciar sesión.')

        setTimeout(() => {
          onRegisterSuccess()
        }, 1000)

        return
      }

      const loginPayload = {
        email: formData.email,
        password: formData.password,
      }

      const data = await login(loginPayload)

      saveSession(data)

      toast.success('Inicio de sesión exitoso.')
    } catch (error) {
      const message = getErrorMessage(error)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-5">
      {isRegister && (
        <>
          <TextField
            name="nombre"
            label="Nombre"
            placeholder="Ej: Facundo"
            value={formData.nombre}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            sx={inputStyles}
          />

          <TextField
            name="apellido"
            label="Apellido"
            placeholder="Ej: Marconi"
            value={formData.apellido}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            required
            sx={inputStyles}
          />
        </>
      )}

      <TextField
        name="email"
        label="Email"
        placeholder="Ej: usuario@mesaflow.com"
        value={formData.email}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        required
        type="email"
        sx={inputStyles}
      />

      <TextField
        name="password"
        label="Contraseña"
        placeholder="Ingresá tu contraseña"
        value={formData.password}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        required
        type="password"
        sx={inputStyles}
      />

      {isRegister && (
        <TextField
          name="confirmPassword"
          label="Confirmar contraseña"
          placeholder="Repetí tu contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          variant="outlined"
          fullWidth
          required
          type="password"
          sx={inputStyles}
        />
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="mt-2 cursor-pointer rounded-xl bg-mesa-primary px-6 py-3 font-semibold text-white shadow-lg shadow-mesa-primary/25 transition hover:bg-mesa-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isLoading
          ? 'Procesando...'
          : isRegister
            ? 'Crear cuenta'
            : 'Iniciar sesión'}
      </button>
    </form>
  )
}

export default AuthForm