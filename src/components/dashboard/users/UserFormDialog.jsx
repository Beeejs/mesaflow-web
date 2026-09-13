import { useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import FormControlLabel from '@mui/material/FormControlLabel'
import MenuItem from '@mui/material/MenuItem'
import Switch from '@mui/material/Switch'
import TextField from '@mui/material/TextField'

/* Components */
import DefaultButton from '../../button/DefaultButton'

/* Hooks */
import useRolesQuery from '../../../hooks/queries/useRolesQuery'
import useUpdateUserMutation from '../../../hooks/mutations/useUpdateUserMutation'

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

  '& .MuiFormHelperText-root': {
    color: '#94A3B8',
  },

  '& .MuiSvgIcon-root': {
    color: '#94A3B8',
  },
}

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

  const handleSubmit = async (event) => {
    event.preventDefault()

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
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
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
            px: 4,
            pt: 4,
            pb: 1,
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 800,
          }}
        >
          Editar usuario
        </DialogTitle>

        <DialogContent
          sx={{
            px: 4,
            pt: 2,
            pb: 3,
          }}
        >
          <p className="mb-6 text-sm text-mesa-muted">
            Modificá los datos principales del usuario seleccionado.
          </p>

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
              slotProps={{
                select: {
                  MenuProps: {
                    PaperProps: {
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

                        '& .MuiMenuItem-root.Mui-selected:hover': {
                          backgroundColor: 'rgba(5, 110, 248, 0.25)',
                        },
                      },
                    },
                  },
                },
              }}
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
        </DialogContent>

        <DialogActions
          sx={{
            px: 4,
            pb: 4,
            gap: 2,
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="cursor-pointer rounded-full border border-mesa-border px-5 py-3 text-sm font-bold text-mesa-muted transition hover:border-mesa-primary/60 hover:bg-mesa-card hover:text-mesa-text disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>

          <DefaultButton
            type="submit"
            disabled={isSaving || rolesLoading}
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

export default UserFormDialog