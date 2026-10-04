import { useState } from 'react'
import { toast } from 'sonner'

/* MUI */
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

/* Components */
import DashboardFormDialog from '../../DashboardFormDialog'

/* Hooks */
import useEstablishmentsQuery from '../../../../hooks/queries/useEstablishmentsQuery'
import useEstablishmentRolesQuery from '../../../../hooks/queries/useEstablishmentRolesQuery'
import useAddEstablishmentUserMutation from '../../../../hooks/mutations/useAddEstablishmentUserMutation'

/* Styles */
import {
  textFieldStyles,
  selectSlotProps,
} from '../../../../styles/formStyles'

const AssignUserEstablishmentDialog = ({
  open,
  user,
  onClose,
}) => {
  // Hooks
  const [selectedEstablishmentId, setSelectedEstablishmentId] = useState('')
  const [selectedRoleId, setSelectedRoleId] = useState('')

  const {
    data: establishments = [],
    isLoading: establishmentsLoading,
  } = useEstablishmentsQuery()

  const {
    data: roles = [],
    isLoading: rolesLoading,
  } = useEstablishmentRolesQuery()

  const assignMutation =
    useAddEstablishmentUserMutation(selectedEstablishmentId)

  // Constantes derivadas
  const isSaving = assignMutation.isPending

  const isLoading =
    establishmentsLoading ||
    rolesLoading

  const establishmentValue = establishments.some(
    (establishment) =>
      establishment.idEstablecimiento ===
      Number(selectedEstablishmentId)
  )
    ? selectedEstablishmentId
    : ''

  const roleValue = roles.some(
    (role) =>
      role.idRolEstablecimiento ===
      Number(selectedRoleId)
  )
    ? selectedRoleId
    : ''

  // Funciones
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (
      isSaving ||
      !selectedEstablishmentId ||
      !selectedRoleId
    ) {
      return
    }

    try {
      await assignMutation.mutateAsync({
        idUsuario: user.idUsuario,
        idRolEstablecimiento: Number(selectedRoleId),
      })

      toast.success(
        'Usuario asignado al establecimiento correctamente.'
      )

      onClose()
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'No se pudo asignar el usuario al establecimiento.'
      )
    }
  }

  // Renderizado
  return (
    <DashboardFormDialog
      open={open}
      title="Asignar a establecimiento"
      description="Seleccioná el establecimiento y el rol que tendrá el usuario."
      onClose={onClose}
      onSubmit={handleSubmit}
      isBusy={isSaving}
      submitDisabled={
        isLoading ||
        !selectedEstablishmentId ||
        !selectedRoleId
      }
      submitLabel="Asignar"
    >
      <div className="mb-6 rounded-2xl border border-mesa-border bg-mesa-bg p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-mesa-cyan">
          Usuario seleccionado
        </p>

        <p className="mt-3 font-semibold text-mesa-text">
          {user.nombre} {user.apellido}
        </p>

        <p className="mt-1 break-all text-sm text-mesa-muted">
          {user.email}
        </p>
      </div>

      <div className="grid gap-4">
        <TextField
          select
          label="Establecimiento"
          value={establishmentValue}
          onChange={(event) =>
            setSelectedEstablishmentId(event.target.value)
          }
          disabled={establishmentsLoading || isSaving}
          fullWidth
          required
          helperText={
            establishmentsLoading
              ? 'Cargando establecimientos...'
              : ' '
          }
          sx={textFieldStyles}
          slotProps={selectSlotProps}
        >
          <MenuItem value="" disabled>
            {establishmentsLoading
              ? 'Cargando establecimientos...'
              : 'Seleccioná un establecimiento'}
          </MenuItem>

          {establishments.map((establishment) => (
            <MenuItem
              key={establishment.idEstablecimiento}
              value={establishment.idEstablecimiento}
            >
              {establishment.nombre}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="Rol en el establecimiento"
          value={roleValue}
          onChange={(event) =>
            setSelectedRoleId(event.target.value)
          }
          disabled={rolesLoading || isSaving}
          fullWidth
          required
          helperText={
            rolesLoading
              ? 'Cargando roles...'
              : ' '
          }
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
    </DashboardFormDialog>
  )
}

export default AssignUserEstablishmentDialog