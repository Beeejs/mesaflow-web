
import { useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DashboardFormDialog from '../DashboardFormDialog'

/* API */
import { searchEstablishmentUser } from '../../../api/establishmentUserService'

/* Hooks */
import useEstablishmentRolesQuery from '../../../hooks/queries/useEstablishmentRolesQuery'
import useAddEstablishmentUserMutation from '../../../hooks/mutations/useAddEstablishmentUserMutation'
import useUpdateEstablishmentUserMutation from '../../../hooks/mutations/useUpdateEstablishmentUserMutation'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../styles/formStyles'


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

  // Función que maneja el envío del formulario.
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

  const handleFormSubmit = (event) => {
    if (!currentUser) {
      return handleSearch(event)
    }

    return handleSubmit(event)
  }

  
  return (
    <DashboardFormDialog
      open={open}
      title={isEditing ? 'Modificar rol' : 'Agregar usuario'}
      description={
        isEditing
          ? 'Modificá el rol de este usuario dentro del establecimiento.'
          : 'Buscá un usuario registrado en MesaFlow y asignale un rol dentro del establecimiento.'
      }
      onClose={handleClose}
      onSubmit={handleFormSubmit}
      isBusy={isBusy}
      submitDisabled={
        currentUser
          ? rolesLoading || !selectedRoleId
          : !email.trim()
      }
      submitLabel={
        isEditing
          ? 'Guardar cambios'
          : currentUser
            ? 'Agregar usuario'
            : 'Buscar usuario'
      }
      busyLabel={isSearching ? 'Buscando...' : 'Guardando...'}
    >
      {/* Búsqueda: únicamente en modo agregar */}
      {!isEditing && (
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
      )}

      {/* Datos y rol: compartidos entre alta y edición */}
      {currentUser && (
        <>
          <div
            className={`rounded-2xl border border-mesa-border bg-mesa-bg p-4 ${
              isEditing ? '' : 'mt-6'
            }`}
          >
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
              helperText={rolesLoading ? 'Cargando roles...' : ' '}
              sx={textFieldStyles}
              slotProps={selectSlotProps}
            >
              <MenuItem value="" disabled>
                {rolesLoading
                  ? 'Cargando roles...'
                  : 'Seleccioná un rol'}
              </MenuItem>

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
        </>
      )}
    </DashboardFormDialog>
  )

}

export default EstablishmentUserFormDialog

