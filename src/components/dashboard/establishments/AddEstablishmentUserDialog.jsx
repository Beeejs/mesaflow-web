
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

const AddEstablishmentUserDialog = ({
  open,
  idEstablecimiento,
  onClose,
}) => {
  const [email, setEmail] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [selectedRoleId, setSelectedRoleId] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  const {
    data: roles = [],
    isLoading: rolesLoading,
  } = useEstablishmentRolesQuery()

  const addMutation = useAddEstablishmentUserMutation(idEstablecimiento)

  const isSaving = addMutation.isPending
  const isBusy = isSaving || isSearching

  const handleSearch = async (event) => {
    event.preventDefault()

    if (isBusy) return

    if (!email.trim()) {
      toast.error('Ingresá el email del usuario.')
      return
    }

    try {
      setIsSearching(true)
      setSelectedUser(null)
      setSelectedRoleId('')

      const user = await searchEstablishmentUser(
        idEstablecimiento,
        email.trim()
      )

      if (!user) {
        toast.error('No se encontró el usuario.')
        return
      }

      setSelectedUser(user)
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'No se pudo buscar el usuario.'
      )
    } finally {
      setIsSearching(false)
    }
  }

  const handleEmailChange = (event) => {
    setEmail(event.target.value)
    setSelectedUser(null)
    setSelectedRoleId('')
  }

  const handleClose = () => {
    if (isBusy) return
    onClose()
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isBusy) return

    if (!selectedUser || !selectedRoleId) {
      toast.error('Seleccioná un usuario y un rol.')
      return
    }

    try {
      await addMutation.mutateAsync({
        idUsuario: selectedUser.idUsuario,
        idRolEstablecimiento: Number(selectedRoleId),
      })

      toast.success('Usuario agregado correctamente.')
      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'No se pudo agregar el usuario.'
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
        Agregar usuario
      </DialogTitle>

      <DialogContent
        sx={{
          px: { xs: 3, sm: 4 },
          pt: 2,
          pb: 3,
        }}
      >
        <p className="mb-6 text-sm leading-6 text-mesa-muted">
          Buscá un usuario registrado en MesaFlow y asignale
          un rol dentro del establecimiento.
        </p>

        {/* Buscar usuario */}
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

        {/* Usuario encontrado */}
        {selectedUser && (
          <form onSubmit={handleSubmit}>
            <div className="mt-6 rounded-2xl border border-mesa-border bg-mesa-bg p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-mesa-cyan">
                Usuario encontrado
              </p>

              <p className="mt-3 font-semibold text-mesa-text">
                {selectedUser.nombre} {selectedUser.apellido}
              </p>

              <p className="mt-1 break-all text-sm text-mesa-muted">
                {selectedUser.email}
              </p>
            </div>

            <div className="mt-6">
              <TextField
                select
                label="Rol en el establecimiento"
                value={selectedRoleId}
                onChange={(event) =>
                  setSelectedRoleId(event.target.value)
                }
                disabled={rolesLoading || isSaving}
                fullWidth
                required
                sx={textFieldStyles}
                SelectProps={{
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
                className="cursor-pointer rounded-full border border-mesa-border px-5 py-3 text-sm font-bold text-mesa-muted transition hover:bg-mesa-card disabled:cursor-not-allowed disabled:opacity-60"
              >
                Cancelar
              </button>

              <DefaultButton
                type="submit"
                disabled={
                  isSaving ||
                  rolesLoading ||
                  !selectedRoleId
                }
              >
                {isSaving ? (
                  <span className="flex items-center gap-2">
                    <CircularProgress
                      size={16}
                      color="inherit"
                    />
                    Guardando...
                  </span>
                ) : (
                  'Agregar usuario'
                )}
              </DefaultButton>
            </div>
          </form>
        )}
      </DialogContent>

      {!selectedUser && (
        <DialogActions
          sx={{
            px: { xs: 3, sm: 4 },
            pb: 4,
          }}
        >
          <button
            type="button"
            onClick={handleClose}
            disabled={isBusy}
            className="cursor-pointer rounded-full border border-mesa-border px-5 py-3 text-sm font-bold text-mesa-muted transition hover:bg-mesa-card disabled:opacity-60"
          >
            Cancelar
          </button>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default AddEstablishmentUserDialog
