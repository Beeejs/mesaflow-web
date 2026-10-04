import { useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

/* Components */
import DashboardFormDialog from '../../DashboardFormDialog'

/* Hooks */
import useRolesQuery from '../../../../hooks/queries/useRolesQuery'
import useUpdateUserMutation from '../../../../hooks/mutations/useUpdateUserMutation'

/* Constants */
import { userFields } from '../../../../constants/constants'

/* Utils */
import { hasFormChanges } from '../../../../utils/formUtils'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../../styles/formStyles'

const UserFormDialog = ({
  open,
  user,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    rol: user?.rol || '',
    activo: Boolean(user?.activo),
  })

  const {
    data: rolesData = [],
    isLoading: rolesLoading,
  } = useRolesQuery()

  const updateUserMutation = useUpdateUserMutation()

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }))
  }

  const handleActiveChange = (event) => {
    setFormData((currentData) => ({
      ...currentData,
      activo: event.target.checked,
    }))
  }

  // Función para manejar el envío del formulario
  const handleSubmit = async (event) => {
    event.preventDefault()

    // Si ya se está guardando, no hacer nada
    if (isSaving) return

    // Si no hay cambios en el formulario, mostrar un mensaje y no hacer nada
    if (!hasFormChanges(user, formData, userFields)) {
      toast.info('No hay cambios para guardar.')
      return
    }

    const selectedRole = rolesData.find((role) =>
      role.descripcion === formData.rol
    )

    if (
      !formData.nombre.trim() ||
      !formData.apellido.trim() ||
      !selectedRole
    ) {
      toast.error('Completá los campos obligatorios.')
      return
    }

    try {
      await updateUserMutation.mutateAsync({
        idUsuario: user.idUsuario,
        userData: {
          nombre: formData.nombre.trim(),
          apellido: formData.apellido.trim(),
          idRol: selectedRole.idRol,
          activo: formData.activo,
        },
      })

      toast.success('Usuario actualizado correctamente.')
      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'No se pudo actualizar el usuario.'
      )
    }
  }

  const isSaving = updateUserMutation.isPending

  const roleExists = rolesData.some((role) =>
    role.descripcion === formData.rol
  )

  const selectedRoleValue = roleExists ? formData.rol : ''

  return (
    <DashboardFormDialog
      open={open}
      title="Editar usuario"
      description="Modificá los datos principales del usuario seleccionado."
      onClose={onClose}
      onSubmit={handleSubmit}
      isBusy={isSaving}
      submitDisabled={rolesLoading}
      submitLabel="Guardar cambios"
    >
      {user?.email && (
        <div className="mb-5 rounded-2xl border border-mesa-border bg-mesa-bg px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mesa-muted">
            Email
          </p>

          <p className="mt-1 text-sm font-semibold text-mesa-text">
            {user.email}
          </p>
        </div>
      )}

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
          label="Apellido"
          name="apellido"
          value={formData.apellido}
          onChange={handleChange}
          disabled={isSaving}
          fullWidth
          required
          sx={textFieldStyles}
        />
      </div>

      <div className="mt-4">
        <TextField
          select
          label="Rol"
          name="rol"
          value={selectedRoleValue}
          onChange={handleChange}
          disabled={rolesLoading || isSaving}
          fullWidth
          required
          helperText={rolesLoading ? 'Cargando roles...' : ' '}
          sx={textFieldStyles}
          slotProps={selectSlotProps}
        >
          <MenuItem value="" disabled>
            {rolesLoading ? 'Cargando roles...' : 'Seleccioná un rol'}
          </MenuItem>

          {rolesData.map((role) => (
            <MenuItem
              key={role.idRol}
              value={role.descripcion}
            >
              {role.descripcion}
            </MenuItem>
          ))}
        </TextField>
      </div>

      <div className="mt-2 rounded-2xl border border-mesa-border bg-mesa-bg px-4 py-3">
        <FormControlLabel
          control={
            <Switch
              checked={formData.activo}
              onChange={handleActiveChange}
              disabled={isSaving}
              sx={{
                '& .MuiSwitch-switchBase.Mui-checked': {
                  color: '#10C4FC',
                },

                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                  backgroundColor: '#056EF8',
                },

                '& .MuiSwitch-switchBase.Mui-disabled': {
                  color: '#64748B',
                },

                '& .MuiSwitch-switchBase.Mui-checked.Mui-disabled': {
                  color: '#10C4FC',
                },

                '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
                  opacity: 0.35,
                },
              }}
            />
          }
          label={formData.activo ? 'Usuario activo' : 'Usuario inactivo'}
          sx={{
            color: '#F8FAFC',

            '& .MuiFormControlLabel-label': {
              fontSize: 14,
              fontWeight: 700,
            },
          }}
        />
      </div>
    </DashboardFormDialog>
  )
}

export default UserFormDialog