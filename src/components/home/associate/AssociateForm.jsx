import { useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DefaultButton from '../../common/button/DefaultButton'

/* Hooks */
import useProvincesQuery from '../../../hooks/queries/useProvincesQuery'
import useDistrictsQuery from '../../../hooks/queries/useDistrictsQuery'
import useCreateEstablishmentMutation from '../../../hooks/mutations/useCreateEstablishmentMutation'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../styles/formStyles'

const AssociateForm = ({ onClose }) => {
  // Hooks
  const [formData, setFormData] = useState({
    nombre: '',
    razonSocial: '',
    cuit: '',
    direccion: '',
    idProvincia: '',
    idPartido: '',
    codigoPostal: '',
    telefono: '',
    email: '',
  })

  const {
    data: provinces = [],
    isLoading: provincesLoading,
  } = useProvincesQuery()

  const {
    data: districts = [],
    isLoading: districtsLoading,
  } = useDistrictsQuery(formData.idProvincia)

  const createMutation = useCreateEstablishmentMutation()

  // Constantes derivadas
  const isSaving = createMutation.isPending

  const selectedProvince = provinces.some(
    (province) =>
      province.idProvincia === Number(formData.idProvincia)
  )
    ? formData.idProvincia
    : ''

  const selectedDistrict = districts.some(
    (district) =>
      district.idPartido === Number(formData.idPartido)
  )
    ? formData.idPartido
    : ''

  // Funciones
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

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isSaving) return

    if (
      !formData.nombre.trim() ||
      !formData.direccion.trim() ||
      !selectedDistrict
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
    }

    try {
      await createMutation.mutateAsync(establishmentData)

      toast.success(
        'Solicitud enviada correctamente. El establecimiento quedó pendiente de revisión.'
      )

      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'No se pudo enviar la solicitud.'
      )
    }
  }

  // Renderizado
  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Nombre del establecimiento"
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
          type="tel"
          sx={textFieldStyles}
        />

        <TextField
          label="Email de contacto"
          name="email"
          value={formData.email}
          onChange={handleChange}
          disabled={isSaving}
          fullWidth
          type="email"
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
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          select
          label="Provincia"
          name="idProvincia"
          value={selectedProvince}
          onChange={handleProvinceChange}
          disabled={provincesLoading || isSaving}
          fullWidth
          required
          helperText={
            provincesLoading ? 'Cargando provincias...' : ' '
          }
          sx={textFieldStyles}
          slotProps={selectSlotProps}
        >
          <MenuItem value="" disabled>
            {provincesLoading
              ? 'Cargando provincias...'
              : 'Seleccioná una provincia'}
          </MenuItem>

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
          helperText={
            districtsLoading ? 'Cargando partidos...' : ' '
          }
          sx={textFieldStyles}
          slotProps={selectSlotProps}
        >
          <MenuItem value="" disabled>
            {districtsLoading
              ? 'Cargando partidos...'
              : 'Seleccioná un partido'}
          </MenuItem>

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

      <DefaultButton
        type="submit"
        loading={isSaving}
        fullWidth
      >
        {isSaving ? 'Enviando...' : 'Enviar solicitud'}
      </DefaultButton>

      <p className="text-sm leading-6 text-mesa-muted">
        La solicitud será revisada antes de habilitar el establecimiento.
      </p>
    </form>
  )
}

export default AssociateForm