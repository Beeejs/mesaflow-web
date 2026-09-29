import { useState } from 'react'
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

const AssociateForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    establishmentName: '',
    email: '',
    phone: '',
    message: '',
  })

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    console.log('Solicitud de asociación:', formData)

    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <TextField
        name="establishmentName"
        label="Nombre del establecimiento"
        placeholder="Ej: Cervecería DobleSentido"
        value={formData.establishmentName}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        required
        sx={inputStyles}
      />

      <TextField
        name="email"
        label="Email de contacto"
        placeholder="Ej: contacto@restaurante.com"
        value={formData.email}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        required
        type="email"
        sx={inputStyles}
      />

      <TextField
        name="phone"
        label="Teléfono / WhatsApp"
        placeholder="Ej: +54 9 11 1234-5678"
        value={formData.phone}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        required
        type="tel"
        sx={inputStyles}
      />

      <TextField
        name="message"
        label="Mensaje"
        placeholder="Contanos brevemente sobre tu establecimiento"
        value={formData.message}
        onChange={handleChange}
        variant="outlined"
        fullWidth
        required
        multiline
        minRows={5}
        sx={inputStyles}
      />

      <button
        type="submit"
        className="rounded-xl cursor-pointer bg-mesa-primary px-6 py-3 font-semibold text-white shadow-lg shadow-mesa-primary/25 transition hover:bg-mesa-primary-dark"
      >
        Enviar solicitud
      </button>

      <p className="text-sm leading-6 text-mesa-muted">
        Esta solicitud no crea una cuenta automáticamente. Primero revisamos el
        establecimiento y luego habilitamos el acceso.
      </p>
    </form>
  )
}

export default AssociateForm