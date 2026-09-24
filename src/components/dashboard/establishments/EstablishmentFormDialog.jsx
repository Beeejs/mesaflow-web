
import { useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DefaultButton from '../../button/DefaultButton'

/* Hooks */
import useProvincesQuery from '../../../hooks/queries/useProvincesQuery'
import useDistrictsQuery from '../../../hooks/queries/useDistrictsQuery'
import useEstablishmentStatesQuery from '../../../hooks/queries/useEstablishmentStatesQuery'
import useUpdateEstablishmentMutation from '../../../hooks/mutations/useUpdateEstablishmentMutation'

/* Utils */
import { hasFormChanges } from '../../../utils/formUtils'

/* Constants */
import { establishmentFields } from '../../../constants/constants'

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#F8FAFC',
    backgroundColor: '#03070F',
    borderRadius: '14px',

    '& fieldset': {
      borderColor: '#1F2937',
    },

    '&:hover fieldset': {
      borderColor: 'rgba(5, 110, 248, 0.6)',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#10C4FC',
    },
  },

  '& .MuiInputLabel-root': {
    color: '#94A3B8',
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#10C4FC',
  },

  '& .MuiSvgIcon-root': {
    color: '#94A3B8',
  },
  
  '& .MuiOutlinedInput-root.Mui-disabled': {
    backgroundColor: '#111827',
  },

  '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline': {
    borderColor: '#1F2937',
  },

  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#94A3B8',
    opacity: 1,
  },

  '& .MuiSelect-select.Mui-disabled': {
    WebkitTextFillColor: '#94A3B8',
    opacity: 1,
  },

  '& .MuiInputLabel-root.Mui-disabled': {
    color: '#64748B',
  },

  '& .MuiSvgIcon-root.Mui-disabled': {
    color: '#64748B',
  },
}

const selectSlotProps = {
  select: {
    MenuProps: {
      slotProps: {
        paper: {
          sx: {
            backgroundColor: '#0B111C',
            color: '#F8FAFC',
            border: '1px solid #1F2937',
            borderRadius: '16px',

            '& .MuiMenuItem-root:hover': {
              backgroundColor: '#111827',
            },

            '& .MuiMenuItem-root.Mui-selected': {
              backgroundColor: 'rgba(5, 110, 248, 0.18)',
            },
          },
        },
      },
    },
  },
}

