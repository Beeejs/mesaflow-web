
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

/* API */
import { searchEstablishmentUser } from '../../../api/establishmentUserService'

/* Hooks */
import useEstablishmentRolesQuery from '../../../hooks/queries/useEstablishmentRolesQuery'
import useAddEstablishmentUserMutation from '../../../hooks/mutations/useAddEstablishmentUserMutation'
import useUpdateEstablishmentUserMutation from '../../../hooks/mutations/useUpdateEstablishmentUserMutation'

const textFieldStyles = {
  '& .MuiOutlinedInput-root': {
    color: '#F8FAFC',
    backgroundColor: '#03070F',
    borderRadius: '14px',

    '& fieldset': {
      borderColor: '#1F2937',
    },

    '&:hover fieldset': {
      borderColor: '#056EF8',
    },

    '&.Mui-focused fieldset': {
      borderColor: '#10C4FC',
    },

    '&.Mui-disabled': {
      backgroundColor: '#111827',
    },
  },

  '& .MuiInputBase-input.Mui-disabled': {
    WebkitTextFillColor: '#94A3B8',
  },

  '& .MuiSelect-select.Mui-disabled': {
    WebkitTextFillColor: '#94A3B8',
  },

  '& .MuiInputLabel-root': {
    color: '#94A3B8',
  },

  '& .MuiInputLabel-root.Mui-focused': {
    color: '#10C4FC',
  },

  '& .MuiInputLabel-root.Mui-disabled': {
    color: '#64748B',
  },

  '& .MuiSvgIcon-root': {
    color: '#94A3B8',
  },
}


