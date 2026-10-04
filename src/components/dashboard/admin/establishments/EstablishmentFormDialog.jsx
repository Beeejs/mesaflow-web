
import { useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DashboardFormDialog from '../../DashboardFormDialog'

/* Hooks */
import useProvincesQuery from '../../../../hooks/queries/useProvincesQuery'
import useDistrictsQuery from '../../../../hooks/queries/useDistrictsQuery'
import useEstablishmentStatesQuery from '../../../../hooks/queries/useEstablishmentStatesQuery'
import useUpdateEstablishmentMutation from '../../../../hooks/mutations/useUpdateEstablishmentMutation'

/* Utils */
import { hasFormChanges } from '../../../../utils/formUtils'

/* Constants */
import { establishmentFields } from '../../../../constants/constants'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../../styles/formStyles'

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
    <DashboardFormDialog
      open={open}
      title="Editar establecimiento"
      description="Modificá los datos del establecimiento y gestioná su estado."
      onClose={onClose}
      onSubmit={handleSubmit}
      isBusy={isSaving}
      submitDisabled={selectsLoading}
      submitLabel="Guardar cambios"
    >
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
    </DashboardFormDialog>
  )
}

export default EstablishmentFormDialog