import { useState } from 'react'

/* MUI */
import TextField from '@mui/material/TextField'

/* Google */
import { GoogleLogin } from '@react-oauth/google'

/* Componentes */
import DefaultButton from '../common/button/DefaultButton'
import PasswordField from './PasswordField'

/* Hooks */
import useLoginMutation from '../../hooks/mutations/useLoginMutation'
import useRegisterMutation from '../../hooks/mutations/useRegisterMutation'
import useGoogleLoginMutation from '../../hooks/mutations/useGoogleLoginMutation'

/* Sonner */
import { toast } from 'sonner'
import { useNavigate } from 'react-router'

/* Styles */
import { textFieldStyles } from '../../styles/formStyles'

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

  // Hook de navegación para redirigir al usuario después del inicio de sesión o registro
  const navigate = useNavigate()

  // Condicion para determinar si el formulario es de registro o de inicio de sesión
  const isRegister = mode === 'register'

  // Hooks
  const loginMutation = useLoginMutation()
  const registerMutation = useRegisterMutation()
  const googleLoginMutation = useGoogleLoginMutation()

  // Condicion para determinar si el formulario está en proceso de carga (login o registro)
  const isLoading =
  loginMutation.isPending ||
  registerMutation.isPending ||
  googleLoginMutation.isPending

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
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLoading) return

    if (!validateForm()) return

    try {
      if (isRegister) {
        await registerMutation.mutateAsync({
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          email: formData.email.trim(),
          password: formData.password,
          origenRegistro: 'WEB',
        })

        toast.success(
          'Cuenta creada correctamente. Ya podés iniciar sesión.'
        )

        setTimeout(() => {
          onRegisterSuccess?.()
        }, 1000)

        return
      }

      await loginMutation.mutateAsync({
        email: formData.email.trim(),
        password: formData.password,
      })

      toast.success('Inicio de sesión exitoso.')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ocurrió un error. Intentá nuevamente más tarde.')
    }
  }

  // Función para manejar el inicio de sesión con Google
  const handleGoogleSuccess = async (credentialResponse) => {
    if (isLoading) return

    if (!credentialResponse.credential) {
      toast.error('No se recibió el token de Google.')
      return
    }

    try {
      await googleLoginMutation.mutateAsync(
        credentialResponse.credential
      )

      toast.success('Inicio de sesión con Google exitoso.')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Ocurrió un error. Intentá nuevamente más tarde.')
    }
  }
  // Función para manejar el error de inicio de sesión con Google
  const handleGoogleError = () => {
    toast.error('No se pudo iniciar sesión con Google.')
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
            sx={textFieldStyles}
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
            sx={textFieldStyles}
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
        sx={textFieldStyles}
      />

      <PasswordField
        label="Contraseña"
        name="password"
        value={formData.password}
        onChange={handleChange}
        sx={textFieldStyles}
        autoComplete={isRegister ? 'new-password' : 'current-password'}
      />

     {isRegister && (
      <PasswordField
        label="Confirmar contraseña"
        name="confirmPassword"
        value={formData.confirmPassword}
        onChange={handleChange}
        sx={textFieldStyles}
        autoComplete="new-password"
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

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-mesa-border" />

        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-mesa-muted">
          o
        </span>

        <span className="h-px flex-1 bg-mesa-border" />
      </div>
      {/* Google Auth */}
      <div className="flex justify-center overflow-hidden rounded-full">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={handleGoogleError}
          theme="filled_black"
          size="large"
          text={isRegister ? 'signup_with' : 'signin_with'}
          shape="pill"
          width="552"
          loading={googleLoginMutation.isPending}
        />
      </div>
    </form>
  )
}

export default AuthForm