const EstablishmentFormDialog = ({
  open,
  establishment,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    nombre: establishment?.nombre || '',
    razonSocial: establishment?.razonSocial || '',
    cuit: establishment?.cuit || '',
    direccion: establishment?.direccion || '',
    idProvincia: establishment?.idProvincia || '',
    idPartido: establishment?.idPartido || '',
    codigoPostal: establishment?.codigoPostal || '',
    telefono: establishment?.telefono || '',
    email: establishment?.email || '',
    idEstadoEstablecimiento:
      establishment?.idEstadoEstablecimiento || '',
  })

  const {
    data: provinces = [],
    isLoading: provincesLoading,
  } = useProvincesQuery()

  const {
    data: districts = [],
    isLoading: districtsLoading,
  } = useDistrictsQuery(formData.idProvincia)

  const {
    data: states = [],
    isLoading: statesLoading,
  } = useEstablishmentStatesQuery()

  const updateMutation = useUpdateEstablishmentMutation()

  const isSaving = updateMutation.isPending

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleProvinceChange = (event) => {
    const provinceId = Number(event.target.value)

    setFormData((current) => ({
      ...current,
      idProvincia: provinceId,
      idPartido: '',
    }))
  }

  // Evitamos valores fuera de rango mientras cargan los selects.
  const selectedProvince = provinces.some(
    (province) => province.idProvincia === Number(formData.idProvincia)
  )
    ? formData.idProvincia
    : ''

  const selectedDistrict = districts.some(
    (district) => district.idPartido === Number(formData.idPartido)
  )
    ? formData.idPartido
    : ''

  const selectedState = states.some(
    (state) =>
      state.idEstadoEstablecimiento ===
      Number(formData.idEstadoEstablecimiento)
  )
    ? formData.idEstadoEstablecimiento
    : ''

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault()

    // Evitamos que se envíe el formulario mientras se está guardando
    if (isSaving) return

    // Evitamos que se envíe el formulario sin cambios
    if (
      !hasFormChanges(
        establishment,
        formData,
        establishmentFields
      )
    ) {
      toast.info('No hay cambios para guardar.')
      return
    }

    if (
      !formData.nombre.trim() ||
      !formData.direccion.trim() ||
      !selectedDistrict ||
      !selectedState
    ) {
      toast.error('Completá los campos obligatorios.')
      return
    }

    const establishmentData = {
      nombre: formData.nombre.trim(),
      razonSocial: formData.razonSocial.trim(),
      cuit: formData.cuit.trim(),
      direccion: formData.direccion.trim(),
      idPartido: Number(selectedDistrict),
      codigoPostal: formData.codigoPostal.trim(),
      telefono: formData.telefono.trim(),
      email: formData.email.trim(),
      idEstadoEstablecimiento: Number(selectedState),
    }

    try {
      await updateMutation.mutateAsync({
        idEstablecimiento: establishment.idEstablecimiento,
        establishmentData,
      })

      toast.success('Establecimiento actualizado correctamente.')
      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'No se pudo actualizar el establecimiento.'
      )
    }
  }

  const selectsLoading =
    provincesLoading || districtsLoading || statesLoading

  return (
    <Dialog
      open={open}
      onClose={isSaving ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            border: '1px solid #1F2937',
            backgroundColor: '#0B111C',
            color: '#F8FAFC',
            maxHeight: '90dvh',
          },
        },
        backdrop: {
          sx: {
            backgroundColor: 'rgba(3, 7, 15, 0.78)',
            backdropFilter: 'blur(3px)',
          },
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle
          sx={{
            px: { xs: 3, sm: 4 },
            pt: 4,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
          }}
        >
          Editar establecimiento
        </DialogTitle>

        <DialogContent
          sx={{
            px: { xs: 3, sm: 4 },
            pt: 2,
            pb: 3,
          }}
        >
          <p className="mb-6 text-sm text-mesa-muted">
            Modificá los datos del establecimiento y gestioná su estado.
          </p>

          {/* Solicitante */}
          <div className="mb-6 rounded-2xl border border-mesa-border bg-mesa-bg p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-mesa-muted">
              Solicitante
            </p>

            <p className="mt-2 font-semibold text-mesa-text">
              {establishment.nombreUsuarioSolicitante}{' '}
              {establishment.apellidoUsuarioSolicitante}
            </p>

            <p className="mt-1 break-all text-sm text-mesa-muted">
              {establishment.emailUsuarioSolicitante}
            </p>
          </div>

          {/* Datos comerciales */}
          <h3 className="mb-4 font-display text-lg font-bold">
            Datos comerciales
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={isSaving}
              fullWidth
              required
              sx={textFieldStyles}
            />

            <TextField
              label="Razón social"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleChange}
              disabled={isSaving}
              fullWidth
              sx={textFieldStyles}
            />

            <TextField
              label="CUIT"
              name="cuit"
              value={formData.cuit}
              onChange={handleChange}
              disabled={isSaving}
              fullWidth
              sx={textFieldStyles}
            />

            <TextField
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={isSaving}
              fullWidth
              sx={textFieldStyles}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSaving}
              fullWidth
              sx={textFieldStyles}
            />
          </div>

          {/* Ubicación */}
          <h3 className="mb-4 mt-8 font-display text-lg font-bold">
            Ubicación
          </h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <TextField
              label="Dirección"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              disabled={isSaving}
              fullWidth
              required
              sx={textFieldStyles}
            />

            <TextField
              label="Código postal"
              name="codigoPostal"
              value={formData.codigoPostal}
              onChange={handleChange}
              disabled={isSaving}
              fullWidth
              sx={textFieldStyles}
            />

            <TextField
              select
              label="Provincia"
              name="idProvincia"
              value={selectedProvince}
              onChange={handleProvinceChange}
              disabled={provincesLoading || isSaving}
              fullWidth
              required
              sx={textFieldStyles}
              slotProps={selectSlotProps}
            >
              {provinces.map((province) => (
                <MenuItem
                  key={province.idProvincia}
                  value={province.idProvincia}
                >
                  {province.nombre}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              label="Partido"
              name="idPartido"
              value={selectedDistrict}
              onChange={handleChange}
              disabled={
                !formData.idProvincia ||
                districtsLoading ||
                isSaving
              }
              fullWidth
              required
              sx={textFieldStyles}
              slotProps={selectSlotProps}
            >
              {districts.map((district) => (
                <MenuItem
                  key={district.idPartido}
                  value={district.idPartido}
                >
                  {district.nombre}
                </MenuItem>
              ))}
            </TextField>
          </div>

          {/* Administración */}
          <h3 className="mb-4 mt-8 font-display text-lg font-bold">
            Administración
          </h3>

          <TextField
            select
            label="Estado del establecimiento"
            name="idEstadoEstablecimiento"
            value={selectedState}
            onChange={handleChange}
            disabled={statesLoading || isSaving}
            fullWidth
            required
            sx={textFieldStyles}
            slotProps={selectSlotProps}
          >
            {states.map((state) => (
              <MenuItem
                key={state.idEstadoEstablecimiento}
                value={state.idEstadoEstablecimiento}
              >
                {state.descripcion}
              </MenuItem>
            ))}
          </TextField>

          <p className="mt-3 text-xs leading-5 text-mesa-muted">
            Al guardar, el backend actualizará los datos y volverá
            a calcular las coordenadas del establecimiento.
          </p>
        </DialogContent>

        <DialogActions
          sx={{
            px: { xs: 3, sm: 4 },
            pb: 4,
            gap: 2,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-full border border-mesa-border px-5 py-3 text-sm font-bold text-mesa-muted transition hover:bg-mesa-card disabled:opacity-60"
          >
            Cancelar
          </button>

          <DefaultButton
            type="submit"
            disabled={isSaving || selectsLoading}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <CircularProgress size={16} color="inherit" />
                Guardando...
              </span>
            ) : (
              'Guardar cambios'
            )}
          </DefaultButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default EstablishmentFormDialog