const EstablishmentUserFormDialog = ({
  open,
  user = null,
  idEstablecimiento,
  onClose,
}) => {
  const isEditing = Boolean(user)

  const [email, setEmail] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRoleId, setSelectedRoleId] = useState(
    user?.idRolEstablecimiento ?? ''
  )
  const [isSearching, setIsSearching] = useState(false)

  const { data: roles = [], isLoading: rolesLoading } =
    useEstablishmentRolesQuery()

  const addMutation =
    useAddEstablishmentUserMutation(idEstablecimiento)

  const updateMutation =
    useUpdateEstablishmentUserMutation(idEstablecimiento)

  const isSaving =
    addMutation.isPending || updateMutation.isPending

  const isBusy = isSaving || isSearching

  // En edición utilizamos el usuario recibido.
  // En alta, el usuario obtenido mediante la búsqueda.
  const currentUser = isEditing ? user : selectedUser

  const hasChanges =
    Number(selectedRoleId) !==
    Number(user?.idRolEstablecimiento)

  const handleClose = () => {
    if (!isBusy) onClose()
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    setSelectedUser(null)
    setSelectedRoleId('')
  }

  const handleSearch = async (event) => {
    event.preventDefault()

    if (isBusy || isEditing) return

    const trimmedEmail = email.trim()

    if (!trimmedEmail) {
      toast.error('Ingresá el email del usuario.')
      return
    }

    setIsSearching(true)
    setSelectedUser(null)
    setSelectedRoleId('')

    try {
      const foundUser = await searchEstablishmentUser(
        idEstablecimiento,
        trimmedEmail
      )

      if (!foundUser) {
        toast.error('No se encontró el usuario.')
        return
      }

      setSelectedUser(foundUser)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'No se pudo buscar el usuario.'
      )
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isBusy || !currentUser || !selectedRoleId) return

    if (isEditing && !hasChanges) {
      toast.info('No hay cambios para guardar.')
      return
    }

    const payload = {
      idUsuario: currentUser.idUsuario,
      idRolEstablecimiento: Number(selectedRoleId),
    }

    try {
      if (isEditing) {
        await updateMutation.mutateAsync(payload)
        toast.success('Rol actualizado correctamente.')
      } else {
        await addMutation.mutateAsync(payload)
        toast.success('Usuario agregado correctamente.')
      }

      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          (isEditing
            ? 'No se pudo actualizar el rol.'
            : 'No se pudo agregar el usuario.')
      )
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            borderRadius: '24px',
            border: '1px solid #1F2937',
            backgroundColor: '#0B111C',
            color: '#F8FAFC',
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
      <DialogTitle
        sx={{
          px: { xs: 3, sm: 4 },
          pt: 4,
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 800,
        }}
      >
        {isEditing ? 'Modificar rol' : 'Agregar usuario'}
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 3, sm: 4 },
          pt: 2,
          pb: 3,
        }}
      >
        <p className="mb-6 text-sm leading-6 text-mesa-muted">
          {isEditing
            ? 'Modificá el rol de este usuario dentro del establecimiento.'
            : 'Buscá un usuario registrado en MesaFlow y asignale un rol dentro del establecimiento.'}
        </p>

        {/* Búsqueda: únicamente al agregar */}
        {!isEditing && (
          <form onSubmit={handleSearch}>
            <div className="flex flex-col gap-3 sm:flex-row">
              <TextField
                label="Email del usuario"
                type="email"
                value={email}
                onChange={handleEmailChange}
                disabled={isBusy}
                fullWidth
                required
                sx={textFieldStyles}
              />

              <DefaultButton
                type="submit"
                disabled={isBusy || !email.trim()}
              >
                {isSearching ? 'Buscando...' : 'Buscar'}
              </DefaultButton>
            </div>
          </form>
        )}

        {/* Formulario compartido entre alta y edición */}
        {currentUser && (
          <form onSubmit={handleSubmit}>
            <div className="mt-6 rounded-2xl border border-mesa-border bg-mesa-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-mesa-cyan">
                {isEditing
                  ? 'Usuario seleccionado'
                  : 'Usuario encontrado'}
              </p>

              <p className="mt-3 font-semibold text-mesa-text">
                {currentUser.nombre} {currentUser.apellido}
              </p>

              <p className="mt-1 break-all text-sm text-mesa-muted">
                {currentUser.email}
              </p>
            </div>

            <div className="mt-6">
              <TextField
                select
                label="Rol en el establecimiento"
                value={
                  roles.some(
                    (role) =>
                      role.idRolEstablecimiento ===
                      Number(selectedRoleId)
                  )
                    ? selectedRoleId
                    : ''
                }
                onChange={(event) =>
                  setSelectedRoleId(event.target.value)
                }
                disabled={rolesLoading || isSaving}
                fullWidth
                required
                sx={textFieldStyles}
                slotProps={{
                  select: {
                    MenuProps: {
                      slotProps: {
                        paper: {
                          sx: {
                            backgroundColor: '#0B111C',
                            color: '#F8FAFC',
                            border: '1px solid #1F2937',
                            borderRadius: '16px',
                          },
                        },
                      },
                    },
                  },
                }}
              >
                {roles.map((role) => (
                  <MenuItem
                    key={role.idRolEstablecimiento}
                    value={role.idRolEstablecimiento}
                  >
                    {role.descripcion}
                  </MenuItem>
                ))}
              </TextField>
            </div>

            <div className="mt-8 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={isBusy}
                className="cursor-pointer rounded-full border border-mesa-border px-5 py-3 text-sm font-bold text-mesa-muted transition hover:border-mesa-primary/60 hover:bg-mesa-card hover:text-mesa-text disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <DefaultButton
                type="submit"
                disabled={isBusy || rolesLoading || !selectedRoleId}
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <CircularProgress size={16} color="inherit" />
                    Guardando...
                  </span>
                ) : (
                  isEditing ? 'Guardar cambios' : 'Agregar usuario'
                )}
              </DefaultButton>
            </div>
          </form>
        )}
      </DialogContent>

      {!currentUser && (
        <DialogActions
          sx={{ px: { xs: 3, sm: 4 }, pb: 4 }}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            className="cursor-pointer rounded-full border border-mesa-border px-5 py-3 text-sm font-bold text-mesa-muted transition hover:bg-mesa-card disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancelar
          </button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default EstablishmentUserFormDialog

