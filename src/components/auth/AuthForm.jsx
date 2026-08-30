import { useContext, useEffect, useState } from 'react'

/* MUI */
import TextField from '@mui/material/TextField'

/* Componentes */
import DefaultButton from '../DefaultButton'

/* Hooks */
import useApiAction from '../../hooks/useApiActions'

/* Api */
import { register } from '../../api/authService'

/* Context */
import { SessionContext } from '../../context/SessionContext'

/* Sonner */
import { toast } from 'sonner'
import { useNavigate } from 'react-router'

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

// Data inicial del formulario de autenticación
const initialFormData = {
  nombre: '',
  apellido: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const AuthForm = ({ mode, onRegisterSuccess }) => {
  // Estado del formulario de autenticación
  const [formData, setFormData] = useState(initialFormData)

  // Contexto de sesión
  const { loginUser } = useContext(SessionContext)

  // Hook de navegación para redirigir al usuario después del inicio de sesión o registro
  const navigate = useNavigate()

  // Condicion para determinar si el formulario es de registro o de inicio de sesión
  const isRegister = mode === 'register'

  // Hooks
  const {
    data: loginData,
    loading: loginLoading,
    error: loginError,
    action: loginAction,
  } = useApiAction(loginUser)

  const {
    data: registerData,
    loading: registerLoading,
    error: registerError,
    action: registerAction,
  } = useApiAction(register)

  // Condicion para determinar si el formulario está en proceso de carga (login o registro)
  const isLoading = loginLoading || registerLoading

  // Función para manejar los cambios en los campos del formulario
  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  // Función para validar el formulario
  const validateForm = () => {
    if (isRegister && formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden.')
      return false
    }

    return true
  }

  // Función para manejar el envío del formulario
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

  // Efecto para manejar el registro exitoso y mostrar un mensaje de éxito
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

  // Efecto para manejar el inicio de sesión exitoso
  useEffect(() => {
    if (!loginData) {
      return
    }

    toast.success('Inicio de sesión exitoso.')

    navigate('/')
  }, [loginData, navigate])

  // Efecto para manejar los errores de inicio de sesión y registro
  useEffect(() => {
    const error = loginError || registerError

    if (!error) {
      return
    }

    toast.error(error)
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

      <DefaultButton
        type="submit"
        loading={isLoading}
        fullWidth
      >
        {isLoading
          ? 'Cargando'
          : isRegister
            ? 'Crear cuenta'
            : 'Iniciar sesión'}
      </DefaultButton>
    </form>
  )
}

export default AuthForm