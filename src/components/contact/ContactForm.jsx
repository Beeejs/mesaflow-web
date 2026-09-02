import TextField from '@mui/material/TextField'
/* Components */
import DefaultButton from '../DefaultButton'

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
  '& .MuiInputBase-input::placeholder': {
    color: '#94A3B8',
    opacity: 1,
  },
}

const ContactForm = () => {
  return (
    <form className="rounded-3xl border border-mesa-border bg-mesa-surface/80 p-6 shadow-2xl shadow-mesa-primary/10 backdrop-blur">
      <div className="grid gap-5">
        <TextField
          label="Nombre del establecimiento"
          placeholder="Ej: Cervecería DobleSentido"
          variant="outlined"
          fullWidth
          sx={inputStyles}
        />

        <TextField
          label="Email de contacto"
          placeholder="Ej: contacto@restaurante.com"
          variant="outlined"
          fullWidth
          type="email"
          sx={inputStyles}
        />

        <TextField
          label="Mensaje"
          placeholder="Contanos brevemente qué necesitás o qué tipo de establecimiento tenés"
          variant="outlined"
          fullWidth
          multiline
          minRows={5}
          sx={inputStyles}
        />

        <DefaultButton
          type="submit"
          fullWidth
          className="mt-2 rounded-xl bg-mesa-primary px-6 py-3 font-semibold text-white shadow-lg shadow-mesa-primary/25 transition hover:bg-mesa-primary-dark"
        >
          Enviar consulta
        </DefaultButton>

        <p className="text-sm leading-6 text-mesa-muted">
          Al enviar la consulta, el equipo de MesaFlow podrá revisar la
          información y contactarte para continuar el proceso.
        </p>
      </div>
    </form>
  )
}

export default ContactForm