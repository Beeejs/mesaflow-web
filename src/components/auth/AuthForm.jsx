import { useEffect, useState } from 'react'

/* MUI */
import TextField from '@mui/material/TextField'

/* Hooks */
import useApiAction from '../../hooks/useApiActions'

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

  const {
    data: loginData,
    loading: loginLoading,
    error: loginError,
    action: loginAction,
  } = useApiAction(login)

  const {
    data: registerData,
    loading: registerLoading,
    error: registerError,
    action: registerAction,
  } = useApiAction(register)

  const isLoading = loginLoading || registerLoading

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

  const saveSession = (data) => {
    const response = data.response || data

    if (response.token) {
      localStorage.setItem('token', response.token)
    }

    if (response.usuario) {
      localStorage.setItem('user', JSON.stringify(response.usuario))
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const isValid = validateForm()

    if (!isValid) {
      return
    }

    if (isRegister) {
      const registerPayload = {
        nombre: formData.nombre,
        apellido: formData.apellido,
        email: formData.email,
        password: formData.password,
        origenRegistro: 'WEB',
      }

      registerAction(registerPayload)
      return
    }

    const loginPayload = {
      email: formData.email,
      password: formData.password,
    }

    loginAction(loginPayload)
  }

  useEffect(() => {
    if (!registerData) {
      return
    }

    toast.success('Cuenta creada correctamente. Ya podés iniciar sesión.')

    const timer = setTimeout(() => {
      if (onRegisterSuccess) {
        onRegisterSuccess()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [registerData, onRegisterSuccess])

  useEffect(() => {
    if (!loginData) {
      return
    }

    saveSession(loginData)

    toast.success('Inicio de sesión exitoso.')
  }, [loginData])

  useEffect(() => {
    if(loginError || registerError) toast.error(loginError || registerError)
  }, [loginError, registerError])


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